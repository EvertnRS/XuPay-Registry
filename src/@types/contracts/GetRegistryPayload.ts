import { PayloadBase } from "./PayloadBase";

export type GetRegistryPayload = PayloadBase & {
  kind: "GET_REGISTRY_PAYLOAD";
  service: string;
};