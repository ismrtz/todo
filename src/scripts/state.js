let todoList = [];

const getTodoList = () => todoList;

const setTodoList = (newTodoList) => {
  todoList = newTodoList;
};

const addTodo = (todo) => {
  todoList.push(todo);
};

const removeTodo = (todoId) => {
  todoList = todoList.filter((todo) => todo.id !== todoId);
};

const updateTodo = (updatedTodo) => {
  const index = todoList.findIndex((todo) => todo.id === updatedTodo.id);
  if (index !== -1) {
    todoList[index] = updatedTodo;
  }
};

export { addTodo, removeTodo, updateTodo, getTodoList, setTodoList };
