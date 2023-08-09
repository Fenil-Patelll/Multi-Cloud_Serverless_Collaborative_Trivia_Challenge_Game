import React, { useEffect, useState } from "react";
import "./ProfileBar.css";
import MetricChart from "../Chart/MetricChart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationService from "../../services/notification.service";

const ProfileBar = (props) => {
  const [isNotificationOpen, setIsNotitifcationOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [arrayNotifications, setArrayNotifications] = useState([]);

  // Function to fetch notifications by userId
  const fetchNotificationsByUserId = async (userId) => {
    try {
      const response = await NotificationService.fetchNotificationsByUserId(
        userId
      );
      setNotifications(response.data);
      if (response && response.data && response.data.length !== 0) {
        setArrayNotifications((prevArray) => [...prevArray, ...response.data]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  // Function to fetch notifications by type (e.g., 'CreateGame')
  const fetchNotificationsByType = async (type) => {
    try {
      const response = await NotificationService.fetchNotificationsByType(type);
      setNotifications(response.data);
      if (response && response.data && response.data.length !== 0) {
        setArrayNotifications((prevArray) => [...prevArray, ...response.data]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch notifications by userId every 5 seconds
    const userId = localStorage.getItem("UserId");
    console.log(userId); // Replace with the actual user id
    const type = "gameCreated";
    const interval = setInterval(() => {
      fetchNotificationsByUserId(userId);
      fetchNotificationsByType(type);
    }, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Mark fetched notifications as read after displaying them
    if (notifications.length > 0) {
      markNotificationsAsRead();
    }
  }, [notifications]);

  // Function to mark notifications as read (update ReadStatus)
  const markNotificationsAsRead = async () => {
    try {
      // Extract the notificationIds from the fetched notifications
      const notificationIds = notifications.map(
        (notification) => notification.notificationId
      );

      // Make an API call to update the ReadStatus of these notifications
      await NotificationService.MarkNotificationsAsRead({
        notificationIds: notificationIds,
      });
    } catch (error) {
      console.error("Error updating ReadStatus:", error);
    }
  };

  // Function to handle notification icon click
  const handleNotificationIconClick = () => {
    // Check if there are new notifications to display the dropdown
    if (isNotificationOpen) {
      setIsNotitifcationOpen(false);
    } else {
      setIsNotitifcationOpen(true);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      // Remove the deleted notification from the arrayNotifications state
      setArrayNotifications((prevArray) =>
        prevArray.filter(
          (notification) => notification.notificationId !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const EditProfile = async (e) => {
    navigate("/editProfile");
  };

  const Logout = async () => {
    const logout = await auth.logout();
    if (logout) {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6">
          <div className="profileBarContainer">
            <div className="row">
              <div className="profiledetails">
                <div className="col-sm-12 col-xs-12 col-md-4 col-lg-4">
                  <div className="profileimagecontainer">
                    <img
                      className="profileimage"
                      alt="profileimage"
                      src={
                        props.userData.picture !== ""
                          ? props.userData.picture
                          : require("../../assets/profile.png")
                      }
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-xs-12 col-md-4 col-lg-4">
                  <div className="profileDescription">
                    <div className="nameContainer">
                      <h6>
                        {props?.userData?.family_name +
                          " " +
                          props?.userData?.given_name}
                      </h6>
                      <div
                        className="notification"
                        onClick={handleNotificationIconClick}
                      >
                        <Badge
                          color="secondary"
                          badgeContent={arrayNotifications.length}
                        >
                          <NotificationsIcon fontSize="large" />
                        </Badge>
                        {isNotificationOpen && (
                          <div className="notificationContent">
                            {arrayNotifications?.length !== 0 ? (
                              <>
                                {arrayNotifications
                                  .slice()
                                  .reverse()
                                  .map((notification) => (
                                    <div
                                      key={notification.notificationId}
                                      className="notificationItem"
                                    >
                                      <p>{notification.message}</p>
                                      <hr />
                                      <div
                                        className="deleteNotificationContainer"
                                        onClick={() =>
                                          handleDeleteNotification(
                                            notification.notificationId
                                          )
                                        }
                                      >
                                        <DeleteIcon />
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : (
                              <p>No New Notifications</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <p>{props.userData.email}</p>
                    <p className="mobile">{props.userData.phone_number}</p>
                    <div className="profileButtons">
                      <button className="btn btn-primary" onClick={EditProfile}>
                        Edit Profile
                      </button>
                      <button className="btn btn-primary" onClick={Logout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-6">
          {props.gameData.win !== 0 || props.gameData.loss !== 0 ? (
            <MetricChart win={props.gameData.win} loss={props.gameData.loss} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBar;
