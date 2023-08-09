import React, { useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_LOBBY_BASE_URL;

const GameListener = ({ onMessage, onError, onClose }) => {
  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL}/sse`);

    eventSource.onmessage = (event) => {
      const gameData = JSON.parse(event.data);
      onMessage(gameData);
    };

    eventSource.onerror = (error) => {
      onError(error);
    };

    eventSource.onclose = () => {
      onClose();
    };

    return () => {
      eventSource.close();
    };
  }, [onMessage, onError, onClose]);

  return null;
};

export default GameListener;
