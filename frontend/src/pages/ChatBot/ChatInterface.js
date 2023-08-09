
import React, { useState, useEffect, useRef } from 'react';
import { TextField, Card, Typography, Container, Box } from '@mui/material';
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { v4 as uuidv4 } from 'uuid';
import styled from "@emotion/styled";

const client = new LexRuntimeV2Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
  }
});

const ChatBox = styled.div`
  height: 400px;  /* Adjust the height as you want */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(uuidv4());

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const initialMessage = 'How can I help you?';
    setConversation([{ message: initialMessage, from: 'bot' }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = {
      botId: 'GF8BEB7IUO', 
      botAliasId: 'TSTALIASID',
      localeId: 'en_US',
      sessionId: sessionId,
      text: message,
    };
    const command = new RecognizeTextCommand(params);
    client.send(command, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        let botMessage = "I'm sorry, I didn't understand that. Could you please rephrase?";
        console.log(data);
        if (data.messages && data.messages.length > 0) {
          botMessage = data.messages[0].content;
        }

        setConversation([...conversation, { message, from: 'user' }, { message: botMessage, from: 'bot' }]);
        setMessage('');
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <ChatBox>
          {conversation.map((convo, index) => (
            <Box
              key={index}
              alignSelf={convo.from === 'bot' ? 'flex-start' : 'flex-end'}
              bgcolor={convo.from === 'bot' ? 'grey.200' : 'blue.200'}
              m={1}
              p={1}
              borderRadius={2}
              maxWidth="80%"
            >
              <Typography variant="body1">{convo.message}</Typography>
            </Box>
          ))}
          <div ref={chatEndRef} />
        </ChatBox>
      </Card>
      <form onSubmit={handleSubmit}>
        <TextField
          id="standard-basic"
          label="Type your message"
          variant="standard"
          value={message}
          onChange={handleChange}
          fullWidth
        />
      </form>
    </Container>
  );
};

export default ChatInterface;
