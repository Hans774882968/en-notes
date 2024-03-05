export type CommonObjectType<T = any> = Record<string, T>;
export type MaybeFalsy = false | '' | number | 0n | null | undefined; // 不考虑 document.all 了
