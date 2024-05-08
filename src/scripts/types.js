const createTodoObject = (value, todoListCount) => {
  return {
    value,
    checked: false,
    id: todoListCount,
  };
};

export { createTodoObject };
