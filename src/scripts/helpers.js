const isEmpty = (list) => !list?.length;

const removeEl = (element) => {
  if (element) element.remove();
};

const updateInnerText = (element, text) => {
  if (element) element.innerText = text;
};

export { isEmpty, removeEl, updateInnerText };
