import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { Run } from "@/store/runs-store";
import { useRunsStore } from "@/store/runs-store";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function RunCard({ run }: { run: Run }) {
  const { isSignedUp } = useRunsStore();
  const signedUp = isSignedUp(run.id);

  return (
    <Link href={`/(runs)/${run.id}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          opacity: pressed ? 0.85 : 1,
          backgroundColor: AC.secondarySystemBackground as any,
          borderRadius: 16,
          borderCurve: "continuous",
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        })}
      >
        {/* Top color bar */}
        <View
          style={{
            height: 6,
            backgroundColor: signedUp
              ? (AC.systemGreen as any)
              : (AC.systemBlue as any),
          }}
        />

        <View style={{ padding: 16, gap: 10 }}>
          {/* Title row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: AC.label as any,
                flex: 1,
              }}
            >
              {run.title}
            </Text>
            <View
              style={{
                backgroundColor: signedUp
                  ? (AC.systemGreen as any)
                  : (AC.systemBlue as any),
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                marginLeft: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                {run.distance}
              </Text>
            </View>
          </View>

          {/* Meta */}
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 14 }}>📅</Text>
              <Text style={{ fontSize: 14, color: AC.secondaryLabel as any }}>
                {formatDate(run.date)} · {run.time}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 14 }}>📍</Text>
              <Text
                style={{ fontSize: 14, color: AC.secondaryLabel as any }}
                numberOfLines={1}
              >
                {run.location}
              </Text>
            </View>
          </View>

          {/* Signups */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              {run.signups.slice(0, 4).map((r, i) => (
                <View
                  key={r.id}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: AC.systemGroupedBackground as any,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: i > 0 ? -8 : 0,
                    borderWidth: 2,
                    borderColor: AC.secondarySystemBackground as any,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{r.avatar}</Text>
                </View>
              ))}
              <Text
                style={{
                  fontSize: 13,
                  color: AC.secondaryLabel as any,
                  marginLeft: 6,
                }}
              >
                {run.signups.length}{" "}
                {run.signups.length === 1 ? "runner" : "runners"}
              </Text>
            </View>

            {signedUp && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 12 }}>✓</Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: AC.systemGreen as any,
                    fontWeight: "600",
                  }}
                >
                  You're in!
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
