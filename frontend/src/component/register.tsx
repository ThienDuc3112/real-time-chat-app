import { FormEventHandler, useState } from "react";
import { API_URL } from "../constants";
import { post } from "../util/fetch";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    if (disabled) return;
    e.preventDefault();
    setDisabled(true);
    post(`${API_URL}/user/register`, {
      body: JSON.stringify({
        username: username.toLowerCase(),
        email,
        password,
        passwordVerification: verifyPassword,
      }),
    }).then((res) => {
      const [, err] = res;
      if (!err) {
        alert("Account created");
        navigate("/login");
      } else {
        alert(`An error occured, status code: ${err.status}`);
      }
    });
    setDisabled(false);
  };
  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={submitHandler}
      >
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.replace(" ", "_").toLowerCase())
          }
          placeholder="Username"
          name="username"
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="verifyPassword">Retype password</label>
        <input
          type="password"
          name="verifyPassword"
          placeholder="Verify password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
