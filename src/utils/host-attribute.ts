import { assertInInjectionContext, inject, HostAttributeToken } from "@angular/core";

export function hostAttribute<R extends string | undefined>(key: string, defaultValue?: R): R | undefined {
  assertInInjectionContext(hostAttribute);

  return (inject(new HostAttributeToken(key), { optional: true }) as R) ?? defaultValue;
}

hostAttribute.required = <R extends string>(key: string): R => {
  assertInInjectionContext(hostAttribute);
  return inject(new HostAttributeToken(key)) as R;
};
