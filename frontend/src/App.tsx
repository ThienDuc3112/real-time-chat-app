import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./component/mainPage";
import LandingPage from "./component/landingPage";
import Login from "./component/login";
import Register from "./component/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
