import React from "react";
import "./Statistics.css";
import { useNavigate } from 'react-router-dom';
const Statistics = (props) => {
  const isAdmin = localStorage.getItem('isAdmin');
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="row">
        <div className="playButtons">
          <button className="btn btn-primary" onClick={() => navigate('/teamlist')}>
            Explore Team
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/gamelist')} disabled={isAdmin !== 'true'}>
            Games
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/questionlist')} disabled={isAdmin !== 'true'}>
            Questions
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/leaderboard')}>
            Leader Board
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/detailedleaderboard')}>
            Game Statistics
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/chatbot')}
          >
            Virtual Assistance
          </button>
        </div>
        <div className="sectionTitle">
          <h1>Achievements</h1>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div className="statisticCard">
            <div className="iconContainer">
              <img
                className="icon"
                src={require("../../assets/trophy.png")}
                alt="trophy icon"
              />
            </div>
            <div className="details">
              <p>Total Wins</p>
              <h1>{props.gameData.win}</h1>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div className="statisticCard">
            <div className="iconContainer">
              <img
                className="icon"
                src={require("../../assets/lose.png")}
                alt="trophy icon"
              />
            </div>
            <div className="details">
              <p>Total Loss</p>
              <h1>{props.gameData.loss}</h1>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div className="statisticCard">
            <div className="iconContainer">
              <img
                className="icon"
                src={require("../../assets/joystick.png")}
                alt="trophy icon"
              />
            </div>
            <div className="details">
              <p>Games Played</p>
              <h1>{props.gameData.totalGamePlayed}</h1>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div className="statisticCard">
            <div className="iconContainer">
              <img
                className="icon"
                src={require("../../assets/medal.png")}
                alt="trophy icon"
              />
            </div>
            <div className="details">
              <p>Points Earned</p>
              <h1>{props.gameData.totalPoints}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
