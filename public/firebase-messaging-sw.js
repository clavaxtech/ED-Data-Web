// ---------------------------------commenting the firebase code for now as per discussion------------------
// // Scripts for firebase and firebase messaging
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//   apiKey: "AIzaSyBh9-r3G4J6egjpE8b2HVdpPJosK63uxg4",
//   authDomain: "energy-data-a6099.firebaseapp.com",
//   projectId: "energy-data-a6099",
//   storageBucket: "energy-data-a6099.appspot.com",
//   messagingSenderId: "616662584731",
//   appId: "1:616662584731:web:dc5eb4f933bf4ec53ba53e",
//   measurementId: "G-PK77ZG3D8N",
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
