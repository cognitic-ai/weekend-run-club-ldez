import { ThemeProvider } from "@/components/theme-provider";
import { RunsProvider } from "@/store/runs-store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <RunsProvider>
        <TabsLayout />
      </RunsProvider>
    </ThemeProvider>
  );
}

function TabsLayout() {
  if (process.env.EXPO_OS === "web") {
    return <WebTabsLayout />;
  } else {
    return <NativeTabsLayout />;
  }
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : {
              tabBarPosition: "bottom",
            }),
      }}
    >
      <WebTabs.Screen
        name="(runs)"
        options={{
          title: "Runs",
          tabBarIcon: (props) => (
            <MaterialIcons {...props} name="directions-run" />
          ),
        }}
      />
      <WebTabs.Screen
        name="(scores)"
        options={{
          title: "Scores",
          tabBarIcon: (props) => (
            <MaterialIcons {...props} name="emoji-events" />
          ),
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs screenOptions={{ headerShown: false }}>
      <NativeTabs.Trigger name="(runs)">
        <NativeTabs.Trigger.Label>Runs</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "figure.run", selected: "figure.run" } },
            default: {
              src: (
                <NativeTabs.Trigger.VectorIcon
                  family={MaterialIcons}
                  name="directions-run"
                />
              ),
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(scores)">
        <NativeTabs.Trigger.Label>Scores</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "trophy", selected: "trophy.fill" } },
            default: {
              src: (
                <NativeTabs.Trigger.VectorIcon
                  family={MaterialIcons}
                  name="emoji-events"
                />
              ),
            },
          })}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
