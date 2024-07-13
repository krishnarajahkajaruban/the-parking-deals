// import React, { createContext, useEffect } from 'react';
// import io from 'socket.io-client';

// export const SocketContext = createContext();

// const socket = io(process.env.REACT_APP_BASEURL);

// export const SocketProvider = ({ children }) => {
//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Connected to Socket.io server');
//     });

//     return () => {
//       socket.off('connect');
//     };
//   }, []);

//   useEffect(() => {
//     socket.on('checkout.session.completed', (session) => {
//       console.log('Checkout session completed');
      
//     });

//     socket.on('payment_intent.payment_failed', (paymentIntent) => {
//       console.log('Payment intent failed');
     
//     });

//     return () => {
//       socket.off('checkout.session.completed');
//       socket.off('payment_intent.payment_failed');
//     };
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
