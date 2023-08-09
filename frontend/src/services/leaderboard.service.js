import api from "./auth.interceptor";

const BASE_URL = `${process.env.REACT_APP_LEADERBOARD_BASE_URL}`;

const updateLeaderboard = (data) => api.post(`${BASE_URL}-publishLeaderboardUpdate`, data);
const getGlobalLeaderboard = () => api.get(`${BASE_URL}-getGlobalLeaderboard`);
const filterLeaderboardByTimeFrame = (data) => api.post(`${BASE_URL}-filterLeaderboardByTimeFrame`, data);
const getEntityStatistics = (data) => api.post(`${BASE_URL}-getEntityStatistics`, data);
const getLeaderboardByEntityId = (data) => api.post(`${BASE_URL}-getLeaderboardByEntityId`, data);

export default {
    updateLeaderboard,
    getGlobalLeaderboard,
    filterLeaderboardByTimeFrame,
    getEntityStatistics,
    getLeaderboardByEntityId
};
