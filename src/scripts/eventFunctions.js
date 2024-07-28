import { todoInputEl, createTodoButtonEl } from "./domSelectors.js";

const setNewTodoEnterKeyEvent = (handleNewTodo) => {
  todoInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleNewTodo();
  });
};

const setNewTodoButtonClickEvent = (handleNewTodo) => {
  createTodoButtonEl.addEventListener("click", handleNewTodo);
};

export { setNewTodoEnterKeyEvent, setNewTodoButtonClickEvent };
