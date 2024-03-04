export const isElementScrollable = (el: HTMLDivElement | null) => {
  if (el) {
    return el.scrollHeight > el.clientHeight;
  }

  return false;
};
