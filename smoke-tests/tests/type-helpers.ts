export type ResolvedType<T> = T extends Promise<infer R> ? R : T;
