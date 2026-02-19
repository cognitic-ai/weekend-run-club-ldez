import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { useState } from "react";
import * as AC from "@bacons/apple-colors";
import { useRunsStore } from "@/store/runs-store";

const DISTANCES = ["5K", "10K", "Half Marathon", "Full Marathon", "Other"];

export default function PostScoreScreen() {
  const { runs, addScore } = useRunsStore();

  const [selectedRunId, setSelectedRunId] = useState<string>("free");
  const [runTitle, setRunTitle] = useState("");
  const [distance, setDistance] = useState("5K");
  const [finishTime, setFinishTime] = useState("");
  const [notes, setNotes] = useState("");

  const canSubmit = finishTime.trim().length > 0 && (selectedRunId !== "free" || runTitle.trim().length > 0);

  const handleSubmit = () => {
    const title =
      selectedRunId === "free"
        ? runTitle.trim() || "Standalone Run"
        : runs.find((r) => r.id === selectedRunId)?.title ?? "Weekend Run";

    addScore({
      runId: selectedRunId,
      runTitle: title,
      distance,
      time: finishTime.trim(),
      notes: notes.trim(),
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Post Score",
          headerLargeTitle: false,
          presentation: "modal",
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text style={{ color: AC.systemBlue as any, fontSize: 16 }}>
                Cancel
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => ({
                opacity: !canSubmit ? 0.4 : pressed ? 0.6 : 1,
              })}
            >
              <Text
                style={{
                  color: AC.systemBlue as any,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Post
              </Text>
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Finish Time */}
          <FormSection title="Finish Time *">
            <TextInput
              value={finishTime}
              onChangeText={setFinishTime}
              placeholder="e.g. 28:45 or 1:02:30"
              placeholderTextColor={AC.placeholderText as any}
              style={inputStyle}
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
            />
          </FormSection>

          {/* Distance */}
          <FormSection title="Distance">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {DISTANCES.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDistance(d)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      distance === d
                        ? (AC.systemOrange as any)
                        : (AC.secondarySystemBackground as any),
                    borderWidth: 1,
                    borderColor:
                      distance === d
                        ? (AC.systemOrange as any)
                        : (AC.separator as any),
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: distance === d ? "#fff" : (AC.label as any),
                    }}
                  >
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
          </FormSection>

          {/* Link to run */}
          <FormSection title="Link to a Run (optional)">
            <View style={{ gap: 8 }}>
              <Pressable
                onPress={() => setSelectedRunId("free")}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  backgroundColor: AC.secondarySystemBackground as any,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  opacity: pressed ? 0.7 : 1,
                  borderWidth: selectedRunId === "free" ? 2 : 1,
                  borderColor:
                    selectedRunId === "free"
                      ? (AC.systemOrange as any)
                      : (AC.separator as any),
                })}
              >
                <Text style={{ fontSize: 18 }}>🏃</Text>
                <Text style={{ fontSize: 15, color: AC.label as any, flex: 1 }}>
                  Standalone Run
                </Text>
                {selectedRunId === "free" && (
                  <Text style={{ color: AC.systemOrange as any }}>✓</Text>
                )}
              </Pressable>

              {selectedRunId === "free" && (
                <TextInput
                  value={runTitle}
                  onChangeText={setRunTitle}
                  placeholder="Run name (optional)"
                  placeholderTextColor={AC.placeholderText as any}
                  style={inputStyle}
                />
              )}

              {runs.map((run) => (
                <Pressable
                  key={run.id}
                  onPress={() => setSelectedRunId(run.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    backgroundColor: AC.secondarySystemBackground as any,
                    borderRadius: 12,
                    borderCurve: "continuous",
                    opacity: pressed ? 0.7 : 1,
                    borderWidth: selectedRunId === run.id ? 2 : 1,
                    borderColor:
                      selectedRunId === run.id
                        ? (AC.systemOrange as any)
                        : (AC.separator as any),
                  })}
                >
                  <Text style={{ fontSize: 18 }}>📅</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, color: AC.label as any, fontWeight: "500" }}>
                      {run.title}
                    </Text>
                    <Text style={{ fontSize: 13, color: AC.secondaryLabel as any }}>
                      {run.distance} · {run.time}
                    </Text>
                  </View>
                  {selectedRunId === run.id && (
                    <Text style={{ color: AC.systemOrange as any }}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </FormSection>

          {/* Notes */}
          <FormSection title="Notes (optional)">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="How'd it go? PR? Tough conditions?"
              placeholderTextColor={AC.placeholderText as any}
              multiline
              numberOfLines={3}
              style={[inputStyle, { minHeight: 80, textAlignVertical: "top" }]}
            />
          </FormSection>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => ({
              backgroundColor: canSubmit
                ? (AC.systemOrange as any)
                : (AC.systemFill as any),
              borderRadius: 14,
              borderCurve: "continuous",
              padding: 16,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                color: canSubmit ? "#fff" : (AC.secondaryLabel as any),
                fontSize: 17,
                fontWeight: "700",
              }}
            >
              Post Score
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: AC.secondaryLabel as any,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

const inputStyle = {
  backgroundColor: AC.secondarySystemBackground as any,
  borderRadius: 12,
  borderCurve: "continuous" as const,
  padding: 14,
  fontSize: 15,
  color: AC.label as any,
  borderWidth: 1,
  borderColor: AC.separator as any,
};
