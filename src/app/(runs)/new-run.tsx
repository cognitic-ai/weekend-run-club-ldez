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

const LOCATIONS = [
  { label: "Riverside Park, NYC", lat: 40.8016, lng: -73.9704 },
  { label: "Central Park, NYC", lat: 40.7851, lng: -73.9683 },
  { label: "Brooklyn Bridge Park", lat: 40.7024, lng: -73.9971 },
  { label: "Prospect Park, Brooklyn", lat: 40.6602, lng: -73.9688 },
  { label: "Custom Location", lat: 40.7128, lng: -74.006 },
];

export default function NewRunScreen() {
  const { addRun } = useRunsStore();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("7:00 AM");
  const [distance, setDistance] = useState("5K");
  const [locationIdx, setLocationIdx] = useState(0);
  const [customLocation, setCustomLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [dateOffset, setDateOffset] = useState(0); // 0 = next Saturday, 1 = next Sunday

  const nextSaturday = getNextWeekend(6);
  const nextSunday = getNextWeekend(0);
  const selectedDate = dateOffset === 0 ? nextSaturday : nextSunday;

  const selectedLocation = LOCATIONS[locationIdx];

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    const loc =
      locationIdx === LOCATIONS.length - 1 && customLocation.trim()
        ? customLocation.trim()
        : selectedLocation.label;
    addRun({
      title: title.trim(),
      date: selectedDate.toISOString(),
      time,
      location: loc,
      distance,
      notes: notes.trim(),
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "New Run",
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
          {/* Title */}
          <FormSection title="Run Name">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Riverside Morning Run"
              placeholderTextColor={AC.placeholderText as any}
              style={inputStyle}
              returnKeyType="next"
            />
          </FormSection>

          {/* Date */}
          <FormSection title="Date">
            <View style={{ flexDirection: "row", gap: 8 }}>
              <SegmentButton
                label={`Sat ${nextSaturday.getDate()}`}
                selected={dateOffset === 0}
                onPress={() => setDateOffset(0)}
              />
              <SegmentButton
                label={`Sun ${nextSunday.getDate()}`}
                selected={dateOffset === 1}
                onPress={() => setDateOffset(1)}
              />
            </View>
          </FormSection>

          {/* Time */}
          <FormSection title="Start Time">
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 7:00 AM"
              placeholderTextColor={AC.placeholderText as any}
              style={inputStyle}
            />
          </FormSection>

          {/* Distance */}
          <FormSection title="Distance">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {DISTANCES.map((d) => (
                <SegmentButton
                  key={d}
                  label={d}
                  selected={distance === d}
                  onPress={() => setDistance(d)}
                />
              ))}
            </View>
          </FormSection>

          {/* Location */}
          <FormSection title="Location">
            <View style={{ gap: 8 }}>
              {LOCATIONS.map((loc, i) => (
                <Pressable
                  key={loc.label}
                  onPress={() => setLocationIdx(i)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: 12,
                    backgroundColor: AC.secondarySystemBackground as any,
                    borderRadius: 12,
                    borderCurve: "continuous",
                    opacity: pressed ? 0.7 : 1,
                    borderWidth: locationIdx === i ? 2 : 1,
                    borderColor:
                      locationIdx === i
                        ? (AC.systemBlue as any)
                        : (AC.separator as any),
                  })}
                >
                  <Text style={{ fontSize: 18 }}>📍</Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: AC.label as any,
                      flex: 1,
                    }}
                  >
                    {loc.label}
                  </Text>
                  {locationIdx === i && (
                    <Text style={{ color: AC.systemBlue as any }}>✓</Text>
                  )}
                </Pressable>
              ))}
              {locationIdx === LOCATIONS.length - 1 && (
                <TextInput
                  value={customLocation}
                  onChangeText={setCustomLocation}
                  placeholder="Enter location name"
                  placeholderTextColor={AC.placeholderText as any}
                  style={[inputStyle, { marginTop: 4 }]}
                />
              )}
            </View>
          </FormSection>

          {/* Notes */}
          <FormSection title="Notes (optional)">
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Any info for runners, pace, route details..."
              placeholderTextColor={AC.placeholderText as any}
              multiline
              numberOfLines={4}
              style={[inputStyle, { minHeight: 100, textAlignVertical: "top" }]}
            />
          </FormSection>

          {/* Post button */}
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => ({
              backgroundColor: canSubmit
                ? (AC.systemBlue as any)
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
              Post Run
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

function SegmentButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selected
          ? (AC.systemBlue as any)
          : (AC.secondarySystemBackground as any),
        borderWidth: 1,
        borderColor: selected
          ? (AC.systemBlue as any)
          : (AC.separator as any),
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: selected ? "#fff" : (AC.label as any),
        }}
      >
        {label}
      </Text>
    </Pressable>
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

function getNextWeekend(targetDay: number) {
  // targetDay: 6 = Saturday, 0 = Sunday
  const d = new Date();
  const day = d.getDay();
  let diff = targetDay - day;
  if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return d;
}
