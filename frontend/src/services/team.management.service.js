import api from "./auth.interceptor";

const BASE_URL = `${process.env.REACT_APP_TEAM_MANAGEMENT_BASE_URL}/api/teams`;

const generateTeamName = () => api.get(`${BASE_URL}/generate/teamName`);
const createTeam = (data) => api.post(`${BASE_URL}/`, data);
const getAllTeams = () => api.get(`${BASE_URL}/`);
const getTeamById = (id) => api.get(`${BASE_URL}/get/${id}`);
const deleteTeam = (id) => api.delete(`${BASE_URL}/delete/${id}`);

const sendInvite = (teamId, data) => api.post(`${BASE_URL}/sendinvites/${teamId}`, data);
const acceptRejectInvite = (teamId, memberId, option) => api.post(`${BASE_URL}/acceptreject/${teamId}/${memberId}/${option}`);

const deleteMember = (teamId, memberId) => api.delete(`${BASE_URL}/deletemembers/${teamId}/${memberId}`);
const updateMember = (teamId, memberId, data) => api.post(`${BASE_URL}/updatemembers/${teamId}/${memberId}`, data);

const updateTeamStat = (teamId, data) => api.post(`${BASE_URL}/${teamId}/stats`, data);
const getTeamStat = (teamId) => api.get(`${BASE_URL}/${teamId}/stats`);

const subscribeEmailNotification = (data) => api.post(`${BASE_URL}/notification/subscribe`, data);
const unsubscribeEmailNotification = (data) => api.post(`${BASE_URL}/notification/unsubscribe`, data);

export default {
  generateTeamName,
  createTeam,
  getAllTeams,
  getTeamById,
  deleteTeam,
  sendInvite,
  acceptRejectInvite,
  deleteMember,
  updateMember,
  updateTeamStat,
  getTeamStat,
  subscribeEmailNotification,
  unsubscribeEmailNotification
};
