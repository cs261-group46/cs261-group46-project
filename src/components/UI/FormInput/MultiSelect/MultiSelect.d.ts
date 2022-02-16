export type MultiSelectOption<T> = { label: string; value: T };
export type MultiSelectOptions<T> = Option<T>[];
export type RemoveSelectedHandler<T> = (selected: T) => void;
export type AddSelectedHandler<T> = (selected: Option<T>) => void;
export type SearchPromise = (value: string) => Promise<Options<T>>;
