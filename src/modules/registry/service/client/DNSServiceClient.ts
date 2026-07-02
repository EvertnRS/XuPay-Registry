import { UdpSocketClient } from "@/infra/client/UdpSocketClient";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import type { DNSResolution } from "../../../../@types/clients/DNSResolution";

function parseRequiredPort(value: string | undefined, name: string): number {
  const parsedPort = Number.parseInt(value ?? "", 10) + 1;

  if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
    throw new Error(`Invalid or missing port for ${name}`);
  }

  return parsedPort;
}

export class DNSServiceClient {
  constructor(
    private readonly socketClient: UdpSocketClient,
    private readonly dnsHost: string,
    private readonly dnsPort: string
  ) {}

  public async resolve(instanceName: string): Promise<DNSResolution> {
    const request = this.buildResolveRequest(instanceName);

    console.log(`Enviando requisição para criar registro DNS: ${request}`);

    const rawResponse = await this.socketClient.send(
        this.dnsHost,
        parseRequiredPort(this.dnsPort, "DNS"),
        request
    );

    const parsed = ResponseParser.deserialize(rawResponse);

    if (!parsed) {
      throw new Error("Resposta inválida do DNS Service");
    }

    const payload = parsed.body.payload;

    if (payload.kind !== "DNS_SERVICE_PAYLOAD") {
      throw new Error("Payload inválido retornado pelo DNS Service");
    }

    return {
      instanceName: payload.instanceName,
      host: payload.host,
      port: payload.port
    };
  }

  private buildResolveRequest(instanceName: string): string {
    return ResponseParser.serialize({
      method: "GET",
      path: "resolve",
      service: process.env.XUPAY_SERVICE_NAME || "xupay-service-registry",
      secret: process.env.XUPAY_SERVICE_SECRET,
      body: {
        domain: instanceName
      },
    });
  }
}