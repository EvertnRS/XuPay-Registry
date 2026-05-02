import type { Response }  from "../../@types/contracts/Response";
import type { Request }  from "../../@types/contracts/Request";
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

      const body = this.parseKeyValueBody(rawBody);

      const requiredFields = [
        "source",
        "type",
        "id",
        "target",
        "instanceName",
        "timestamp",
      ];

      for (const field of requiredFields) {
        if (!body[field]) {
          return ErrorHandler.handle(
            `Campo obrigatório ausente: ${field}`,
            socket
          );
        }
      }

      return {
        method,
        path,
        body: {
          source: body.source,
          type: body.type,
          payload: {
            id: body.id,
            target: body.target,
            instanceName: body.instanceName,
          },
          timestamp: body.timestamp,
        },
      };
    } catch (error: any) {
      return ErrorHandler.handle(
        `Formato inválido de corpo: ${error.message}`,
        socket
      );
    }
  }

  private static parseKeyValueBody(rawBody: string): Record<string, string> {
    const result: Record<string, string> = {};

    const fields = rawBody.split(";");

    for (const field of fields) {
      const separatorIndex = field.indexOf("=");

      if (separatorIndex === -1) {
        throw new Error(`Campo sem "=": ${field}`);
      }

      const key = field.slice(0, separatorIndex).trim();
      const value = field.slice(separatorIndex + 1).trim();

      if (!key || !value) {
        throw new Error(`Campo inválido: ${field}`);
      }

      result[key] = value;
    }

    return result;
  }

    public static serialize(response: Response): string {
        return `${response.id}|${response.type}|${response.payload}`;
    }
}
