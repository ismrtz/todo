const createTodoListEl = () => {
  const listEl = document.createElement("ul");
  listEl.className = "todo__list";

  return listEl;
};

const createEmptyTodoListEl = () => {
  const emptyListEl = document.createElement("section");
  emptyListEl.className = "todo__list-empty";
  emptyListEl.innerHTML = `<span class="todo__list-empty-icon ri-draft-line"></span>
    <div class="todo__list-empty-text">
      <strong>You don't have tasks registered yet</strong>
      <p>Create tasks and organize your todo items</p>
    </div>`;

  return emptyListEl;
};

const createTodoItemEl = (item, onSelectItem, onDeleteItem) => {
  const deleteIconEl = document.createElement("span");
  const deleteButtonEl = document.createElement("button");
  const titleEl = document.createElement("p");
  const checkboxEl = document.createElement("seaction");
  const checkboxInputEl = document.createElement("input");
  const customCheckboxInputEl = document.createElement("span");
  const labelEl = document.createElement("label");
  const liEl = document.createElement("li");

  labelEl.className = "todo__item";

  checkboxEl.className = "checkbox";

  checkboxInputEl.name = item.id;
  checkboxInputEl.className = "checkbox__input";
  checkboxInputEl.type = "checkbox";
  checkboxInputEl.addEventListener("change", onSelectItem);
  checkboxInputEl.checked = item.checked;

  customCheckboxInputEl.className = "checkbox__select";

  titleEl.className = "todo_item-title";
  titleEl.textContent = item.value;
  if (item.checked) titleEl.classList.add("todo__item-title--checked");

  deleteIconEl.className = "ri-delete-bin-line";

  deleteButtonEl.className = "todo__item-delete";

  checkboxEl.append(checkboxInputEl);
  checkboxEl.append(customCheckboxInputEl);

  deleteButtonEl.append(deleteIconEl);
  deleteButtonEl.addEventListener("click", onDeleteItem);

  labelEl.append(checkboxEl);
  labelEl.append(titleEl);
  labelEl.append(deleteButtonEl);

  liEl.append(labelEl);
  return liEl;
};

export { createTodoListEl, createTodoItemEl, createEmptyTodoListEl };
