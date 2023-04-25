import type { InjectionKey } from 'vue';
import type { IDMeshVueClient } from "./interface";

declare const __VERSION__: string;

export const Version = __VERSION__;
export const IDMESH_TOKEN = '$idmesh';
export const IDMESH_INJECT_KEY: InjectionKey<IDMeshVueClient> = Symbol(IDMESH_TOKEN);
