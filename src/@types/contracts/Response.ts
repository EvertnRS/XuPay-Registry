import { MessageBody } from "./MessageBody";

export type Response = {
  method: string;
  path: string;
  body: MessageBody;
};
