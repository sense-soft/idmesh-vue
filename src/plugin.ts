import type { App, Ref } from 'vue';
import { readonly, ref } from 'vue';
import type { Router } from 'vue-router';
import {
  GetTokenSilentlyOptions,
  GetTokenSilentlyVerboseResponse,
  GetTokenWithPopupOptions,
  IdmeshClient,
  IdToken,
  PopupConfigOptions,
  PopupLoginOptions,
  RedirectLoginResult,
  User,
} from 'idmesh-spa-js';
import { IDMESH_INJECT_KEY, IDMESH_TOKEN, Version } from './consts';
import {
  AppState,
  IDMeshPluginOptions,
  IDMeshVueClient,
  IDMeshVueClientOptions,
  LogoutOptions,
  RedirectLoginOptions,
} from './interface';
import { bindPluginMethods, deprecateRedirectUri } from './utils';

/**
 * @ignore
 */
export const client = ref<IDMeshVueClient>();

/**
 * @ignore
 */
export class IDMeshPlugin implements IDMeshVueClient {
  private _client!: IdmeshClient;
  private _isLoading = ref(true);
  private _isAuthenticated = ref(false);
  private _user = ref<User>();
  private _idTokenClaims = ref<IdToken>();
  private _error = ref<any>(null);

  isLoading = readonly(this._isLoading);
  isAuthenticated = readonly(this._isAuthenticated);
  user = readonly(this._user) as Ref<User>;
  idTokenClaims = readonly(this._idTokenClaims) as Ref<IdToken>;
  error = readonly(this._error);

  constructor(
    private clientOptions: IDMeshVueClientOptions,
    private pluginOptions?: IDMeshPluginOptions,
  ) {
    bindPluginMethods(this, ['constructor']);
  }

  install(app: App) {
    this._client = new IdmeshClient({
      ...this.clientOptions,
      idmeshClient: {
        name: 'idmesh-vue',
        version: Version,
      }
    });

    this.__checkSession(app.config.globalProperties.$router);

    app.config.globalProperties[IDMESH_TOKEN] = this;
    app.provide(IDMESH_INJECT_KEY, this);

    client.value = this;
  }

  async loginWithRedirect(options?: RedirectLoginOptions<AppState>) {
    deprecateRedirectUri(options);
    return this._client.loginWithRedirect(options);
  }

  async loginWithPopup(
    options?: PopupLoginOptions,
    config?: PopupConfigOptions
  ) {
    deprecateRedirectUri(options);
    return this.__proxy(() => this._client.loginWithPopup(options, config));
  }

  async logout(options?: LogoutOptions) {
    if (options?.openUrl || options?.openUrl === false) {
      return this.__proxy(() => this._client.logout(options));
    }

    return this._client.logout(options);
  }

  async getAccessTokenSilently(
    options: GetTokenSilentlyOptions & { detailedResponse: true }
  ): Promise<GetTokenSilentlyVerboseResponse>;

  async getAccessTokenSilently(
    options?: GetTokenSilentlyOptions
  ): Promise<string>;

  async getAccessTokenSilently(
    options: GetTokenSilentlyOptions = {}
  ): Promise<string | GetTokenSilentlyVerboseResponse> {
    deprecateRedirectUri(options);
    return this.__proxy(() => this._client.getTokenSilently(options));
  }

  async getAccessTokenWithPopup(
    options?: GetTokenWithPopupOptions,
    config?: PopupConfigOptions
  ) {
    deprecateRedirectUri(options);
    return this.__proxy(() => this._client.getTokenWithPopup(options, config));
  }

  async checkSession(options?: GetTokenSilentlyOptions) {
    return this.__proxy(() => this._client.checkSession(options));
  }

  async handleRedirectCallback(
    url?: string
  ): Promise<RedirectLoginResult<AppState>> {
    return this.__proxy(() =>
      this._client.handleRedirectCallback<AppState>(url)
    );
  }

  private async __checkSession(router?: Router) {
    const search = window.location.search;

    try {
      if (
        (search.includes('code=') || search.includes('error=')) &&
        search.includes('state=') &&
        !this.pluginOptions?.skipRedirectCallback
      ) {
        const result = await this.handleRedirectCallback();
        const appState = result?.appState;
        const target = appState?.target ?? '/';

        window.history.replaceState({}, '', '/');

        if (router) {
          router.push(target);
        }

        return result;
      } else {
        await this.checkSession();
      }
    } catch (e) {
      window.history.replaceState({}, '', '/');

      if (router) {
        router.push(this.pluginOptions?.errorPath || '/');
      }
    }
  }

  private async __refreshState() {
    this._isAuthenticated.value = await this._client.isAuthenticated();
    this._user.value = await this._client.getUser();
    this._idTokenClaims.value = await this._client.getIdTokenClaims();
    this._isLoading.value = false;
  }

  private async __proxy<T>(cb: () => T, refreshState = true) {
    let result;
    try {
      result = await cb();
      this._error.value = null;
    } catch (e) {
      this._error.value = e;
      throw e;
    } finally {
      if (refreshState) {
        await this.__refreshState();
      }
    }

    return result;
  }
}
