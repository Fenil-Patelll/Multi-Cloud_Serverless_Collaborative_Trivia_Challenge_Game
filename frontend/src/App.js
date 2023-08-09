import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import VerifyQuestionAnswersPage from "./pages/QuestionAndAnswers/VerifyQuestionAnswersPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordPage from "./pages/Forgotpassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Forgotpassword/ResetPasswordPage";
import SignUpPage from "./pages/Signup/SignUpPage";
import LobbyView from "./components/Lobby/LobbyView";
import ProfilePage from "./pages/profile/ProfilePage";
import LoginPage from "./pages/Login/LoginPage";
import EditProfile from "./pages/EditProfile/EditProfile";
import CreateTeamPage from "./pages/CreateTeam/CreateTeam";
import TeamDashboardPage from "./pages/TeamDashboard/TeamDashboard";
import LeaderboardPage from "./pages/LeaderBoard/LeaderBoard";
import DetailedStatisticsPage from "./pages/DetailedLeaderBoard/DetailedLeaderBoard";
import TeamList from "./pages/TeamList/TeamList";
import QuestionForm from "./pages/ContentManagement/Question/QuestionForm";
import GameForm from "./pages/ContentManagement/Game/GameForm";
import ChatInterface from "./pages/ChatBot/ChatInterface";
import GameList from "./pages/ContentManagement/Game/GameList";
import QuestionList from "./pages/ContentManagement/Question/QuestionList";
import Game from "./pages/InGameExperince/Game";
import LexBot from "./pages/ChatBot/LexBot";


const App = () => {
  return (
    <Fragment>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="verifyQuestionAnswers"
          element={<VerifyQuestionAnswersPage />}
        />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/signuppage" element={<SignUpPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/lobby/:teamId" element={<LobbyView />} />
          <Route path="/editProfile" element={<EditProfile />} />
          {/* <Route path="/question-pool" element={<Forms />} /> */}
          <Route path="/create-game" element={<GameForm />} />
          <Route path="/create-question" element={<QuestionForm />} />
          <Route path="/createTeam" element={<CreateTeamPage />} />
          <Route path="/teamlist" element={<TeamList />} />
          <Route path="/teamdashboard/:id" element={<TeamDashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/questionlist" element={<QuestionList />} />
          <Route path="/gamelist" element={<GameList />} />
          <Route
            path="/detailedleaderboard"
            element={<DetailedStatisticsPage />}
          />
          {/* In game part*/}
          <Route path="/chatbot" element={<LexBot />} />

          {/* <Route path="/chat" element={<ChatInterface />} />

          <Route path="/chat" element={<ChatInterface />} /> */}

          <Route path="/game/:teamId/:gameId" element={<Game />} />
        </Route>
      </Routes>
    </Fragment>
  );
};

export default App;
