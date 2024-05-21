// import React, { useState, useEffect } from 'react'
// import { requestForToken, onMessageListener } from '../../../firebase';
// import { toast } from 'react-toastify';

// const Notification = () => {
//     const [notification, setNotification] = useState({ title: '', body: '' });
//     const notify = () => toast(<ToastDisplay />);
//     function ToastDisplay() {
//         return (
//             <div>
//                 <p><b>{notification?.title}</b></p>
//                 <p>{notification?.body}</p>
//             </div>
//         );
//     };

//     useEffect(() => {
//         if (notification?.title) {
//             notify()
//         }
//         // eslint-disable-next-line 
//     }, [notification])

//     requestForToken();

//     onMessageListener()
//         .then((payload) => {
//             console.log({ payload })
//             setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
//         })
//         .catch((err) => console.log('failed: ', err));

//     return (
//         <></>
//     )
// }

// export default Notification