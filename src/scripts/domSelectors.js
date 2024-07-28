const todoEl = document.querySelector(".todo");
const todoInputEl = document.querySelector("#todo-input");
const createTodoButtonEl = document.querySelector("#create-todo");
const [todoListCountEl, completedTodoListCountEl] = document.querySelectorAll(
  ".todo__detail-count"
);

export {
  todoEl,
  todoInputEl,
  todoListCountEl,
  createTodoButtonEl,
  completedTodoListCountEl,
};
