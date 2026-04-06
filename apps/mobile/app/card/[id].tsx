import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { apiFetch } from "@/lib/api";

interface PlaceCard {
  id: string;
  placeName: string;
  category: string;
  verdict: string;
  worthItReasons: string[];
  skipItReasons: string[];
  bestTimeToVisit: string | null;
  estimatedCost: string | null;
  summary: string | null;
}

// The mobile cards endpoint accepts a tripId, not a cardId directly.
// We fetch all cards for the trip and filter — or we pass the card via router params.
// This screen fetches cards by tripId (passed as id param) and shows a single card
// when reached by placeCardId. We embed the placeCardId in the route and
// fetch via the cards endpoint, then display the matching one.
export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<PlaceCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // The id here IS the placeCardId — we call a dedicated endpoint
        // GET /api/mobile/cards/:cardId  (single card, no tripId needed)
        // Fallback: we added that endpoint. If not, gracefully handle.
        const data = await apiFetch<PlaceCard>(`/api/mobile/card/${id}`);
        setCard(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load card");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Card not found"}</Text>
      </View>
    );
  }

  const isWorthIt = card.verdict === "worth_it";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.titleRow}>
        <Text style={styles.placeName}>{card.placeName}</Text>
        <View style={[styles.badge, isWorthIt ? styles.badgeWorth : styles.badgeSkip]}>
          <Text style={styles.badgeText}>
            {isWorthIt ? "Worth It ✓" : "Skip It ✗"}
          </Text>
        </View>
      </View>

      <Text style={styles.category}>{card.category.replace(/_/g, " ")}</Text>

      {card.summary && <Text style={styles.summary}>{card.summary}</Text>}

      {/* Meta */}
      <View style={styles.metaRow}>
        {card.estimatedCost && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>💰 {card.estimatedCost}</Text>
          </View>
        )}
        {card.bestTimeToVisit && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>🕐 {card.bestTimeToVisit}</Text>
          </View>
        )}
      </View>

      {/* Worth It reasons */}
      {card.worthItReasons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Visit</Text>
          {card.worthItReasons.map((r, i) => (
            <View key={i} style={styles.reasonRow}>
              <Text style={styles.reasonBullet}>✓</Text>
              <Text style={styles.reasonText}>{r}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skip It reasons */}
      {card.skipItReasons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consider Skipping If</Text>
          {card.skipItReasons.map((r, i) => (
            <View key={i} style={styles.reasonRow}>
              <Text style={[styles.reasonBullet, styles.reasonBulletSkip]}>✗</Text>
              <Text style={styles.reasonText}>{r}</Text>
            </View>
          ))}
        </View>
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
  content: { padding: 20 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  placeName: { color: "#f1f5f9", fontSize: 22, fontWeight: "700", flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  badgeWorth: { backgroundColor: "#14532d" },
  badgeSkip: { backgroundColor: "#7f1d1d" },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  category: { color: "#64748b", fontSize: 13, marginBottom: 12, textTransform: "capitalize" },
  summary: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 21,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  metaBadge: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: { color: "#cbd5e1", fontSize: 13 },
  section: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { color: "#f1f5f9", fontWeight: "700", fontSize: 15, marginBottom: 10 },
  reasonRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  reasonBullet: { color: "#22c55e", fontWeight: "700", fontSize: 14, width: 16 },
  reasonBulletSkip: { color: "#ef4444" },
  reasonText: { color: "#94a3b8", fontSize: 13, flex: 1, lineHeight: 20 },
  errorText: { color: "#f87171", textAlign: "center", fontSize: 14 },
});
