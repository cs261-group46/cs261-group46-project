export type MultiSelectOption<T> = { label: string; value: T };
export type MultiSelectOptions<T> = MultiSelectOption<T>[];
export type RemoveSelectedHandler<T> = (selected: T) => void;
export type AddSelectedHandler<T> = (selected: Option<T>) => void;
export type SetSelectedHandler<T> = (selected: MultiSelectOptions<T>) => void
export type SearchPromise<T> = (
  value: string
) => Promise<MultiSelectOptions<T>>;
