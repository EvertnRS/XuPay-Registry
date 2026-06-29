import { PayloadBase } from "../PayloadBase";

export type ServicePayload = PayloadBase & {
  kind: "SERVICE_PAYLOAD";
  health: string;
}