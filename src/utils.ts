import { watchEffect } from "vue";

export function watchEffectOnceAsync<T>(watcher: () => T) {
  return new Promise<void>(resolve => {
    watchEffectOnce(watcher, resolve);
  });
}

export function watchEffectOnce<T>(watcher: () => T, fn: Function) {
  const stopWatch = watchEffect(() => {
    if (watcher()) {
      fn();
      stopWatch();
    }
  });
}

export function bindPluginMethods(plugin: any, exclude: string[]) {
  Object
    .getOwnPropertyNames(Object.getPrototypeOf(plugin))
    .filter(method => !exclude.includes(method))
    .forEach(method => (plugin[method] = plugin[method].bind(plugin)));
}

export function deprecateRedirectUri(options?: any) {
  if (options?.redirect_uri) {
    console.warn(
      'Using `redirect_uri` has been deprecated, please use `authorizationParams.redirect_uri` instead as `redirectUri` will be no longer supported in a future version'
    );
    options.authorizationParams = options.authorizationParams || {};
    options.authorizationParams.redirect_uri = options.redirect_uri;
    delete options.redirect_uri;
  }
}
