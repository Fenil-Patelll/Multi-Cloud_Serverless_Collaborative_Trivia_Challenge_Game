import api from "./auth.interceptor";

const BASE_URL = `${process.env.REACT_APP_NOTIFICATION_BASE_URL}`;

const PublishNotification = (data) => api.post(`${BASE_URL}/publish`, data);
const MarkNotificationsAsRead = (data) => api.put(`${BASE_URL}/mark-read`, data);
const fetchNotificationsByUserId = (userId) => api.get(`${BASE_URL}?userId=${userId}`);
const fetchNotificationsByType = (type) => api.get(`${BASE_URL}?notificationType=${type}`);

export default {
    PublishNotification,
    MarkNotificationsAsRead,
    fetchNotificationsByUserId,
    fetchNotificationsByType
};