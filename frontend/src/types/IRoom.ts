export interface IRoom {
  id: string;
  name: string;
  roomType: "direct_message" | "normal";
  updated?: boolean;
  role: "member" | "moderator" | "owner";
}
