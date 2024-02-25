import { FormEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../util/fetch";
import { API_URL } from "../constants";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post<{ token: string; expiredAt: number }>(`${API_URL}/user/login`, {
            credentials: "include",
            body: JSON.stringify({ username, password }),
        }).then((res) => {
            const [data, err] = res;
            if (!err) {
                window.localStorage.setItem("accessToken", JSON.stringify(data));
                alert("Login successfully");
                navigate("/app");
            } else {
                console.log(err.data);
                alert("Login unsuccessfully");
            }
        });
    };
    useEffect(() => {
        get<{token: string, expiredAt: number}>(`${API_URL}/user/refresh`, {credentials: "include"}).then(_ => {
            const [data, err] = _;
            if(!err) {
                window.localStorage.setItem("accessToken", JSON.stringify(data))
                navigate("/app")
            }
        })
    }, [])
    return (
        <form onSubmit={submitHandler}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                name="username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value.replace(" ", "_").toLowerCase())
                }
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
