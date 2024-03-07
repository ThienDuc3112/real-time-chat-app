import { API_URL } from "../constants";
import { get } from "./fetch";

export const getAccessToken = async (): Promise<string> => {
  const _ = window.localStorage.getItem("accessToken");
  if (!_) return "";
  const token: {
    token: string;
    expiredAt: number;
  } = JSON.parse(_);
  if (Date.now() < token.expiredAt) {
    return token.token;
  }
  const [data, err] = await get<{
    token: string;
    expiredAt: number;
  }>(`${API_URL}/user/refresh`, {
    credentials: "include",
  });
  if (!err) {
    window.localStorage.setItem("accessToken", JSON.stringify(data));
    return data.token;
  }
  window.localStorage.removeItem("accessToken");
  return "";
};
