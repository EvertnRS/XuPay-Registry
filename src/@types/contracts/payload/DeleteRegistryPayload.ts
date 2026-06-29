import { PayloadBase } from "../PayloadBase";

export type DeleteRegistryPayload = PayloadBase & {
  kind: "DELETE_REGISTRY_PAYLOAD";
  id: string;
};