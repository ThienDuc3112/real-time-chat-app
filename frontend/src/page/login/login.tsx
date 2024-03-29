import { FormEventHandler, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../util/fetch";
import { API_URL } from "../../constants";

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
        get<{ token: string; expiredAt: number }>(`${API_URL}/user/refresh`, {
            credentials: "include",
        }).then((_) => {
            const [data, err] = _;
            if (!err) {
                window.localStorage.setItem("accessToken", JSON.stringify(data));
                navigate("/app");
            }
        });
    }, []);
    return <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your username/email below to login
                </p>
            </div>
            <form onSubmit={submitHandler} className="space-y-4">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                    >
                        Username or Email
                    </label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="email"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value.replace(" ", "_").toLowerCase())
                        }
                        placeholder="Username"
                        type="text"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="password"
                        >
                            Password
                        </label>
                    </div>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/80 h-10 px-4 py-2 w-full">
                    Login
                </button>
                <button disabled className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                    Login with Google
                </button>
            </form>
            <div className="mt-4 text-center text-sm">
                Don't have an account? {" "}
                <Link className="underline" to={"/signup"}>
                    Sign up
                </Link>
            </div>
        </div>
    </div>
};

export default Login;
