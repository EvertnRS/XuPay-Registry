import { PayloadBase } from "@/@types/contracts/payload/PayloadBase";

export type DNSServicePayload = PayloadBase & {
  kind: "DNS_SERVICE_PAYLOAD";
  instanceName: string;
  host: string;
}