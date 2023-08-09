import React, { useState } from "react";
import "./VerifyEmailPage.css";
import { useNavigate } from "react-router-dom";
import { VerifyEmail } from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { verifyEmailValidationSchema } from "../../utils/validationSchema";

const VerifyEmailPage = ({ redirectAnotherPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: verifyEmailValidationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      const requestBody = {
        email: localStorage.getItem("userEmail"),
        code: data.code,
      };
      const response = await VerifyEmail(requestBody);
      if (!response?.data?.error) {
        navigate("/signuppage");
        setIsLoading(false);
        localStorage.removeItem("userEmail");
        redirectAnotherPage("pagethree");
      } else {
        navigate("/signuppage");
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
            <h2>Verify Email</h2>
            <div className="form-group mt-5">
              <input
                type="text"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Verification Code *"
                required
              />
              {formik.touched.code && formik.errors.code && (
                <div className="error">{formik.errors.code}</div>
              )}
            </div>
            {isLoading ? (
              <div className="btn btn-block spinnerContainer">
                <Spinner />
              </div>
            ) : (
              <button type="submit" className="btn btn-block">
                Verify
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
