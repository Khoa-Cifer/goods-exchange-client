let setLoadingFunction: ((value: boolean) => void) | null = null;

export const setGlobalLoadingHandler = (fn: (value: boolean) => void) => {
  setLoadingFunction = fn;
};

export const showLoading = () => {
  if (setLoadingFunction) setLoadingFunction(true);
};

export const hideLoading = () => {
  if (setLoadingFunction) setLoadingFunction(false);
};
