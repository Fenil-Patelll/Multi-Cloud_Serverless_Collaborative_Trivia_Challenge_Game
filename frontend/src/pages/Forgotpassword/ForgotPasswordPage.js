import React, { useState } from "react";
import "./Forgotpassword.css";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { ForgotPasswordValidationSchema } from "../../utils/validationSchema";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordValidationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      const requestBody = {
        email: data.email,
      };
      const response = await ForgotPassword(requestBody);
      if (!response?.data?.error) {
        localStorage.setItem("forgotUserEmail", data.email);
        navigate("/resetPassword");
        setIsLoading(false);
      } else {
        navigate("/forgotpassword");
        setIsLoading(false);
        toast.error(
          response?.data?.error
            ? response?.data?.error?.message
            : "Internal Server Error."
        );
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form className="login-form" onSubmit={formik.handleSubmit}>
            <h2>Forgot Password</h2>
            <div className="form-group mt-5">
              <input
                type="text"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Email *"
                required
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error">{formik.errors.email}</div>
              )}
            </div>
            {isLoading ? (
              <div className="btn btn-block spinnerContainer">
                <Spinner />
              </div>
            ) : (
              <button type="submit" className="btn btn-block">
                Send
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
