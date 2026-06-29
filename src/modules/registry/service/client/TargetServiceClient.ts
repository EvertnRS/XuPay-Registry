import { ServiceResponse } from "../../../../@types/clients/ServiceResponse";
import { UdpSocketClient } from "@/infra/client/UdpSocketClient";
import { ResponseParser } from "@/infra/parser/ResponseParser";

function parseRequiredPort(value: string | undefined, name: string): number {
  const parsedPort = Number.parseInt(value ?? "", 10) + 1;

  if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
    throw new Error(`Invalid or missing port for ${name}`);
  }

  return parsedPort;
}

export class TargetServiceClient {
  constructor(
    private readonly socketClient: UdpSocketClient
  ) {}

  public async send(params: {
    host: string;
    port: string;
  }): Promise<ServiceResponse> {
    const request = this.buildTargetRequest();

    const rawResponse = await this.socketClient.send(
      params.host,
      parseRequiredPort(params.port, "TARGET_SERVICE_PORT"),
      request
    );

    const parsed = ResponseParser.deserialize(rawResponse);

    if (!parsed) {
      throw new Error("Resposta inválida do serviço alvo");
    }

    const payload = parsed.body.payload;

    if (payload.kind !== "SERVICE_PAYLOAD") {
      throw new Error("Payload inválido retornado pelo serviço alvo");
    }

    return {
      health: payload.health
    };
  }

  private buildTargetRequest(): string {
    return ResponseParser.serialize({
      method: "GET",
      path: "health",
      service: process.env.XUPAY_SERVICE_NAME || "xupay-service-registry",
      secret: process.env.XUPAY_SERVICE_SECRET,
      body: {
        
      },
    });
  }
}