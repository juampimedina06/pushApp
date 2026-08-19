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
          <View style={{ paddingVertical: 10,borderBottomColor: "#000000ff", borderBottomWidth: 1 }}>
            <ThemedText >{item.item.request.content.title}</ThemedText>
            <ThemedText>{item.item.request.content.body}</ThemedText>
            <ThemedText>{JSON.stringify(item.item.request.content.data, null ,2)}</ThemedText>
          </View>
        )}

        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#ccc", opacity:0.5 }} />
        )}

        //cuando la lista este vacia
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical:20 }}>
            <ThemedText style={{ fontSize: 16, color: "#ccc" }}>No hay notificaciones</ThemedText>
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
