import { PayloadBase } from "./PayloadBase";

export type CreateRegistryPayload = PayloadBase & {
  kind: "CREATE_REGISTRY_PAYLOAD";
  service: string;
  instanceName: string;
};