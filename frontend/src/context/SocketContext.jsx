import React, { createContext, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(process.env.REACT_APP_BASEURL);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
