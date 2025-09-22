/**
 * IndexedDbRepository
 */
export default class IndexedDbRepository {
    /**
     * Creates an instance of IndexedDbRepository.
     *
     * @param {string} storeName - The name of the object store in the IndexedDB database.
     */
    constructor(storeName) {
        this.dbName = "prepaidplus";
        this.storeName = storeName;
    }

    /**
     * Opens a connection to the IndexedDB database.
     *
     * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
     * @throws {Error} Throws an error if the database cannot be opened or upgraded.
     */
    async openDatabase() {
        return new Promise((resolve, reject) => {
            /**
             * Handles the initial request to open the IndexedDB database.
             *
             * @type {IDBOpenDBRequest}
             */
            let request = indexedDB.open(this.dbName);

            /**
             * Event handler for the `onupgradeneeded` event, which is triggered when the database
             * is first created or its version is upgraded.
             *
             * @param {IDBVersionChangeEvent} event - The event object containing the database instance.
             */
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id" });
                }
            };

            /**
             * Event handler for the `onsuccess` event, which is triggered when the database is successfully opened.
             *
             * @param {Event} event - The event object containing the database instance.
             */
            request.onsuccess = (event) => {
                const db = event.target.result;

                // Check if the store exists, if not, force an upgrade
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.close();
                    const newVersion = db.version + 1;

                    /**
                     * Handles the request to upgrade the database to a new version.
                     *
                     * @type {IDBOpenDBRequest}
                     */
                    let upgradeRequest = indexedDB.open(
                        this.dbName,
                        newVersion
                    );

                    /**
                     * Event handler for the `onupgradeneeded` event during the upgrade process.
                     *
                     * @param {IDBVersionChangeEvent} upgradeEvent - The event object containing the upgraded database instance.
                     */
                    upgradeRequest.onupgradeneeded = (upgradeEvent) => {
                        const upgradeDb = upgradeEvent.target.result;
                        if (
                            !upgradeDb.objectStoreNames.contains(this.storeName)
                        ) {
                            upgradeDb.createObjectStore(this.storeName, {
                                keyPath: "id",
                            });
                        }
                    };

                    /**
                     * Event handler for the `onsuccess` event during the upgrade process.
                     *
                     * @param {Event} upgradeEvent - The event object containing the upgraded database instance.
                     */
                    upgradeRequest.onsuccess = (upgradeEvent) => {
                        resolve(upgradeEvent.target.result);
                    };

                    /**
                     * Event handler for the `onerror` event during the upgrade process.
                     *
                     * @param {Event} upgradeEvent - The event object containing the error details.
                     */
                    upgradeRequest.onerror = (upgradeEvent) => {
                        reject(
                            `Error upgrading database: ${upgradeEvent.target.errorCode}`
                        );
                    };
                } else {
                    resolve(db);
                }
            };

