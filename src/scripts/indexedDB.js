const indexBy = "id";
const databaseName = "todo";
const databaseVersion = 1;
const todoListTableName = "todo_list_tb";

const initIndexedDB = async () => {
  try {
    const openOrCreateDB = indexedDB.open(databaseName, databaseVersion);

    const database = await new Promise((resolve, reject) => {
      openOrCreateDB.onerror = () => reject(openOrCreateDB.error);

      openOrCreateDB.onsuccess = () => resolve(openOrCreateDB.result);

      openOrCreateDB.onupgradeneeded = (init) => {
        const { error, result: db } = init.target;

        db.onerror = () => reject(error);

        db.createObjectStore(todoListTableName, { keyPath: indexBy });

        resolve(db);
      };
    });

    window.database = database;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllTodoDB = () => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("todo_list_tb", "readonly");
    const objectStore = transaction.objectStore("todo_list_tb");

    const request = objectStore.getAll();

    request.onsuccess = (response) => resolve(response.target.result);

    request.onerror = (response) => reject(response.target.error);
  });
};

const addTodoDB = (todo, { onSuccess, onError }) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("todo_list_tb", "readwrite");
    const objectStore = transaction.objectStore("todo_list_tb");

    const request = objectStore.put(todo);

    request.onsuccess = (response) => {
      resolve(response.target.result);
      onSuccess?.();
    };

    request.onerror = (response) => {
      reject(response.target.error);
      onError?.();
    };
  });
};

const deleteTodoDB = (todoId, { onSuccess, onError }) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("todo_list_tb", "readwrite");
    const objectStore = transaction.objectStore("todo_list_tb");

    const request = objectStore.delete(todoId);

    request.onsuccess = (response) => {
      resolve(response.target.result);
      onSuccess?.();
    };

    request.onerror = (response) => {
      reject(response.target.error);
      onError?.();
    };
  });
};

const updateTodoDB = (todoId, newTodo, { onSuccess, onError }) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("todo_list_tb", "readwrite");
    const objectStore = transaction.objectStore("todo_list_tb");

    const getRequest = objectStore.get(todoId);

    getRequest.onsuccess = (getResponse) => {
      const { result: todo } = getResponse.target;

      if (todo) {
        for (const key in todo) {
          if (newTodo.hasOwnProperty(key)) todo[key] = newTodo[key];
        }

        const request = objectStore.put(todo);

        request.onsuccess = (response) => {
          resolve(response.target.result);
          onSuccess?.();
        };

        request.onerror = (response) => {
          reject(response.target.error);
          onError?.();
        };
      } else {
        console.error("Record not found!");
      }
    };

    getRequest.onerror = (getResponse) => {
      console.error("Error retrieving record:", getResponse.target.error);
    };
  });
};

export { addTodoDB, updateTodoDB, deleteTodoDB, getAllTodoDB, initIndexedDB };
