// Derived from deepmerge 4.3.1 and is-mergeable-object 1.1.0 (MIT).
// Edit this TypeScript source; regenerate lib/ with npm run build:deepmerge.
// See README.md for provenance and the two __proto__ guards added locally.

function defaultIsMergeableObject(value: any): boolean {
  if (!value || typeof value !== "object") return false;
  const tag = Object.prototype.toString.call(value);
  return tag !== "[object RegExp]" && tag !== "[object Date]" &&
    value.$$typeof !== Symbol.for("react.element");
}

type InternalOptions = deepmerge.Options & {
  arrayMerge: NonNullable<deepmerge.Options["arrayMerge"]>;
  isMergeableObject: (value: any) => boolean;
  cloneUnlessOtherwiseSpecified: typeof cloneUnlessOtherwiseSpecified;
};

function emptyTarget(value: any): any {
  return Array.isArray(value) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value: any, options?: deepmerge.Options): any {
  const configured = options as InternalOptions;
  return configured.clone !== false && configured.isMergeableObject(value)
    ? deepmerge(emptyTarget(value), value, configured)
    : value;
}

function defaultArrayMerge(target: any[], source: any[], options?: deepmerge.ArrayMergeOptions): any[] {
  return target.concat(source).map((element) =>
    cloneUnlessOtherwiseSpecified(element, options as InternalOptions));
}

function getMergeFunction(key: string | symbol, options: InternalOptions) {
  if (!options.customMerge) return deepmerge;
  // Upstream's public types use string; enumerable symbols are also passed
  // through unchanged at runtime, as in deepmerge 4.3.1.
  const customMerge = options.customMerge(key as string);
  return typeof customMerge === "function" ? customMerge : deepmerge;
}

function getKeys(target: any): (string | symbol)[] {
  return (Object.keys(target) as (string | symbol)[]).concat(
    Object.getOwnPropertySymbols(target).filter((symbol) =>
      Object.prototype.propertyIsEnumerable.call(target, symbol))
  );
}

function propertyIsOnObject(object: any, property: string | symbol): boolean {
  try {
    return property in object;
  } catch {
    return false;
  }
}

function propertyIsUnsafe(target: any, key: string | symbol): boolean {
  // A null-prototype target or an own enumerable key can bypass the upstream
  // guard. Never write this key to the ordinary destination object.
  return key === "__proto__" || (propertyIsOnObject(target, key) &&
    !(Object.prototype.hasOwnProperty.call(target, key) &&
      Object.prototype.propertyIsEnumerable.call(target, key)));
}

function mergeObject(target: any, source: any, options: InternalOptions): any {
  const destination: Record<string | symbol, any> = {};
  if (options.isMergeableObject(target)) {
    getKeys(target).forEach((key) => {
      // The target-copy path needs its own guard, before reading the value.
      if (key === "__proto__") return;
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  getKeys(source).forEach((key) => {
    if (propertyIsUnsafe(target, key)) return;
    if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
      destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    } else {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    }
  });
  return destination;
}

function deepmerge<T>(x: Partial<T>, y: Partial<T>, options?: deepmerge.Options): T;
function deepmerge<T1, T2>(x: Partial<T1>, y: Partial<T2>, options?: deepmerge.Options): T1 & T2;
function deepmerge(target: any, source: any, options?: deepmerge.Options): any {
  const configured = (options || {}) as InternalOptions;
  configured.arrayMerge = configured.arrayMerge || defaultArrayMerge;
  configured.isMergeableObject = configured.isMergeableObject || defaultIsMergeableObject;
  configured.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  if (sourceIsArray !== targetIsArray) {
    return cloneUnlessOtherwiseSpecified(source, configured);
  } else if (sourceIsArray) {
    return configured.arrayMerge(target, source, configured);
  } else {
    return mergeObject(target, source, configured);
  }
}

namespace deepmerge {
  export interface Options {
    arrayMerge?(target: any[], source: any[], options?: ArrayMergeOptions): any[];
    clone?: boolean;
    customMerge?: (key: string, options?: Options) => ((x: any, y: any) => any) | undefined;
    isMergeableObject?(value: object): boolean;
  }

  export interface ArrayMergeOptions {
    isMergeableObject(value: object): boolean;
    cloneUnlessOtherwiseSpecified(value: object, options?: Options): object;
  }

  export function all(objects: object[], options?: Options): object;
  export function all<T>(objects: Partial<T>[], options?: Options): T;
  export function all(objects: object[], options?: Options): object {
    if (!Array.isArray(objects)) throw new Error("first argument should be an array");
    return objects.reduce((previous, next) => deepmerge(previous, next, options), {});
  }
}

export = deepmerge;
