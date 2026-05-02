import { InstanceStatus } from "@/infra/database/generated/enums";

export type Payload = {
  id?:string;
  target:string;
  instanceName?:string;
  status?:InstanceStatus;
};