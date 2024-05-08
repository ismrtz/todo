import { createTodoObject } from "./src/scripts/types.js";
import {
  createListEl,
  createEmptyListEl,
  createTodoItemElement,
} from "./src/scripts/elements.js";
import {
  addTodoDB,
  initIndexedDB,
  getAllTodoDB,
  deleteTodoDB,
  updateTodoDB,
} from "./src/scripts/indexedDB.js";

const todoEl = document.querySelector(".todo");
const todoInput = document.querySelector("#todo-input");
const createTodoButton = document.querySelector("#create-todo");
const [todoListCountEl, completedTodoListCountEl] = document.querySelectorAll(
  ".todo__detail-count"
);

await initIndexedDB();

let list = await getAllTodoDB();

let todoListEl = null;
let todoEmptyListEl = null;

const setTodoListCount = () => {
  todoListCountEl.innerText = list.length;
};

const setCompletedTodoListCount = () => {
  const completedTodoList = list.filter((todo) => todo.checked);

  completedTodoListCountEl.innerText = completedTodoList.length;
};

const appendListEl = () => {
  todoEl.append(createListEl());

  todoListEl = document.querySelector(".todo__list");
};

const appendEmptyList = () => {
  todoEl.append(createEmptyListEl());

  todoEmptyListEl = document.querySelector(".todo__list-empty");
};

const addTodoItemToList = async () => {
  try {
    const { value } = todoInput;

    const newTodo = createTodoObject(value, list.length);

    await addTodoDB(newTodo, {
      onSuccess: () => {
        todoInput.value = "";

        list.push(newTodo);
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
  const item = createTodoItemElement(todo, checkItem, deleteItem);
  todoListEl.prepend(item);
};

const renderTodoList = () => {
  for (const todo of list) {
    renderTodo(todo);
  }
};

const addTodoItem = () => {
  if (todoEmptyListEl) {
    todoEmptyListEl.remove();
    todoEmptyListEl = null;

    appendListEl();
  }

  addTodoItemToList();
};

const checkItem = async ($event) => {
  try {
    const { name: todoId, checked } = $event.target;

    await updateTodoDB(
      +todoId,
      { checked },
      {
        onSuccess: () => {
          const className = "todo__item-title--checked";
          const titleEl =
            $event.target.parentElement.parentElement.querySelector(
              ".todo_item-title"
            );
          const index = list.findIndex((todo) => todo.id === +todoId);

          list[index].checked = checked;

          if (checked) {
            titleEl.classList.add(className);
          } else {
            titleEl.classList.remove(className);
          }

          setCompletedTodoListCount();
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteItem = async ($event) => {
  try {
    const item = $event.target.parentElement.parentElement.parentElement;
    const { name: todoId } = item.querySelector(".checkbox__input");

    await deleteTodoDB(+todoId, {
      onSuccess: () => {
        const index = list.findIndex((todo) => todo.id === +todoId);
        if (index !== -1) list.splice(index, 1);

        item.remove();

        setTodoListCount();
        setCompletedTodoListCount();

        if (!list.length) {
          appendEmptyList();
        }
      },
    });
  } catch (error) {
    console.error(error);
  }
};

if (!list.length) {
  appendEmptyList();
} else {
  appendListEl();
  renderTodoList();
}

setTodoListCount();
setCompletedTodoListCount();

createTodoButton.addEventListener("click", addTodoItem);

todoInput.addEventListener("keydown", ($event) => {
  if ($event.key === "Enter") addTodoItem();
});
