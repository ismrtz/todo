import { createTodo } from "./src/scripts/types.js";
import { Database } from "./src/scripts/database.js";
import { isEmpty, removeEl, updateInnerText } from "./src/scripts/helpers.js";
import {
  addTodo,
  updateTodo,
  removeTodo,
  getTodoList,
  setTodoList,
} from "./src/scripts/state.js";
import {
  todoEl,
  todoInputEl,
  todoListCountEl,
  completedTodoListCountEl,
} from "./src/scripts/domSelectors.js";
import {
  createTodoListEl,
  createTodoItemEl,
  createEmptyTodoListEl,
} from "./src/scripts/elements.js";
import {
  setNewTodoEnterKeyEvent,
  setNewTodoButtonClickEvent,
} from "./src/scripts/eventFunctions.js";

const DATABASE = {
  version: 1,
  name: "todo",
  tableName: "todo_list_tb",
};

/** @type {Database} */
let database = null;
let todoListEl = null;
let todoEmptyListEl = null;

const setTodoListCount = () =>
  updateInnerText(todoListCountEl, getTodoList().length);

const setCompletedTodoListCount = () => {
  const completedTodoList = getTodoList().filter((todo) => todo.checked);

  updateInnerText(completedTodoListCountEl, completedTodoList.length);
};

const appendTodoListEl = () => {
  todoEl.append(createTodoListEl());

  todoListEl = document.querySelector(".todo__list");
};

const appendEmptyTodoList = () => {
  todoEl.append(createEmptyTodoListEl());

  todoEmptyListEl = document.querySelector(".todo__list-empty");
};

const addTodoItem = async () => {
  try {
    const { value } = todoInputEl;

    const newTodo = createTodo(value, getTodoList().length);

    await database.add(newTodo, DATABASE.tableName, {
      onSuccess: () => {
        todoInputEl.value = "";

        addTodo(newTodo);
      },
      onError: () => {
        console.log("Error adding item to the database");
      },
    });

    renderTodo(newTodo);

    setTodoListCount();
  } catch (error) {
    console.error(error);
  }
};

const renderTodo = (todo) => {
  const item = createTodoItemEl(todo, checkTodoItem, deleteTodoItem);
  todoListEl.prepend(item);
};

const renderTodoList = () => {
  for (const todo of getTodoList()) {
    renderTodo(todo);
  }
};

const removeEmptyTodoListEl = () => {
  removeEl(todoEmptyListEl);
  todoEmptyListEl = null;
};

const removeTodoListEl = () => {
  removeEl(todoListEl);
  todoListEl = null;
};

const checkTodoListEmpty = () => {
  if (isEmpty(getTodoList())) {
    appendEmptyTodoList();

    removeTodoListEl();
  }
};

const checkTodoListFill = () => {
  if (todoEmptyListEl) {
    removeEmptyTodoListEl();
    appendTodoListEl();
  }
};

const handleNewTodo = () => {
  checkTodoListFill();

  addTodoItem();
};

const checkTodoItem = async (event) => {
  try {
    const { name: todoId, checked } = event.target;

    await database.update(+todoId, { checked }, DATABASE.tableName, {
      onSuccess: () => {
        const className = "todo__item-title--checked";
        const titleEl =
          event.target.parentElement.parentElement.querySelector(
            ".todo_item-title"
          );

        const todo = getTodoList().find((todo) => todo.id === +todoId);

        todo.checked = checked;

        updateTodo(todo);

        if (checked) {
          titleEl.classList.add(className);
        } else {
          titleEl.classList.remove(className);
        }

        setCompletedTodoListCount();
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const getTodo = (event) => {
  const todoEl = event.target.parentElement.parentElement.parentElement;
  const { name: todoId } = todoEl.querySelector(".checkbox__input");

  return { todoEl, todoId: +todoId };
};

const deleteTodoItem = async (event) => {
  try {
    const { todoEl, todoId } = getTodo(event);

    await database.delete(todoId, DATABASE.tableName, {
      onSuccess: () => {
        removeTodo(todoId);

        removeEl(todoEl);

        setTodoListCount();

        setCompletedTodoListCount();

        checkTodoListEmpty();
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const appInit = async () => {
  database = new Database({ name: DATABASE.name, version: 1 });

  await database.init();

  await database.table({ name: DATABASE.tableName, indexBy: "id" });

  const todoList = await database.getAll(DATABASE.tableName);

  setTodoList(todoList);

  if (isEmpty(getTodoList())) {
    appendEmptyTodoList();
  } else {
    appendTodoListEl();
    renderTodoList();
  }

  setTodoListCount();

  setCompletedTodoListCount();

  setNewTodoButtonClickEvent(handleNewTodo);

  setNewTodoEnterKeyEvent(handleNewTodo);
};

appInit();
