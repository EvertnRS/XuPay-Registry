import { PayloadBase } from "../PayloadBase";

export type CreateRegistryPayload = PayloadBase & {
  kind: "CREATE_REGISTRY_PAYLOAD";
  event: string;
  instanceName: string;
  path: string;
};