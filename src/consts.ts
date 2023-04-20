import type { InjectionKey } from 'vue';
import type { IDMeshVueClient } from "./interface";

export const Version = '1.0.0';
export const IDMESH_TOKEN = '$idmesh';
export const IDMESH_INJECT_KEY: InjectionKey<IDMeshVueClient> = Symbol(IDMESH_TOKEN);
