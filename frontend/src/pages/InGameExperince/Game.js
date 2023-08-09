import React, { useState, useEffect, useRef } from "react";
import {
  submitAnswer,
  realTimeScore,
  getTeams,
  getTeamById,
  getGameById,
} from "../../services/games.service";
import {
  CircularProgress,
  Button,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import GlobalLeaderboard from "./GlobalLeaderboard";
import { useParams } from 'react-router-dom';
import Chat from "../TeamChat/Chat";

const StyledContainer = styled(Container)`
  background-color: #28282a;
  color: #ffffff;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // change this from flex-start to center
`;

const StyledQuestionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  color: #28282a;
  background-color: #62d2a2;
  &:hover {
    background-color: #ffffffaa;
  }
  font-size: 1.5rem;
  border-radius: 12px;
  padding: 1rem 2rem;
  width: 45%;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const StyledScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
`;

const StyledInfoContainer = styled(Grid)`
  width: 100%;
  margin: 2rem 0;
`;


const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [scores, setScores] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [minimizeChat, setMinimizeChat] = useState(true);
  const [gameOver, setGameOver] = useState(false); // add this
  const [explanation, setExplanation] = useState(null);
  const [teams, setTeams] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null); // assume the first team is playing initially
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(500);
  const [isScoreUpdated, setIsScoreUpdated] = useState(false);



  // Define refs for scores and teams
  const scoresRef = useRef(0);
  const teamsRef = useRef(null);

  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const { teamId, gameId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const gameData = await getGameById(gameId);
        console.log(gameData.data.questions);
        const fetchedQuestions = gameData.data.questions;  // Use 'questions' key from gameData directly.
        // const fetchedQuestions=await getQuestions();
        setQuestions(fetchedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [gameId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTimeRemaining((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setGameOver(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const fetchedTeams = await getTeams();
        console.log(fetchTeams);

        setTeams(fetchedTeams.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchCurrentTeam = async () => {
      try {
        const fetchedTeam = await getTeamById(teamId);
        console.log(fetchedTeam.data);
        setCurrentTeam(fetchedTeam.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentTeam();
  }, [teamId]); // dependency on teamId


  useEffect(() => {
    // Update refs whenever state changes
    scoresRef.current = scores;
    teamsRef.current = teams;
  }, [scores, teams]);

  const currentQuestion = questions[currentQuestionIndex];


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        if (prevTimeRemaining > 0) {
          return prevTimeRemaining - 1;
        } else {
          // Time has run out. Show score for this question.
          setShowScore(true);
          setIsSubmitting(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showScore) {
      // Wait 5 seconds then go to next question or end the game
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setTimeRemaining(20);
          setShowScore(false);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setExplanation(null);
          setAnswerSubmitted(false); // added this

        } else {
          setGameTimeRemaining(0);
          setGameOver(true);
        }
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [showScore]);




  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setIsWaiting(true);
  };

  useEffect(() => {
    if (timeRemaining === 0 && !answerSubmitted) {
      console.log(selectedAnswer);
      if (selectedAnswer === null) {
        // If the user hasn't selected an answer, default to null and submit
        submitAnswerHandler(null);
      } else {
        submitAnswerHandler();
      }
      setAnswerSubmitted(true);
    }
  }, [timeRemaining, selectedAnswer, answerSubmitted]);



  const submitAnswerHandler = async (defaultAnswer = selectedAnswer) => {
    try {
      console.log(defaultAnswer);
      const response = await submitAnswer(currentQuestion.questionId, defaultAnswer);
      const { data: answerData } = response;
      console.log(response);
      setIsCorrect(answerData.isCorrect);
      setExplanation(answerData.explanation);
      setShowScore(true);


     
        const scoreResponse = await realTimeScore(currentQuestion.questionId, currentTeam.id, defaultAnswer);
        console.log(currentQuestion.questionId, currentTeam.id, defaultAnswer);
        console.log(scoreResponse);
        const { data: scoreData } = scoreResponse;
        setScores(scoreData.newTeamScore);
        setIsScoreUpdated(true); 
        setTeams((prevTeams) => {
          return prevTeams.map((team) => {
            if (team.id === currentTeam.id) {
              return {
                ...team,
                score: scoreData.newTeamScore,
              };
            } else {
              return team;
            }
          });
        });
        scoresRef.current = scoreData.newTeamScore;
        teamsRef.current = teamsRef.current.map((team) => {
          if (team.id === currentTeam.id) {
            return {
              ...team,
              score: scoreData.newTeamScore,
            };
          } else {
            return team;
          }
        });
      
    } catch (error) {
      console.error("Error while submitting answer:", error);
    } finally {
      setIsWaiting(false);
      setSelectedAnswer(null); // reset selected answer after processing
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsOpen(open);
  };

  if (gameOver) {

    return <GlobalLeaderboard teams={teamsRef.current} currentTeam={currentTeam} />;

  }

  return (
    <StyledContainer>
      {!gameOver && (
        <Typography variant="h4" css={css`
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
`}>Game Time Remaining: {gameTimeRemaining}</Typography>
      )}
      <StyledQuestionContainer>
        <Typography
          variant="h2"
          css={css`
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
  `}
        >
          {currentQuestion?.question}
        </Typography>
      </StyledQuestionContainer>
      {!isSubmitting && !showScore && (
        <StyledInfoContainer
          container
          justifyContent="center"
          marginBottom="3rem"
        >
          <Grid item>
            <Typography
              variant="h4"
              css={css`
                font-size: 2.5rem;
                font-weight: bold;
              `}
            >
              Time Remaining: {timeRemaining}
            </Typography>
          </Grid>
        </StyledInfoContainer>
      )}
      {isSubmitting && <CircularProgress />}
      {!isSubmitting && showScore && isScoreUpdated && (
        <Typography variant="h4">Score: {scores}</Typography>
      )}
      {!isSubmitting && showScore && isCorrect !== null && (
        <>
          {isCorrect ? (
            <Typography variant="h4">Correct!</Typography>
          ) : (
            <Typography variant="h4">Wrong!</Typography>
          )}
          {explanation && <Typography variant="h6">{explanation}</Typography>}
        </>
      )}
      <StyledButtonContainer>
        {isWaiting ? (
          <CircularProgress />
        ) : (
          !showScore &&
          currentQuestion?.options.map((option, index) => (
            <StyledButton
              variant="contained"
              onClick={() => handleAnswerClick(option)}
              disabled={isSubmitting}
            >
              {option}
            </StyledButton>
          ))
        )}
      </StyledButtonContainer>

      <Chat
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        minimizeChat={minimizeChat}
        setMinimizeChat={setMinimizeChat}
        currentTeam={currentTeam}
      />
    </StyledContainer>
  );
};

export default Game;

