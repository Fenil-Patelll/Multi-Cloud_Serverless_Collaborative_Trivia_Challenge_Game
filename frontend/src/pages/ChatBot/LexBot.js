import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom'; // import useNavigate from react-router-dom
import ChatInterface from './ChatInterface';


const StyledButton = styled(Button)`
  width: 80%; 
  max-width: 500px;
  height: 70px;
  font-size: 40px;
  margin-top: 30px;
  @media (max-width: 768px) { 
    font-size: 20px;
    height: 50px;
  }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 90vh;
  width: 40vw;
  background: #F0F8FF;
  border: 5px solid darkblue;
  border-radius: 10px;
  margin: 3vh auto;
  padding: 10px 10px 0 10px;
`;

const Header = styled.div`
  background-color: black;
  color: white;
  font-weight: bold;
  padding: 10px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
`;

const LexBot = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const navigate = useNavigate(); // get the useNavigate function from react-router-dom

  const handleButtonClick = () => {
    setChatStarted(true);
  };

  // create a function to handle game navigation
  const handleGoToGameClick = () => {
    navigate("/game/517d329a-e4c8-4326-89ce-7e72979a47f7/8075bfebe418488cb7d273bcee86b54b"); // pass the teamId and game url in the URL
  };

  return (
    <HomeContainer>
      <Header>
        <Typography variant="h2" component="h1">
          Game Chatbot
        </Typography>
      </Header>
      {chatStarted ? (
        <ChatInterface />
      ) : (
        <>
          <StyledButton variant="contained" color="primary" onClick={handleButtonClick}>
            Start a Chat
          </StyledButton>
          <StyledButton variant="contained" color="secondary" hidden="true" onClick={handleGoToGameClick}>
            Go To Game
          </StyledButton>
        </>
      )}
    </HomeContainer>
  );
};

export default LexBot;
