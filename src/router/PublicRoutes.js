// imports consisting of material routes
import React from "react";
const Login = React.lazy(() => import("../components/login/Login"));
const Terms_of_use = React.lazy(() =>
  import("../components/login/Terms_of_use")
);
const Signup = React.lazy(() => import("../components/login/Signup"));
const SignupSuccess = React.lazy(() =>
  import("../components/login/SignupSuccess")
);
const Forgot = React.lazy(() => import("../components/marketPlace/Forgot"));
const Reset = React.lazy(() => import("../components/marketPlace/Reset"));
const Confirmed = React.lazy(() =>
  import("../components/marketPlace/Confirmed")
);
const SharedProfile = React.lazy(() =>
  import("../components/myAccount/sharedProfile/SharedProfile")
);
const DeleteAccount = React.lazy(() =>
  import("../components/myAccount/DeleteAccount")
);

export const PublicRoutes = [
  {
    path: "/",
    name: "Login",
    isAuthenticate: false,
    component: Login,
  },
  {
    path: "/login",
    name: "Login",
    isAuthenticate: false,
    component: Login,
  },
  {
    path: "/terms-of-use",
    name: "Terms_of_use",
    isAuthenticate: false,
    component: Terms_of_use,
  },
  {
    path: "/register",
    name: "Signup",
    isAuthenticate: false,
    component: Signup,
  },
  {
    path: "/register-success",
    name: "Signup",
    isAuthenticate: false,
    component: SignupSuccess,
  },
  {
    path: "/forgot",
    name: "Forgot",
    isAuthenticate: false,
    component: Forgot,
  },

  {
    path: "/reset/:token?",
    name: "Reset",
    isAuthenticate: true,
    component: Reset,
  },
  {
    path: "/confirmed",
    name: "Confirmed",
    isAuthenticate: true,
    component: Confirmed,
  },
  {
    path: "/public-profile/:user?/:profileURL?",
    name: "SharedProfile",
    isAuthenticate: true,
    component: SharedProfile,
  },
  {
    path: "/delete_account_confirmation/:id?",
    name: "SharedProfile",
    isAuthenticate: true,
    component: DeleteAccount,
  },
];
