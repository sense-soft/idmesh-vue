import { inject } from 'vue';
import { IDMESH_INJECT_KEY, IDMESH_TOKEN } from "./consts";
import { IDMeshPluginOptions, IDMeshVueClient, IDMeshVueClientOptions } from './interface';
import { IDMeshPlugin } from './plugin';
import { deprecateRedirectUri } from './utils';

export * from './global';
export { IDMESH_INJECT_KEY } from './consts';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    [IDMESH_TOKEN]: IDMeshVueClient;
  }
}

export function createIDMesh(
  clientOptions: IDMeshVueClientOptions,
  pluginOptions?: IDMeshPluginOptions,
) {
  deprecateRedirectUri(clientOptions);
  return new IDMeshPlugin(clientOptions, pluginOptions);
}

export function useIDMesh(): IDMeshVueClient {
  return inject(IDMESH_INJECT_KEY) as IDMeshVueClient;
}
