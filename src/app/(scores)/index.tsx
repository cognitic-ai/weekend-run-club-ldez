import { ScrollView, View, Text, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { useRunsStore } from "@/store/runs-store";
import { Score } from "@/store/runs-store";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function ScoreCard({ score }: { score: Score }) {
  return (
    <View
      style={{
        backgroundColor: AC.secondarySystemBackground as any,
        borderRadius: 16,
        borderCurve: "continuous",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Top accent */}
      <View
        style={{
          height: 4,
          backgroundColor: AC.systemOrange as any,
        }}
      />

      <View style={{ padding: 14, gap: 10 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: AC.systemGroupedBackground as any,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>{score.runner.avatar}</Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: AC.label as any,
                }}
              >
                {score.runner.name}
              </Text>
              <Text
                style={{ fontSize: 13, color: AC.secondaryLabel as any }}
              >
                {score.runTitle}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: AC.tertiaryLabel as any }}>
            {timeAgo(score.postedAt)}
          </Text>
        </View>

        {/* Time + Distance */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: AC.systemGroupedBackground as any,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 12,
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text
              selectable
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: AC.label as any,
                fontVariant: ["tabular-nums"],
              }}
            >
              {score.time}
            </Text>
            <Text
              style={{ fontSize: 12, color: AC.secondaryLabel as any }}
            >
              Finish Time
            </Text>
          </View>
          <View
            style={{
              backgroundColor: AC.systemGroupedBackground as any,
              borderRadius: 12,
              borderCurve: "continuous",
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              minWidth: 80,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: AC.systemOrange as any,
              }}
            >
              {score.distance}
            </Text>
            <Text
              style={{ fontSize: 12, color: AC.secondaryLabel as any }}
            >
              Distance
            </Text>
          </View>
        </View>

        {/* Notes */}
        {score.notes ? (
          <Text
            selectable
            style={{
              fontSize: 14,
              color: AC.secondaryLabel as any,
              lineHeight: 20,
              fontStyle: "italic",
            }}
          >
            "{score.notes}"
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function ScoresScreen() {
  const { scores } = useRunsStore();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Scores",
          headerRight: () => (
            <Link href="/(scores)/post-score" asChild>
              <Pressable
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text
                  style={{
                    color: AC.systemBlue as any,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  + Post
                </Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {/* Banner */}
        <View
          style={{
            backgroundColor: AC.systemOrange as any,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 32 }}>🏅</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff" }}>
              Activity Feed
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
              See how everyone is doing
            </Text>
          </View>
        </View>

        {scores.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>🏅</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: AC.label as any,
              }}
            >
              No scores yet
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: AC.secondaryLabel as any,
                textAlign: "center",
              }}
            >
              Tap "+ Post" to share your finish time
            </Text>
          </View>
        ) : (
          scores.map((score) => <ScoreCard key={score.id} score={score} />)
        )}
      </ScrollView>
    </>
  );
}
