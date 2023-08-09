import React, { useState } from "react";
import "./Signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { CreateUser } from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { SignUpValidationSchema } from "../../utils/validationSchema";
const Signup = ({ redirectAnotherPage }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      family_name: "",
      given_name: "",
      phone_number: "",
      gender: "",
    },
    validationSchema: SignUpValidationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);
      const response = await CreateUser(data);

      if (!response?.data?.error) {
        localStorage.setItem("UserId", response?.data?.UserSub);
        localStorage.setItem("mfaVerified", false);
        localStorage.setItem("userEmail", data.email);
        navigate("/signuppage");
        setIsLoading(false);
        redirectAnotherPage("pagetwo");
      } else {
        console.error(response?.data?.error);
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
            <h2>SignUp</h2>
            <p className="welcomeText">Welcome to Trivia Titans</p>
            <div className="form-group">
              <input
                type="email"
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
            <div className="form-group">
              <input
                type="family_name"
                name="family_name"
                value={formik.values.family_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Family Name *"
                required
              />
              {formik.touched.family_name && formik.errors.family_name && (
                <div className="error">{formik.errors.family_name}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="given_name"
                name="given_name"
                value={formik.values.given_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Given Name *"
                required
              />
              {formik.touched.given_name && formik.errors.given_name && (
                <div className="error">{formik.errors.given_name}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Gender *"
                required
              />
              {formik.touched.gender && formik.errors.gender && (
                <div className="error">{formik.errors.gender}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="phone_number"
                name="phone_number"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Phone Number *"
                required
              />
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div className="error">{formik.errors.phone_number}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control inputField"
                placeholder="Password *"
                required
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>
            <div>
              <NavLink to="/login" className="link forgotpassword">
                Already Have an Account?
              </NavLink>
            </div>
            {isLoading ? (
              <div className="btn btn-block spinnerContainer">
                <Spinner />
              </div>
            ) : (
              <button type="submit" className="btn btn-block">
                SignUp
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
