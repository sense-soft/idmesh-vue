import type {
  User,
  IdToken,
  PopupLoginOptions,
  PopupConfigOptions,
  RedirectLoginResult,
  GetTokenSilentlyOptions,
  GetTokenSilentlyVerboseResponse,
  GetTokenWithPopupOptions,
} from 'idmesh-spa-js';
import type { Ref } from 'vue';
import type { AppState } from './app-state';
import {
  LogoutOptions,
  RedirectLoginOptions
} from './idmesh-vue-client-options';

export interface IDMeshVueClient {
  isLoading: Ref<boolean>;
  isAuthenticated: Ref<boolean>;
  user: Ref<User>;
  idTokenClaims: Ref<IdToken>;
  error: Ref<any>;

  loginWithPopup(
    options?: PopupLoginOptions,
    config?: PopupConfigOptions,
  ): Promise<void>;

  loginWithRedirect(options?: RedirectLoginOptions<AppState>): Promise<void>;

  handleRedirectCallback(url?: string): Promise<RedirectLoginResult<AppState>>;

  checkSession(options?: GetTokenSilentlyOptions): Promise<void>;

  getAccessTokenSilently(
    options: GetTokenSilentlyOptions & { detailedResponse: true }
  ): Promise<GetTokenSilentlyVerboseResponse>;

  getAccessTokenSilently(options?: GetTokenSilentlyOptions): Promise<string>;

  getAccessTokenWithPopup(
    options?: GetTokenWithPopupOptions,
    config?: PopupConfigOptions
  ): Promise<string | undefined>;

  logout(options?: LogoutOptions): Promise<void>;
}
