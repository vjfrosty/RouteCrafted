import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";
import {
  getDaysByTrip,
  deleteDayItems,
  insertItems,
  updateDay,
} from "@/lib/db/itinerary";
import { getActivePrompt, getAllSettings } from "@/lib/db/ai-config";
import { generateJSON } from "@/lib/ai/openrouter";
import { interpolate } from "@/lib/ai/interpolate";
import { rewriteDayResponseSchema } from "@/lib/ai/schemas";

const bodySchema = z.object({
  tripId: z.string().uuid(),
  dayId: z.string().uuid(),
  forecastCode: z.number().int().optional(),
  weatherLabel: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const { tripId, dayId, forecastCode, weatherLabel, reason } = parsed.data;

  const trip = await getTripById(tripId, session.user.id);
  if (!trip) return new NextResponse("Not Found", { status: 404 });

  const days = await getDaysByTrip(tripId);
  const day = days.find((d) => d.id === dayId);
  if (!day) return new NextResponse("Day Not Found", { status: 404 });

  // Fetch prompt template + settings from DB
  const [promptRow, settings] = await Promise.all([
    getActivePrompt("rewrite_day"),
    getAllSettings(),
  ]);
  if (!promptRow)
    return NextResponse.json(
      { error: "No active prompt found for rewrite_day" },
      { status: 503 },
    );

  const model = settings.find((s) => s.key === "model")?.value;
  const weatherContextTpl =
    settings.find((s) => s.key === "rewrite_day_weather_context")?.value ?? "";
  const reasonContextTpl =
    settings.find((s) => s.key === "rewrite_day_reason_context")?.value ?? "";

  // Build the weatherContext block from configurable templates
  const weatherContext = weatherLabel
    ? interpolate(weatherContextTpl, {
        weatherLabel,
        forecastCode: String(forecastCode ?? ""),
      })
    : reason
    ? interpolate(reasonContextTpl, { reason })
    : "";

  const prompt = interpolate(promptRow.template, {
    destination: trip.destination,
    country: trip.country,
    dayNumber: String(day.dayNumber),
    date: day.date,
    theme: day.theme,
    summary: day.summary,
    budgetRange: trip.budgetRange,
    travelStyle: trip.travelStyle,
    groupType: trip.groupType,
    pacing: trip.pacing,
    weatherContext,
  });

  let rawResponse: unknown;
  try {
    rawResponse = await generateJSON<unknown>(prompt, model);
  } catch {
    return NextResponse.json(
      { error: "AI generation failed — check OPENROUTER_API_KEY" },
      { status: 502 },
    );
  }

  const validated = rewriteDayResponseSchema.safeParse(rawResponse);
  if (!validated.success)
    return NextResponse.json(
      { error: "AI returned invalid structure", details: validated.error.issues },
      { status: 422 },
    );

  const newDay = validated.data;

  await deleteDayItems(dayId);
  await insertItems(
    newDay.items.map((item, idx) => ({
      dayId,
      position: idx + 1,
      timeBlock: item.timeBlock,
      type: item.type,
      title: item.title,
      description: item.description,
      location: item.location,
      durationMins: item.durationMins,
      estimatedCost: String(item.estimatedCost),
      isOptional: item.isOptional,
    })),
  );

  const updatedDay = await updateDay(dayId, {
    theme: newDay.theme,
    summary: newDay.summary,
    rewrittenAt: new Date(),
    ...(weatherLabel !== undefined && { weatherLabel }),
    ...(forecastCode !== undefined && { weatherCode: forecastCode }),
  });

  return NextResponse.json({ day: updatedDay });
}
