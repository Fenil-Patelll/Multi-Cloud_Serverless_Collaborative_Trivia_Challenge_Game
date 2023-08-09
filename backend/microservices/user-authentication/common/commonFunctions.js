exports.getUser = (userAttributes) => {
  let user = {
    id: "",
    family_name: "",
    given_name: "",
    gender: "",
    phone_number: "",
    email: "",
    picture: "",
    isAdmin: "",
  };

  userAttributes.map((val, index) => {
    if (val.Name === "sub") {
      user.id = val.Value;
    }
    if (val.Name === "family_name") {
      user.family_name = val.Value;
    }
    if (val.Name === "given_name") {
      user.given_name = val.Value;
    }
    if (val.Name === "gender") {
      user.gender = val.Value;
    }
    if (val.Name === "phone_number") {
      user.phone_number = val.Value;
    }
    if (val.Name === "email") {
      user.email = val.Value;
    }
    if (val.Name === "picture") {
      user.picture = val.Value;
    }
    if (val.Name === "custom:isAdmin") {
      user.isAdmin = val.Value;
    }
  });

  return user;
};
