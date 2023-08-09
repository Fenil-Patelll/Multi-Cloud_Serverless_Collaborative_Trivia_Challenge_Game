import React, { useState, useEffect } from "react";
import ProfileBar from "../../components/Profile/ProfileBar";
import Statistics from "../../components/statistics/Statistics";
import { GetAllGameData } from "../../services/user.service";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState("");
  const [gameData, setGameData] = useState("");

  const getGameData = async () => {
    try {
      const response = await GetAllGameData();
      setUserData(response.data.userData);
      setGameData(response.data.gameData);
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error.");
    }
  };

  useEffect(() => {
    getGameData();
  }, []);

  return (
    <>
      {!userData || !gameData ? (
        <>
          <div className="loader">
            <Spinner />
          </div>
        </>
      ) : (
        <>
          <ProfileBar userData={userData} gameData={gameData} />
          <Statistics gameData={gameData} />
        </>
      )}
    </>
  );
};

export default ProfilePage;
