import { ThemedText } from "@/components/themed-text";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { FlatList, View } from "react-native";

export default function PushApp() {
  const { expoPushToken, notifications } = usePushNotifications();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <ThemedText>Expo token: {expoPushToken}</ThemedText>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.request.identifier}
        renderItem={(item) => (
          <View style={{ paddingVertical: 10 }}>
            <ThemedText>{item.item.request.content.title}</ThemedText>
            <ThemedText>{item.item.request.content.body}</ThemedText>
          </View>
        )}
      />

      {/* <Button
        title="Send Notification"
        onPress={async () => {
          await sendPushNotification({
            body: "Body desde mi app",
            title: "Titulo desde la app",
            to: [expoPushToken],
            data: {
              chatId: "123",
            },
          });
        }}
      /> */}
    </View>
  );
}
