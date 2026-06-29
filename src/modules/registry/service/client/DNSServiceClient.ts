import { UdpSocketClient } from "@/infra/client/UdpSocketClient";
import { ResponseParser } from "@/infra/parser/ResponseParser";

export class DNSServiceClient {
  constructor(
    private readonly socketClient: UdpSocketClient,
    private readonly dnsHost: string,
    private readonly dnsPort: number
  ) {}

  public async create(domain: string, ip: string): Promise<void> {
    const request = this.buildCreateRequest(domain, ip);

    console.log(`Enviando requisição para criar registro DNS: ${request}`);

    const rawResponse = await this.socketClient.send(
        this.dnsHost,
        this.dnsPort,
        request
    );

    console.log(`Resposta recebida do DNS Service: ${rawResponse}`);

    const parsed = ResponseParser.deserialize(rawResponse);

    console.log(`Resposta recebida do DNS Service: ${rawResponse}`);

    if (!parsed) {
        throw new Error("Resposta inválida do DNS Service");
    }
  }

  private buildCreateRequest(domain: string, ip: string): string {
    return ResponseParser.serialize({
        method: "POST",
        path: "create",
        service: process.env.XUPAY_SERVICE_NAME || "xupay-registry",
        secret: process.env.XUPAY_SERVICE_SECRET,
        body: {
            domain,
            ip
        }
    });
}
}