import React, { useEffect, useState } from "react";
import "./QuesAnswerPage.css";
import Questions from "../../utils/questionsArray";
import { useNavigate } from "react-router-dom";
import { StoreUserResponse } from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import notificationService from "../../services/notification.service";

const QuesAnswerPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");

  const getQuestion = () => {
    const q = Questions[Math.floor(Math.random() * Questions.length)];
    setSecurityQuestion(q);
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
    const response = await StoreUserResponse(requestBody);
    if (!response?.data?.response?.error) {
      navigate("/login");
      toast.success("Registration Success!");
      const notification = {
        type: "welcomeUser",
        userId: localStorage.getItem("UserId"),
        message: "Welcome To the Trivia Titans."
      }
      await notificationService.PublishNotification(notification)
      setIsLoading(false);
    } else {
      toast.error("Internal Server Error.");
      navigate("/signuppage");
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Security Questions</h2>
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
          </form>
        </div>
      </div>
    </div>
  );
};
export default QuesAnswerPage;
