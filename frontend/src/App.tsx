import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./page/mainApp/mainPage";
import LandingPage from "./page/landingPage/landingPage";
import Login from "./page/login/login";
import Register from "./page/register/register";
import { FriendsContextProvider } from "./context/friend/friendsContextProvider";
import { RecentUserContextProvider } from "./context/recentUser/recentUserContextProvider";
import { RoomContextProvider } from "./context/room/roomContextProvider";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <RoomContextProvider>
            <FriendsContextProvider>
              <RecentUserContextProvider>
                <MainPage />
              </RecentUserContextProvider>
            </FriendsContextProvider>
            </RoomContextProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
