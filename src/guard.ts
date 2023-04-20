import { RedirectLoginOptions } from 'idmesh-spa-js';
import { unref } from 'vue';
import type { App } from 'vue';
import type { RouteLocation } from 'vue-router';
import { client as idmeshClient } from './plugin';
import { IDMeshVueClient } from "./interface";
import { watchEffectOnceAsync } from './utils';
import { IDMESH_TOKEN } from './consts';

async function createGuardHandler(
  client: IDMeshVueClient,
  to: RouteLocation,
  redirectLoginOptions?: RedirectLoginOptions
) {
  const fn = async () => {
    if (unref(client.isAuthenticated)) {
      return true;
    }

    await client.loginWithRedirect({
      appState: { target: to.fullPath },
      ...redirectLoginOptions
    });

    return false;
  };

  if (!unref(client.isLoading)) {
    return fn();
  }

  await watchEffectOnceAsync(() => !unref(client.isLoading));

  return fn();
}

export async function authGuard(to: RouteLocation) {
  return createGuardHandler(unref(idmeshClient)!, to);
}

export interface AuthGuardOptions {
  app?: App;
  redirectLoginOptions?: RedirectLoginOptions;
}


export function createAuthGuard(
  appOrOptions?: App | AuthGuardOptions
): (to: RouteLocation) => Promise<boolean> {
  const { app, redirectLoginOptions } =
    !appOrOptions || 'config' in appOrOptions
      ? { app: appOrOptions as App, redirectLoginOptions: undefined }
      : (appOrOptions as AuthGuardOptions);

  return async (to: RouteLocation) => {
    const client = app
      ? (app.config.globalProperties[IDMESH_TOKEN] as IDMeshVueClient)
      : unref(idmeshClient)!;

    return createGuardHandler(client, to, redirectLoginOptions);
  };
}
