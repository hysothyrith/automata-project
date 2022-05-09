export const debounce = (fn: () => void, ms: number) => {
  let timer: number | undefined;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
      timer = undefined;
    }, ms);
  };
};
