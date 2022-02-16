export type Option<T> = { label: string; value: T };
export type Options<T> = Option<T>[];
export type removeSelectedHandler<T> = (selected: T) => void;
export type addSelectedHandler<T> = (selected: Option<T>) => void;
export type searchPromise = (value: string) => Promise<Options<T>>;
