export interface IMessage {
    id: string,
    roomId: string,
    userId: number,
    content: string,
    timestamp: Date,
    editted: boolean,
    username: string
}
