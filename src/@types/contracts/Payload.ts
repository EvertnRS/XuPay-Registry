import { InstanceStatus } from "@/infra/database/generated/enums";

export type Payload = {
  id?:string;
  service:string;
  instanceName?:string;
  status?:InstanceStatus;
};