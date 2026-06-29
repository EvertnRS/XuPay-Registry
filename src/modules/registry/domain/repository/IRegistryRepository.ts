import { RegistryInstance } from "../entity/Registry";

export interface IRegistryRepository {
  createRegistry(registry: Omit<RegistryInstance, 'id'| 'status' | 'createdAt'>): Promise<RegistryInstance>;
  updateRegistry(egistry: Omit<RegistryInstance, 'event'| 'instanceName' | 'path' | 'createdAt'>): Promise<RegistryInstance>;
  deleteRegistry(registry: Omit<RegistryInstance, 'event'| 'instanceName' | 'createdAt' | 'status' | 'path'>): Promise<void>;

  findByEvent(registry: Omit<RegistryInstance, 'id'| 'instanceName' | 'createdAt' | 'status' | 'path'>): Promise<Array<RegistryInstance>>;
  findActives(): Promise<Array<RegistryInstance>>;
  findById(id: string): Promise<RegistryInstance | null>;
  findByInstanceName(instanceName: string): Promise<RegistryInstance | null>
}