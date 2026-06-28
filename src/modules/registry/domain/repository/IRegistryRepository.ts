import { UpdateRegistryDTO } from "@/@types/dto/UpdateRegistryDTO";
import { RegistryInstance } from "../entity/Registry";
import { RegisterInstanceDTO } from "@/@types/dto/RegisterInstanceDTO";

export interface IRegistryRepository {
  //createRegistry(data: CreateRegistryDTO): Promise<RegistryInstance>;
  registerInstance(data: RegisterInstanceDTO): Promise<RegistryInstance>;
  updateRegistry(data: UpdateRegistryDTO): Promise<RegistryInstance>;
  deleteRegistry(id: string): Promise<void>;

  findByEvent(event: string): Promise<Array<RegistryInstance>>;
  findByInstanceName(instanceName: string): Promise<RegistryInstance | null>;
  findByPort(port: number): Promise<RegistryInstance | null>;
}