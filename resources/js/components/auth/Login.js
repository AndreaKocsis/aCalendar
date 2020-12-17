import React, { Component } from 'react';

export const Login = (props) => {

    // this.setState({ isLoading: true });
    axios.post(`${process.env.MIX_DOMAIN}/api/user-login`, {
        email: props.email,
        password: props.password,
    })
    .then((response) => {
        // this.setState({ isLoading: false });
        if (response.data.status === 200) {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("userData", JSON.stringify(response.data.data));
            props.msg = response.data.message;
                props.redirect = true;
        }
        if (
            response.data.status === "failed" &&
            response.data.success === undefined
        ) {
            props.errMsgEmail = response.data.validation_error.email;
            props.errMsgPwd = response.data.validation_error.password;

        } else if (
            response.data.status === "failed" &&
            response.data.success === false
        ) {
            props.errMsg = response.data.message;

        }
    })
    .catch((error) => {
        console.log(error);
    });

    return (props);
}