            /**
             * Event handler for the `onerror` event, which is triggered if the database fails to open.
             *
             * @param {Event} event - The event object containing the error details.
             */
            request.onerror = (event) => {
                reject(`Error opening database: ${event.target.errorCode}`);
            };
        });
    }

    /**
     * Retrieves data from IndexedDB by ID.
     *
     * @param {string} id - The ID of the record to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves with the retrieved data object or null if no data is found.
     * @throws {Error} Throws an error if the retrieval operation fails.
     */
    async getDataById(id) {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);

            /**
             * Handles the request to retrieve data by ID.
             *
             * @type {IDBRequest}
             */
            const request = store.get(id);

            /**
             * Event handler for the `onsuccess` event, which is triggered when the data is successfully retrieved.
             *
             * @param {Event} event - The event object containing the retrieved data.
             */
            request.onsuccess = (event) => {
                const result = event.target.result;

                if (result) {
                    resolve(result.data); // Assuming 'data' is the stored object in the record
                } else {
                    resolve(null);
                }
            };

            /**
             * Event handler for the `onerror` event, which is triggered if the retrieval operation fails.
             *
             * @param {Event} event - The event object containing the error details.
             */
            request.onerror = (event) => {
                reject(`Error retrieving data: ${event.target.errorCode}`);
            };
        });
    }

    /**
     * Saves or updates data in IndexedDB by ID.
     *
     * @param {string} id - The ID under which to save the data.
     * @param {Object} data - The data to be saved.
     * @returns {Promise<void>} A promise that resolves when the data is successfully saved.
     * @throws {Error} Throws an error if the save operation fails.
     */
    async setDataById(id, data) {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);

            /**
             * Handles the request to save or update data by ID.
             *
             * @type {IDBRequest}
             */
            const request = store.put({ id, data });

            /**
             * Event handler for the `onsuccess` event, which is triggered when the data is successfully saved.
             */
            request.onsuccess = () => {
                resolve();
            };

            /**
             * Event handler for the `onerror` event, which is triggered if the save operation fails.
             *
             * @param {Event} event - The event object containing the error details.
             */
            request.onerror = (event) => {
                reject(`Error saving data: ${event.target.errorCode}`);
            };
        });
    }

    /**
     * Removes data from IndexedDB by ID.
     *
     * @param {string} id - The ID of the record to remove.
     * @returns {Promise<void>} A promise that resolves when the data is successfully removed.
     * @throws {Error} Throws an error if the removal operation fails.
     */
    async removeDataById(id) {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);

            /**
             * Handles the request to remove data by ID.
             *
             * @type {IDBRequest}
             */
            const request = store.delete(id);

            /**
             * Event handler for the `onsuccess` event, which is triggered when the data is successfully removed.
             */
            request.onsuccess = () => {
                resolve();
            };

            /**
             * Event handler for the `onerror` event, which is triggered if the removal operation fails.
             *
             * @param {Event} event - The event object containing the error details.
             */
            request.onerror = (event) => {
                reject(`Error removing data: ${event.target.errorCode}`);
            };
        });
    }

    /**
     * Retrieves the latest record from the object store.
     *
     * @returns {Promise<Object|null>} A promise that resolves with the latest record or null if no records exist.
     * @throws {Error} Throws an error if the retrieval operation fails.
     */
    async getLatestRecord() {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);

            /**
             * Handles the request to open a cursor to the last record in the object store.
             *
             * @type {IDBRequest}
             */
            const request = store.openCursor(null, "prev");

            /**
             * Event handler for the `onsuccess` event, which is triggered when the cursor is successfully opened.
             *
             * @param {Event} event - The event object containing the cursor instance.
             */
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resolve(cursor.value);
                } else {
                    resolve(null);
                }
            };

            /**
             * Event handler for the `onerror` event, which is triggered if the cursor operation fails.
             *
             * @param {Event} event - The event object containing the error details.
             */
            request.onerror = (event) => {
                reject(
                    `Error retrieving latest record: ${event.target.errorCode}`
                );
            };
        });
    }

    /**
     * Retrieves the latest record that has a specific field with a particular value.
     *
     * @param {string} field - The field name to check in each record.
     * @param {*} value - The value to match against the field.
     * @returns {Promise<Object|null>} A promise that resolves with the matching record or null if no match is found.
     * @throws {Error} Throws an error if the operation fails.
     */
    async getLatestRecordByField(field, value) {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);

            /**
             * Handles the request to open a cursor to iterate through records in reverse order.
             *
             * @type {IDBRequest}
             */
            const request = store.openCursor(null, "prev");

            /**
             * Event handler for the `onsuccess` event, which is triggered for each cursor position.
             *
             * @param {Event} event - The event object containing the cursor instance.
             */
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const record = cursor.value;
                    // Check if the record has the field and the value matches
                    if (record.data && record.data[field] === value) {
                        resolve(record);
                    } else {
                        // Move to the previous record
                        cursor.continue();
                    }
                } else {
                    // No more records or no matching record found
                    resolve(null);
                }
            };

            /**
             * Event handler for the `onerror` event, which is triggered if the cursor operation fails.
             *
             * @param {Event} event - The event object containing the error details.
             */
            request.onerror = (event) => {
                reject(
                    `Error finding record by field: ${event.target.errorCode}`
                );
            };
        });
    }

    /**
     * Retrieves records that match multiple field criteria, with optional date range filtering and limit on results.
     *
     * @param {Object} criteria - An object with field-value pairs to match
     * @param {number} [limit=0] - Maximum number of records to return (0 for all)
     * @param {Object} [range] - Optional date range criteria
     * @param {Object} range.fieldName - The date field to filter on
     * @param {string} range.fieldName.start - ISO string of start date (inclusive)
     * @param {string} range.fieldName.end - ISO string of end date (inclusive)
     * @returns {Promise<Array>} A promise that resolves with matching records (empty array if none found)
     * @throws {Error} Throws an error if the operation fails
     */
    async getRecordsByFields(criteria, limit = 0) {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const results = [];
            let count = 0;

            // Extract range criteria if present
            const rangeCriteria = criteria.range;
            delete criteria.range; // Remove range from regular criteria

            const request = store.openCursor(null, "prev");

            /**
             *
             * @param {*} event
             * @returns
             */
            request.onsuccess = (event) => {
                const cursor = event.target.result;

                // Stop if we've reached the limit (when limit > 0)
                if (limit > 0 && count >= limit) {
                    resolve(results);
                    return;
                }

                if (cursor) {
                    const record = cursor.value;
                    let match = true;

                    // Check all regular criteria fields
                    for (const [field, value] of Object.entries(criteria)) {
                        if (record.data?.[field] !== value) {
                            match = false;
                            break;
                        }
                    }

                    // Check date range criteria if present and record matches other criteria
                    if (match && rangeCriteria) {
                        for (const [fieldName, range] of Object.entries(
                            rangeCriteria
                        )) {
                            const dateValue = new Date(
                                record.data?.[fieldName]
                            ).getTime();
                            const startDate = new Date(
                                new Date(range.start).toISOString()
                            ).getTime();
                            const endDate = new Date(
                                new Date(range.end).toISOString()
                            ).getTime();
                            if (dateValue < startDate || dateValue > endDate) {
                                match = false;
                                break;
                            }
                        }
                    }

                    if (match) {
                        results.push(record);
                        count++;
                    }

                    cursor.continue();
                } else {
                    // No more records
                    resolve(results);
                }
            };

            /**
             *
             * @param {*} event
             * @returns
             */
            request.onerror = (event) => {
                reject(`Error querying records: ${event.target.error}`);
            };
        });
    }

    /**
     * Clears transactions older than the specified number of months from the IndexedDB store.
     *
     * This method iterates through all records in the store, checks their transaction date against
     * the calculated cutoff date (current date minus specified months), and deletes records that
     * are older than the cutoff. The operation is performed in a single transaction for atomicity.
     *
     * @param {string} dateField - The name of the field in each record that contains the transaction date.
     *                            This field should contain a value that can be parsed by the Date constructor
     *                            (e.g., ISO 8601 string or timestamp).
     * @param {number} [months=6] - The number of months to use as the retention period. Records older than
     *                             this many months from the current date will be deleted. Defaults to 6 months.
     * @returns {Promise<number>} A promise that resolves with the count of deleted records when the operation
     *                           completes successfully. The promise will reject if any error occurs during
     *                           the operation.
     * @throws {Error} Throws an error if:
     *                 - The database cannot be opened
     *                 - The date field doesn't exist in a record
     *                 - A date value cannot be parsed
     *                 - Any deletion operation fails
     * @example
     * // Delete transactions older than 6 months (default)
     * repository.clearOldTransactions('transactionDateTime')
     *   .then(count => console.log(`Deleted ${count} old transactions`))
     *   .catch(err => console.error('Cleanup failed:', err));
     *
     * @example
     * // Delete transactions older than 12 months
     * repository.clearOldTransactions('createdAt', 12)
     *   .then(count => console.log(`Deleted ${count} records`));
     */
    async removeRecordsByDatefield(dateField, months = 6) {
        const db = await this.openDatabase();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const cutoffDate = new Date();
            cutoffDate.setMonth(cutoffDate.getMonth() - months);

            let deletedCount = 0;

            const request = store.openCursor();

            /**
             *
             * @param {*} event
             * @returns
             */
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const record = cursor.value;
                    const recordDate = new Date(record.data?.[dateField]);

                    if (recordDate && recordDate < cutoffDate) {
                        // Delete and continue in the success handler
                        const deleteRequest = store.delete(record.id);
                        /**
                         *
                         * @param {*} event
                         * @returns
                         */
                        deleteRequest.onsuccess = () => {
                            deletedCount++;
                            cursor.continue();
                        };
                        /**
                         *
                         * @param {*} event
                         * @returns
                         */
                        deleteRequest.onerror = (e) => {
                            reject(
                                `Error deleting record ${record.id}: ${e.target.error}`
                            );
                        };
                    } else {
                        cursor.continue();
                    }
                } else {
                    // All records processed
                    resolve(deletedCount);
                }
            };

            /**
             *
             * @param {*} event
             * @returns
             */
            request.onerror = (event) => {
                reject(`Error iterating records: ${event.target.error}`);
            };
        });
    }
}
