import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";

export default function RunsStackLayout() {
  return (
    <Stack
      screenOptions={
        process.env.EXPO_OS === "ios"
          ? {
              headerTransparent: true,
              headerShadowVisible: false,
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
              headerLargeStyle: { backgroundColor: "transparent" },
              headerBlurEffect: "systemChromeMaterial",
              headerTitleStyle: { color: AC.label as any },
              headerBackButtonDisplayMode: "minimal",
            }
          : {}
      }
    />
  );
}
