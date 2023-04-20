import type {
  IdmeshClientOptions,
  LogoutOptions as SPALogoutOptions,
  RedirectLoginOptions as SPARedirectLoginOptions
} from 'idmesh-spa-js';
import { AppState } from './app-state';

export interface IDMeshVueClientOptions extends IdmeshClientOptions {}

export interface LogoutOptions extends Omit<SPALogoutOptions, 'onRedirect'> {}
export interface RedirectLoginOptions<TAppState = AppState> extends Omit<SPARedirectLoginOptions<TAppState>, 'onRedirect'> {}
