import { Resend } from "resend";

// Lazy client — avoids throwing at module load if RESEND_API_KEY is not set
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const FROM = "RouteCrafted <noreply@routecrafted.com>";

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Welcome to RouteCrafted 🗺️",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0f172a;color:#e2e8f0;font-family:system-ui,sans-serif;padding:32px;">
  <div style="max-width:560px;margin:0 auto;">
    <h1 style="font-size:24px;color:#f8fafc;margin-bottom:8px;">Welcome, ${name}! 🗺️</h1>
    <p style="color:#94a3b8;margin-top:0;">Thanks for joining <strong style="color:#3b82f6;">RouteCrafted</strong> — your AI travel planner.</p>

    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;margin:24px 0;">
      <h2 style="font-size:16px;color:#f1f5f9;margin-top:0;">Get started in 3 steps</h2>
      <ol style="color:#94a3b8;padding-left:20px;line-height:1.8;">
        <li>Create a trip — pick your destination and travel dates.</li>
        <li>Generate your AI itinerary — day-by-day plan in seconds.</li>
        <li>Review place cards — Worth It / Skip It verdicts for every attraction.</li>
      </ol>
    </div>

    <a href="https://routecrafted.com/trips/new"
       style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;
              padding:12px 24px;border-radius:8px;font-weight:600;">
      Plan your first trip →
    </a>

    <p style="color:#475569;font-size:12px;margin-top:32px;">
      You're receiving this because you registered at routecrafted.com.
    </p>
  </div>
</body>
</html>`,
  });
}

export async function sendWeatherAlertEmail(
  to: string,
  name: string,
  destination: string,
  dayDate: string,
  weatherLabel: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `⚠️ Weather alert for your trip to ${destination}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0f172a;color:#e2e8f0;font-family:system-ui,sans-serif;padding:32px;">
  <div style="max-width:560px;margin:0 auto;">
    <h1 style="font-size:22px;color:#f8fafc;">⚠️ Weather alert — ${destination}</h1>
    <p style="color:#94a3b8;">Hi ${name}, a new weather condition has been detected for your trip.</p>

    <div style="background:#1e293b;border:1px solid #f59e0b40;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0;color:#fcd34d;font-weight:600;">${weatherLabel} expected on ${dayDate}</p>
    </div>

    <a href="https://routecrafted.com/dashboard"
       style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;
              padding:12px 24px;border-radius:8px;font-weight:600;">
      View &amp; replan →
    </a>
  </div>
</body>
</html>`,
  });
}
