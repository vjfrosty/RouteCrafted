import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>
            {user.name?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={styles.name}>{user.name ?? "Traveler"}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={[styles.roleBadge, user.role === "admin" ? styles.roleAdmin : styles.roleTraveler]}>
          <Text style={styles.roleText}>{user.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#64748b" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="shield-outline" size={18} color="#64748b" />
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{user.role}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 24, alignItems: "center" },
  avatarWrapper: { alignItems: "center", marginBottom: 32 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1d4ed8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarInitial: { color: "#fff", fontSize: 32, fontWeight: "700" },
  name: { color: "#f1f5f9", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  email: { color: "#94a3b8", fontSize: 14, marginBottom: 8 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 },
  roleAdmin: { backgroundColor: "#4c1d95" },
  roleTraveler: { backgroundColor: "#1e3a5f" },
  roleText: { color: "#c4b5fd", fontSize: 12, fontWeight: "600" },
  section: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoLabel: { color: "#64748b", fontSize: 14, width: 48 },
  infoValue: { color: "#cbd5e1", fontSize: 14, flex: 1 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ef444440",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoutText: { color: "#ef4444", fontWeight: "600", fontSize: 15 },
});
