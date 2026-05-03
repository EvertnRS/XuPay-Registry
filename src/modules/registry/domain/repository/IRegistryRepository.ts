import { RegistryInstance } from "../entity/Registry";

export interface IRegistryRepository {
  createRegistry(registry: Omit<RegistryInstance, 'id'| 'status' | 'createdAt'>): Promise<void>;
  updateRegistry(egistry: Omit<RegistryInstance, 'service'| 'instanceName' | 'createdAt'>): Promise<any>;
  deleteRegistry(registry: Omit<RegistryInstance, 'service'| 'instanceName' | 'createdAt' | 'status'>): Promise<void>;

  findByService(registry: Omit<RegistryInstance, 'id'| 'instanceName' | 'createdAt' | 'status'>): Promise<Array<RegistryInstance>>;
}