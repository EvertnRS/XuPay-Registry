import { RegistryInstance } from "../entity/Registry";
import { InstanceStatus } from "@/infra/database/generated/enums";

export interface IRegistryRepository {
  createRegistry(target:string, instanceName:string): Promise<void>;
  updateRegistry(id: string, target:string, instanceName:string, status:InstanceStatus): Promise<any>;
  deleteRegistry(id: string): Promise<void>;

  findByTarget(name: string): Promise<Array<RegistryInstance>>;
}