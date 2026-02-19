import { ScrollView, View, Text, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { useRunsStore } from "@/store/runs-store";
import { RunCard } from "@/components/run-card";

export default function RunsScreen() {
  const { runs } = useRunsStore();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Weekend Runs",
          headerRight: () => (
            <Link href="/(runs)/new-run" asChild>
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
                  + New
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
        {runs.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 48 }}>🏃‍♂️</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: AC.label as any,
              }}
            >
              No runs yet
            </Text>
            <Text
              style={{ fontSize: 15, color: AC.secondaryLabel as any, textAlign: "center" }}
            >
              Tap "+ New" to post a weekend run
            </Text>
          </View>
        ) : (
          runs.map((run) => <RunCard key={run.id} run={run} />)
        )}
      </ScrollView>
    </>
  );
}
