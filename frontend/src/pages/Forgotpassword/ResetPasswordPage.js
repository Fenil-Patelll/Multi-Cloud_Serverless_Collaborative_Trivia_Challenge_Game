import React, { useState } from "react";
import "./Forgotpassword.css";
import { useNavigate } from "react-router-dom";
import { ConfirmPasswordReset } from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { ResetPasswordValidationSchema } from "../../utils/validationSchema";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      verificationCode: "",
      newPassword: "",
    },
    validationSchema: ResetPasswordValidationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      const requestBody = {
        email: localStorage.getItem("forgotUserEmail"),
        verificationCode: data.verificationCode,
        newPassword: data.newPassword,
      };
      const response = await ConfirmPasswordReset(requestBody);
      if (!response?.data?.error) {
        navigate("/login");
        toast.error("Password Changed Successfully!");
        localStorage.removeItem("forgotUserEmail");
        setIsLoading(false);
      } else {
        navigate("/resetPassword");
        setIsLoading(false);
        toast.error(
          response?.data?.error
            ? response?.data?.error?.message
            : "Verification Code is wrong!"
        );
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form className="login-form" onSubmit={formik.handleSubmit}>
            <h2>Reset Password </h2>
            <div className="form-group mt-5">
              <input
                type="text"
                name="verificationCode"
                value={formik.values.verificationCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Verification Code *"
                required
              />
              {formik.touched.verificationCode &&
                formik.errors.verificationCode && (
                  <div className="error">{formik.errors.verificationCode}</div>
                )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="New Password *"
                required
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="error">{formik.errors.newPassword}</div>
              )}
            </div>
            {isLoading ? (
              <div className="btn btn-block spinnerContainer">
                <Spinner />
              </div>
            ) : (
              <button type="submit" className="btn btn-block">
                Reset
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
