import { shallow } from "zustand/shallow";

export const useShallowStore = <T, U>(
  store: (
    selector?: (state: T) => U,
    equalityFn?: (a: U, b: U) => boolean
  ) => U,
  selector: (state: T) => U
): U => {
  return store(selector, shallow);
};
