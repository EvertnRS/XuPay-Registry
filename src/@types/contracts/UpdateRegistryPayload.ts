import { PayloadBase } from "./PayloadBase";
import { InstanceStatus } from "@/infra/database/generated/enums";

export type UpdateRegistryPayload = PayloadBase & {
  kind: "UPDATE_REGISTRY_PAYLOAD";
  id: string;
  status: InstanceStatus;
};