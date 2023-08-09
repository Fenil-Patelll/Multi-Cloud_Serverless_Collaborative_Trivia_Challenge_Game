import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import { GetUser, UpdateUser } from "../../services/user.service";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { EditProfileValidationSchema } from "../../utils/validationSchema";
import AWS from "aws-sdk";

// TODO: Remove constants credentials
AWS.config.update({
  accessKeyId: "AKIAUSWUWNCSAWZWC242",
  secretAccessKey: "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",
  region: "us-east-1",
});

const EditProfile = () => {
  const navigate = useNavigate();
  const s3 = new AWS.S3();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getUserDetails = async () => {
    try {
      const response = await GetUser();
      const formInitialValues = {
        email: response.data.email || "",
        family_name: response.data.family_name || "",
        given_name: response.data.given_name || "",
        phone_number: response.data.phone_number || "",
        gender: response.data.gender || "",
        picture: response.data.picture || "",
      };
      formik.setValues(formInitialValues);
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error.");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleImpageInput = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const formik = useFormik({
    initialValues: {
      family_name: "",
      given_name: "",
      phone_number: "",
      gender: "",
      picture: "",
    },
    validationSchema: EditProfileValidationSchema,
    onSubmit: async (data) => {
      setIsLoading(true);

      let picture = "";
      if (file) {
        const params = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          Key: file.name,
          Body: file,
        };
        const response = await s3.upload(params).promise();
        picture = response.Location;
      }

      const requestBody = {
        email: data.email,
        family_name: data.family_name,
        given_name: data.given_name,
        gender: data.gender,
        phone_number: data.phone_number,
        picture: picture !== "" ? picture : data.picture,
      };
      const updateUserResponse = await UpdateUser(requestBody);
      if (!updateUserResponse?.data?.error) {
        toast.success("Profile Updated");
        navigate("/profile");
        setIsLoading(false);
      } else {
        toast.error(
          updateUserResponse?.data?.error
            ? updateUserResponse?.data?.error
            : "Internal Server Error."
        );
        setIsLoading(false);
      }
    },
  });
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form className="login-form" onSubmit={formik.handleSubmit}>
            <h2>Update Profile</h2>
            <div className="form-group mt-5">
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
                type="file"
                name="picture"
                onChange={handleImpageInput}
                className="form-control inputField"
                placeholder="Profile Picture"
              />
            </div>
            {isLoading ? (
              <div className="btn btn-block spinnerContainer">
                <Spinner />
              </div>
            ) : (
              <button type="submit" className="btn btn-block">
                Update
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
