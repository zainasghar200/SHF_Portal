// import axios from "axios";
// import React from "react";
// import { Redirect } from "react-router-dom";

class Auth {
  constructor() {
    this.authenticated = false;

    // axios.interceptors.request.use(
    //   config => {
    //     let token = localStorage.getItem("userToken");

    //     if (token) {
    //       config.headers["Authorization"] = `Bearer ${token}`;
    //     }

    //     return config;
    //   },

    //   error => {
    //     return Promise.reject(error);
    //   }
    // );
  }

  // login(Bodydata) {
  //   const response = axios({
  //     url: "http://localhost:56885/Token",
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  //     },
  //     data: Bodydata
  //   })
  //     .then(res => {
  //       console.log(res);
  //       localStorage.setItem("userToken", res.data.access_token);
  //       this.setAuthentication(true);
  //       axios.defaults.headers.common["Authorization"] = res.data.access_token;
  //       return <Redirect to="/" />;
  //       //this.props.history.push("/");
  //       //window.location.replace("http://localhost:3000/dashboard");
  //     })

  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }

  logout() {
    localStorage.removeItem("userToken");
  }

  setAuthentication(flag) {
    this.authenticated = flag;
  }

  isAuthenticated() {
    //return this.authenticated;
    if (localStorage.getItem("userToken") === null) {
      return false;
    } else {
      return true;
    }
  }
  validToken() {
    return localStorage.getItem("userToken");
  }
}

export default new Auth();
