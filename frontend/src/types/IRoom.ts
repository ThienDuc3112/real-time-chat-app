import {IMessage} from "./IMessage"
export interface IRoom {
    id: string,
    name: string,
    messages: IMessage[]
}
