
// commenting the firebase code as per the discussion
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// var firebaseConfig = {
//   apiKey: "AIzaSyBh9-r3G4J6egjpE8b2HVdpPJosK63uxg4",
//   authDomain: "energy-data-a6099.firebaseapp.com",
//   projectId: "energy-data-a6099",
//   storageBucket: "energy-data-a6099.appspot.com",
//   messagingSenderId: "616662584731",
//   appId: "1:616662584731:web:dc5eb4f933bf4ec53ba53e",
//   measurementId: "G-PK77ZG3D8N",
// };

// initializeApp(firebaseConfig);
// const messaging = getMessaging();

// export const requestForToken = () => {
//   return getToken(messaging, {
//     vapidKey: `${process.env.REACT_APP_VAPID_KEY}`,
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log("current token for client: ", currentToken);
//         // Perform any other neccessary action with the token
//         Notification.requestPermission().then((permission) => {
//           //   console.log("Requesting permission...");
//           if (permission === "granted") {
//             // console.log("Notification permission granted.");
//           } else {
//           }
//         });
//       } else {
//         // Show permission request UI
//         // console.log(
//         //   "No registration token available. Request permission to generate one."
//         // );
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//     });
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//     //   console.log("payload", payload);
//       resolve(payload);
//     });
//   });
