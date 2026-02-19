import { View, Text } from "react-native";
import * as AC from "@bacons/apple-colors";

type Props = {
  lat: number;
  lng: number;
  label: string;
};

// Static map using OpenStreetMap tile rendered as a styled placeholder
// (react-native-maps is native-only and not in Expo Go)
export function StaticMapView({ lat, lng, label }: Props) {
  return (
    <View
      style={{
        height: 180,
        borderRadius: 16,
        borderCurve: "continuous",
        overflow: "hidden",
        backgroundColor: AC.systemGreen as any,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {/* Map grid lines to simulate a map */}
      <View
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`h${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${(i / 7) * 100}%`,
              height: 1,
              backgroundColor: "#000",
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`v${i}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${(i / 7) * 100}%`,
              width: 1,
              backgroundColor: "#000",
            }}
          />
        ))}
      </View>

      {/* Pin */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: AC.systemRed as any,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text style={{ fontSize: 20 }}>📍</Text>
      </View>

      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          {label}
        </Text>
      </View>
      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </Text>
    </View>
  );
}
