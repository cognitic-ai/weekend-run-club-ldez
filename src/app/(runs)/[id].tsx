import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { useRunsStore } from "@/store/runs-store";
import { StaticMapView } from "@/components/map-view";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function RunDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { runs, toggleSignup, isSignedUp } = useRunsStore();
  const run = runs.find((r) => r.id === id);
  const signedUp = id ? isSignedUp(id) : false;

  if (!run) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: AC.secondaryLabel as any }}>Run not found</Text>
      </View>
    );
  }

  const handleSignup = () => {
    toggleSignup(run.id);
  };

  return (
    <>
      <Stack.Screen options={{ title: run.title, headerLargeTitle: false }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
      >
        {/* Map */}
        <StaticMapView lat={run.lat} lng={run.lng} label={run.location} />

        {/* Sign up button */}
        <Pressable
          onPress={handleSignup}
          style={({ pressed }) => ({
            backgroundColor: signedUp
              ? (AC.systemGreen as any)
              : (AC.systemBlue as any),
            borderRadius: 14,
            borderCurve: "continuous",
            padding: 16,
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
            {signedUp ? "✓ You're signed up — Tap to leave" : "Sign Up for This Run"}
          </Text>
        </Pressable>

        {/* Details card */}
        <View
          style={{
            backgroundColor: AC.secondarySystemBackground as any,
            borderRadius: 16,
            borderCurve: "continuous",
            overflow: "hidden",
          }}
        >
          <Row icon="📅" label="Date" value={formatDate(run.date)} />
          <Divider />
          <Row icon="⏰" label="Time" value={run.time} />
          <Divider />
          <Row icon="📍" label="Location" value={run.location} />
          <Divider />
          <Row icon="🏃" label="Distance" value={run.distance} />
        </View>

        {/* Notes */}
        {run.notes ? (
          <View
            style={{
              backgroundColor: AC.secondarySystemBackground as any,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 16,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: AC.secondaryLabel as any,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Notes
            </Text>
            <Text
              selectable
              style={{ fontSize: 15, color: AC.label as any, lineHeight: 22 }}
            >
              {run.notes}
            </Text>
          </View>
        ) : null}

        {/* Signups list */}
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: AC.label as any,
            }}
          >
            Who's Running ({run.signups.length})
          </Text>

          <View
            style={{
              backgroundColor: AC.secondarySystemBackground as any,
              borderRadius: 16,
              borderCurve: "continuous",
              overflow: "hidden",
            }}
          >
            {run.signups.length === 0 ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: AC.secondaryLabel as any, fontSize: 15 }}>
                  No one signed up yet. Be first!
                </Text>
              </View>
            ) : (
              run.signups.map((runner, i) => (
                <View key={runner.id}>
                  {i > 0 && <Divider />}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 14,
                      gap: 12,
                    }}
                  >
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
                      <Text style={{ fontSize: 22 }}>{runner.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: AC.label as any,
                        }}
                      >
                        {runner.name}
                      </Text>
                      {runner.id === run.organizer.id && (
                        <Text
                          style={{
                            fontSize: 13,
                            color: AC.systemBlue as any,
                          }}
                        >
                          Organizer
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 22, width: 32, textAlign: "center" }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            color: AC.secondaryLabel as any,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          selectable
          style={{ fontSize: 15, fontWeight: "500", color: AC.label as any }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: AC.separator as any,
        marginLeft: 58,
      }}
    />
  );
}
