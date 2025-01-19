

import React from "react";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import User from "../Pages/User/User";

interface RouteConfig {
  path: string;
  Component: React.ComponentType;
}

//console.log("Routes");

const routes: RouteConfig[] = [
   
  { path: "/dashboard", Component: Home },
  { path: "/user", Component: User },
  { path: "/login", Component: Login },
];

export default routes;
