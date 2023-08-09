import React, { useEffect, useState } from "react";
import "./QuesAnswerPage.css";
import { useNavigate } from "react-router-dom";
import {
  GetQuestionAnswer,
  QuestionAnswerValidationWithAuth,
} from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";

const VerifyQuestionAnswersPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    answer: "",
  });
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentLoading, setIsComponentLoading] = useState(false);

  const getQuestion = async () => {
    setIsComponentLoading(true);
    const requestBody = {
      userId: localStorage.getItem("UserId"),
    };
    const response = await GetQuestionAnswer(requestBody);
    setSecurityQuestion(response?.data?.question);
    setIsComponentLoading(false);
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const requestBody = {
      userId: localStorage.getItem("UserId"),
      question: securityQuestion,
      answer: data.answer,
    };
    const response = await QuestionAnswerValidationWithAuth(requestBody);
    if (!response?.data[0]?.isValidated) {
      navigate("/verifyQuestionAnswers");
      setIsLoading(false);
      toast.error("Security Authentication Failed!");
    } else {
      localStorage.setItem("mfaVerified", true);
      navigate("/profile");
      setIsLoading(false);
      toast.success("Login Success!");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Security Questions</h2>
            {isComponentLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50px"
                }}
              >
                <Spinner />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>{securityQuestion}</label>
                  <input
                    type="text"
                    name="answer"
                    value={data.answer}
                    className="form-control inputField"
                    placeholder="Security Answer *"
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
                {isLoading ? (
                  <div className="btn btn-block spinnerContainer">
                    <Spinner />
                  </div>
                ) : (
                  <button type="submit" className="btn btn-block">
                    Submit
                  </button>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default VerifyQuestionAnswersPage;
