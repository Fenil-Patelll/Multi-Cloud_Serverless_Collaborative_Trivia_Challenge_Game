import axios from "axios";

const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/games`;

export const submitAnswer = (questionId, answer) =>
  axios.post(`${baseUrl}/submit_questions/${questionId}`, { answer });

export const realTimeScore = (questionId, teamId, answer) =>
  axios.post(`${baseUrl}/questions/${questionId}/score`, { teamId, answer });

export const sendMessage = (teamId,senderId, senderName, message) =>
  axios.post(`${baseUrl}/chat/send`, { teamId, senderId,senderName,message });


export const getMessages = (teamId) => axios.get(`${baseUrl}/chat/get/${teamId}`);


export const getTeamById = (teamId) =>
  axios.get(`${process.env.REACT_APP_TEAM_URL}/get/${teamId}`);

export const getTeams = () => axios.get(`${process.env.REACT_APP_TEAM_URL}`);

export const getUserById = (userId) =>
  axios.get(`${process.env.REACT_APP_USER_URL}/${userId}`);

export const getGameById=(gameId) =>
axios.get(`${process.env.REACT_APP_GAME_URL}/${gameId}`);
  