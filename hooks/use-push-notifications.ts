import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { router, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface SendPushOptions {
  to: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}

async function sendPushNotification(options: SendPushOptions) {
  const { to, title, body, data } = options;

  const message = {
    to: to,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

//registra los errores
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    //Aviso al usuario que va a recibir el prompt
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    handleRegistrationError(
      "Permission not granted to get push token for push notification!",
    );
    return;
  }
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError("Project ID not found");
  }
  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    //IOS: ExpoPushToken[12312414]
    //Android: ExponentPushToken[12312414dasda]
    console.log({ [Platform.OS]: pushTokenString });
    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

export const usePushNotifications = () => {

  const [pendingChartId, setPendingChartId] = useState<string | null>('')
  //para saber cuando la app ya este montada
  const rootNavigationState = useRootNavigationState()

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState<
    Notifications.Notification[]
  >([]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));
  }, []);

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const chatId = response.notification.request.content.data?.chatId
        if (typeof chatId === 'string' && chatId.length > 0) {
          setPendingChartId(chatId)
        }

      });

    const handleInitialNotificationResponse = () => {
      const response = Notifications.getLastNotificationResponse();

      const chatId = response?.notification?.request?.content?.data?.chatId

      if (typeof chatId === 'string' && chatId.length > 0) {
        setPendingChartId(chatId)
      }
    }

    handleInitialNotificationResponse()

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!rootNavigationState?.key) return
    if (!pendingChartId) return

    router.push(`/chat/${pendingChartId}` as any)
    setPendingChartId(null)


  }, [rootNavigationState?.key, pendingChartId])

  return {
    // Props
    expoPushToken,
    notifications,
    // Methods
    sendPushNotification,
  };
};
