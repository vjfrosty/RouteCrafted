import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { apiFetch } from "@/lib/api";

interface ItineraryItem {
  id: string;
  title: string;
  description: string | null;
  startTime: string | null;
  estimatedCost: string | null;
  placeCardId: string | null;
}

interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string;
  weatherSummary: string | null;
  items: ItineraryItem[];
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  notes: string | null;
  days: ItineraryDay[];
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTrip() {
    try {
      setError(null);
      const data = await apiFetch<Trip>(`/api/mobile/trips/${id}`);
      setTrip(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load trip");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadTrip();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Trip not found"}</Text>
        <TouchableOpacity onPress={loadTrip} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadTrip(); }}
          tintColor="#3b82f6"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.destination}>{trip.destination}</Text>
        <View style={[styles.badge, trip.status === "completed" ? styles.badgeDone : styles.badgeActive]}>
          <Text style={styles.badgeText}>{trip.status}</Text>
        </View>
      </View>
      <Text style={styles.dates}>
        {new Date(trip.startDate).toLocaleDateString()} –{" "}
        {new Date(trip.endDate).toLocaleDateString()}
      </Text>

      {trip.notes && <Text style={styles.notes}>{trip.notes}</Text>}

      {/* Days */}
      {trip.days.length === 0 ? (
        <Text style={styles.emptyMsg}>
          No itinerary generated yet. Visit the website to generate your plan.
        </Text>
      ) : (
        trip.days.map((day) => (
          <View key={day.id} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
              <Text style={styles.dayDate}>
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>

            {day.weatherSummary && (
              <Text style={styles.weather}>🌤 {day.weatherSummary}</Text>
            )}

            {day.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                onPress={() =>
                  item.placeCardId
                    ? router.push({ pathname: "/card/[id]", params: { id: item.placeCardId } })
                    : null
                }
                activeOpacity={item.placeCardId ? 0.7 : 1}
              >
                <View style={styles.itemLeft}>
                  {item.startTime && (
                    <Text style={styles.itemTime}>{item.startTime}</Text>
                  )}
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.itemDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  {item.estimatedCost && (
                    <Text style={styles.itemCost}>~{item.estimatedCost}</Text>
                  )}
                </View>
                {item.placeCardId && (
                  <Ionicons name="chevron-forward" size={16} color="#475569" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  destination: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  badgeActive: { backgroundColor: "#1d4ed8" },
  badgeDone: { backgroundColor: "#14532d" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "500" },
  dates: { color: "#94a3b8", fontSize: 13, marginBottom: 8 },
  notes: {
    color: "#94a3b8",
    fontSize: 13,
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  emptyMsg: { color: "#64748b", textAlign: "center", marginTop: 32, fontSize: 14 },
  dayCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dayTitle: { color: "#f1f5f9", fontWeight: "700", fontSize: 15 },
  dayDate: { color: "#64748b", fontSize: 13 },
  weather: { color: "#94a3b8", fontSize: 12, marginBottom: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    gap: 8,
  },
  itemLeft: { flex: 1 },
  itemTime: { color: "#3b82f6", fontSize: 11, marginBottom: 2 },
  itemTitle: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  itemDesc: { color: "#64748b", fontSize: 12, marginTop: 2 },
  itemCost: { color: "#22c55e", fontSize: 12, marginTop: 2 },
  errorText: { color: "#f87171", marginBottom: 12, textAlign: "center" },
  retryBtn: {
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
