import { PayloadBase } from "./PayloadBase";

export type RegisterInstancePayload = PayloadBase & {
  kind: "REGISTER_INSTANCE_PAYLOAD";
  event: string;
  instanceName: string;
  path: string;
  port: number;
};