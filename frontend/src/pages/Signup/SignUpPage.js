import React, { useState } from "react";
import MultiStepProgressBar from "../../components/ProgressBar/MultiStepProgressBar";
import Signup from "./Signup";
import VerifyEmailPage from "../VerifyEmail/VerifyEmailPage";
import QuesAnswerPage from "../QuestionAndAnswers/QuesAnswerPage";
import "./Signup.css";
import "../../App.css";

const SignUpPage = () => {
  const [page, setPage] = useState("pageone");

  const nextPage = (page) => {
    setPage(page);
  };

  return (
    <div>
      <div className="progressBarContainer">
        <MultiStepProgressBar
          className="progressBar"
          page={page}
        />
      </div>
      {
        {
          pageone: <Signup redirectAnotherPage={nextPage} />,
          pagetwo: <VerifyEmailPage redirectAnotherPage={nextPage} />,
          pagethree: <QuesAnswerPage redirectAnotherPage={nextPage} />,
        }[page]
      }
    </div>
  );
};

export default SignUpPage;
