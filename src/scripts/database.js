/**
 * @typedef DatabaseProps
 * @prop {string} name
 * @prop {number} [version]
 */

/**
 * @typedef TrxOptionProps
 * @prop {Function} onSuccess
 * @prop {Function} onError
 */

/**
 * Creates a new database
 * @class
 * @property {string} name
 * @property {number} version
 * @property {object} instance
 * @example
 * const database = new Database({ name: 'example', version: 1 })
 */
class Database {
  name;
  version;
  instance;

  /**
   * @constructor
   * @param {DatabaseProps} */
  constructor({ name, version }) {
    this.name = name;
    this.version = version;
  }

  /** Initial a new database */
  async init() {
    const databases = await indexedDB.databases();

    const existDB = databases.find((db) => db.name === this.name);

    this.version = existDB?.version || 1;

    await this.create();
  }

  /** Creates a new database */
  async create() {
    try {
      const createDB = indexedDB.open(this.name, this.version);

      this.instance = await new Promise((resolve, reject) => {
        createDB.onerror = () => reject(createDB.error);

        createDB.onsuccess = () => resolve(createDB.result);

        createDB.onupgradeneeded = (init) => {
          const { errorCode, result: db } = init.target;

          db.onerror = () => reject(errorCode);

          resolve(db);
        };
      });
    } catch (error) {
      console.error("Error: >>", error);
    }
  }

  /**
   * Creates a new table
   * @param {string} name
   * @param {string} indexBy
   */
  async table({ name, indexBy }) {
    try {
      const isExistTable = this.instance.objectStoreNames.contains(name);

      if (isExistTable) return;

      this.instance.close();

      const newVersion = this.version + 1;

      const request = indexedDB.open(this.name, newVersion);

      this.instance = await new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);

        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const { error, result: db } = event.target;

          db.onerror = () => reject(error);

          db.createObjectStore(name, { keyPath: indexBy });

          resolve(db);
        };
      });

      this.version = newVersion;
    } catch (error) {
      console.error("Error: >>", error);
    }
  }

  /**
   * Get all table data
   * @param {string} tableName
   * @returns {Array<object>}
   */
  async getAll(tableName) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.instance.transaction(tableName, "readonly");

        const objectStore = transaction.objectStore(tableName);

        const request = objectStore.getAll();

        request.onsuccess = (response) => resolve(response.target.result);

        request.onerror = (response) => reject(response.target.error);
      });
    } catch (error) {
      console.error("Error: >>", error);
    }
  }

  /**
   * Add new table record
   * @param {object} data
   * @param {string} tableName
   * @param {TrxOptionProps}
   */
  async add(data, tableName, { onSuccess, onError }) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.instance.transaction(tableName, "readwrite");
        const objectStore = transaction.objectStore(tableName);

        const request = objectStore.put(data);

        request.onsuccess = (response) => {
          resolve(response.target.result);
          onSuccess?.();
        };

        request.onerror = (response) => {
          reject(response.target.error);
          onError?.();
        };
      });
    } catch (error) {
      console.error("Error: >>", error);
    }
  }

  /**
   * Delete table record
   * @param {string} index
   * @param {string} tableName
   * @param {TrxOptionProps}
   */
  async delete(index, tableName, { onSuccess, onError }) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.instance.transaction(tableName, "readwrite");
        const objectStore = transaction.objectStore(tableName);

        const request = objectStore.delete(index);

        request.onsuccess = (response) => {
          resolve(response.target.result);
          onSuccess?.();
        };

        request.onerror = (response) => {
          reject(response.target.error);
          onError?.();
        };
      });
    } catch (error) {
      console.error("Error: >>", error);
    }
  }

  /**
   * Update table record
   * @param {string} index
   * @param {object} newData
   * @param {string} tableName
   * @param {TrxOptionProps}
   */
  async update(index, newData, tableName, { onSuccess, onError }) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.instance.transaction(tableName, "readwrite");
        const objectStore = transaction.objectStore(tableName);

        const getRequest = objectStore.get(index);

        getRequest.onsuccess = (getResponse) => {
          const { result: data } = getResponse.target;

          if (data) {
            for (const key in data) {
              if (newData.hasOwnProperty(key)) data[key] = newData[key];
            }

            const request = objectStore.put(data);

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
    } catch (error) {
      console.error("Error: >>", error);
    }
  }
}

export { Database };
