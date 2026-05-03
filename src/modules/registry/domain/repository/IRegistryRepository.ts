import { RegistryInstance } from "../entity/Registry";

export interface IRegistryRepository {
  createRegistry(registry: Omit<RegistryInstance, 'id'| 'status' | 'createdAt'>): Promise<void>;
  updateRegistry(egistry: Omit<RegistryInstance, 'target'| 'instanceName' | 'createdAt'>): Promise<any>;
  deleteRegistry(registry: Omit<RegistryInstance, 'target'| 'instanceName' | 'createdAt' | 'status'>): Promise<void>;

  findByTarget(registry: Omit<RegistryInstance, 'id'| 'instanceName' | 'createdAt' | 'status'>): Promise<Array<RegistryInstance>>;
}