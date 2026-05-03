import { Response } from "@/@types/contracts/Response";
import { Request } from "@/@types/contracts/Request";
import { Payload } from "@/@types/contracts/MessageBody";
import { GetRegistryPayload } from "@/@types/contracts/GetRegistryPayload";
import { CreateRegistryPayload } from "@/@types/contracts/CreateRegistryPayload";
import { UpdateRegistryPayload } from "@/@types/contracts/UpdateRegistryPayload";
import { DeleteRegistryPayload } from "@/@types/contracts/DeleteRegistryPayload";
import { InstanceStatus } from "@/infra/database/generated/enums";

export class ResponseParser {
  public static deserialize(rawRequest: string): Request {
    try {
      const request = rawRequest.trim();

      const parts = request.split("|");

      if (parts.length !== 3) {
        throw new Error(
          "Requisição com campos diferentes do esperado " + request
        );
      }

      const [method, path, rawBody] = parts;

      const bodyParts = rawBody.split(";").map((part) => part.trim());

      if (bodyParts.length !== 4) {
        throw new Error(
          "Corpo da requisição com campos diferentes do esperado " + rawBody
        );
      }

      const [source, type, rawPayload, timestamp] = bodyParts;

      const payload = this.parsePayload(rawPayload);

      return {
        method,
        path,
        body: {
          source,
          type,
          payload,
          timestamp: timestamp.trim(),
        },
      };
    } catch (error: any) {
      throw new Error(`Formato inválido de corpo: ${error.message}`);
    }
  }

  private static parsePayload(rawPayload: string): Payload {
    const payload = this.parseKeyValueList(rawPayload);

    const hasId = Boolean(payload.id);
    const hasService = Boolean(payload.service);
    const hasInstanceName = Boolean(payload.instanceName);
    const hasStatus = Boolean(payload.status);

    if (hasService && hasInstanceName && !hasId && !hasStatus) {
      return this.parseCreatePayload(payload);
    }

    if (hasService && !hasInstanceName && !hasId && !hasStatus) {
      return this.parseGetPayload(payload);
    }

    if (hasId && hasStatus && !hasService && !hasInstanceName) {
      return this.parseUpdatePayload(payload);
    }

    if (hasId && !hasStatus && !hasService && !hasInstanceName) {
      return this.parseDeletePayload(payload);
    }

    throw new Error(
      "Payload do Registry inválido. Formatos aceitos: service=xxx | service=xxx,instanceName=yyy | id=xxx,status=UP | id=xxx"
    );
  }

  private static parseGetPayload(
    payload: Record<string, string>
  ): GetRegistryPayload {
    return {
      kind: "GET_REGISTRY_PAYLOAD",
      service: payload.service,
    };
  }

  private static parseCreatePayload(
    payload: Record<string, string>
  ): CreateRegistryPayload {
    return {
      kind: "CREATE_REGISTRY_PAYLOAD",
      service: payload.service,
      instanceName: payload.instanceName,
    };
  }

  private static parseUpdatePayload(
    payload: Record<string, string>
  ): UpdateRegistryPayload {
    if (!Object.values(InstanceStatus).includes(payload.status as InstanceStatus)) {
      throw new Error("Status inválido: " + payload.status);
    }

    return {
      kind: "UPDATE_REGISTRY_PAYLOAD",
      id: payload.id,
      status: payload.status as InstanceStatus,
    };
  }

  private static parseDeletePayload(
    payload: Record<string, string>
  ): DeleteRegistryPayload {
    return {
      kind: "DELETE_REGISTRY_PAYLOAD",
      id: payload.id,
    };
  }

  private static parseKeyValueList(rawPayload: string): Record<string, string> {
    if (!rawPayload || rawPayload.trim() === "") {
      throw new Error("Payload vazio");
    }

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