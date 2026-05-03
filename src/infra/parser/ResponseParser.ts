import type { Response } from "../../@types/contracts/Response";
import type { Request } from "../../@types/contracts/Request";
import { Socket } from "net";
import { ErrorHandler } from "../middleware/Error";

export class ResponseParser {
  public static deserialize(rawRequest: string, socket: Socket): Request | void {
    try {
      const parts = rawRequest.split("|");

      if (parts.length !== 3) {
        return ErrorHandler.handle(
          "Requisição com campos diferentes do esperado " + rawRequest,
          socket
        );
      }

      const [method, path, rawBody] = parts;

      const bodyParts = rawBody.split(";");

      if (bodyParts.length !== 4) {
        return ErrorHandler.handle(
          "Corpo da requisição com campos diferentes do esperado " + rawRequest,
          socket
        );
      }

      const [source, type, rawPayload, timestamp] = bodyParts;

      const payload = this.parsePayload(rawPayload);

      const requiredPayloadFields = ["target"];

      for (const field of requiredPayloadFields) {
        if (!payload[field]) {
          return ErrorHandler.handle(
            `Campo obrigatório ausente no payload: ${field}`,
            socket
          );
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
            target: payload.target,
            instanceName: payload.instanceName,
          },
          timestamp,
        },
      };
    } catch (error: any) {
      return ErrorHandler.handle(
        `Formato inválido de corpo: ${error.message}`,
        socket
      );
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