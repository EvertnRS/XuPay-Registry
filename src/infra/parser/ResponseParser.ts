import { Response } from "@/@types/contracts/Response";
import { Request } from "@/@types/contracts/Request";

export class ResponseParser {
    public static deserialize(rawRequest: string): Request | void {
        try {
        const parts = rawRequest.split("|");

        if (parts.length !== 3) {
            throw new Error(
          "Requisição com campos diferentes do esperado " + rawRequest
        );
        }

        const [method, path, rawBody] = parts;

        const bodyParts = rawBody.split(";");

        if (bodyParts.length !== 4) {
            throw new Error(
                "Corpo da requisição com campos diferentes do esperado " + rawBody
            );
        }

      const [source, type, rawPayload, timestamp] = bodyParts;

      const payload = this.parsePayload(rawPayload);

      const requiredPayloadFields = ["service"];

      for (const field of requiredPayloadFields) {
        if (!payload[field]) {
          throw new Error(`Campo obrigatório ausente no payload: ${field}`);
        }
      }

      return {
        method,
        path,
        body: {
          source,
          type,
          payload: {
            id: payload.id,
            service: payload.service,
            instanceName: payload.instanceName,
          },
          timestamp:timestamp.trim(),
        },
      };
    } catch (error: any) {
      throw new Error(`Formato inválido de corpo: ${error.message}`);
    }
  }

  private static parsePayload(rawPayload: string): Record<string, string> {
    const payload: Record<string, string> = {};

    const fields = rawPayload.split(",");

    for (const field of fields) {
      const separatorIndex = field.indexOf("=");

      if (separatorIndex === -1) {
        throw new Error(`Campo de payload sem "=": ${field}`);
      }

      const key = field.slice(0, separatorIndex).trim();
      const value = field.slice(separatorIndex + 1).trim();

      if (!key || !value) {
        throw new Error(`Campo de payload inválido: ${field}`);
      }

      payload[key] = value;
    }

    return payload;
  }

  public static serialize(response: Response): string {
        return `${response.method}|${response.path}|${response.body.source};${response.body.type};${response.body.payload};${response.body.timestamp}`;
    }
}