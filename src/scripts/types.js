const createTodo = (value, listCount) => {
  return {
    value,
    id: listCount,
    checked: false,
  };
};

export { createTodo };
