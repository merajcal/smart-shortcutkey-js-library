let keyValue = undefined;
let dbName = 'sckdb';
let storeName = 'sckstore';
let db = {};
let TransactionMode = {RONLY: 'readonly', RW: 'readwrite'};

class IndexDBHandler {

    static getAll (cb) {
        const store = this.getStore();
        store.getAll().onsuccess = function (e) {
            console.log('getAll', e.target.result);
            cb.success && cb.success(e.target.result);
        }
    };

    static getStore() {
        let transaction = db.transaction([storeName], TransactionMode.RW);
        return transaction.objectStore(storeName);
    }

    static createDB (cb) {
        let openRequest = window.indexedDB.open(dbName, 1);
        openRequest.onupgradeneeded = function (e) {
            db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {
                    keyPath: 'code',
                    autoIncrement: false
                });
            }
        };

        openRequest.onsuccess = function (e) {
            db = e.target.result;
            console.log('Indexed db opened!', db);
            cb.success && cb.success();

        };

        openRequest.onerror = function (e) {
            console.log('error while creating DB', e);
            cb.error(e);
        }
    };

    static getById(cb) {
        const store = this.getStore();
        let getDataReq = store.get(cb.data);
        getDataReq.onsuccess = function () {
            cb.success && cb.success(getDataReq.result);
        };
    }

    static deleteById (cb){
        const store = this.getStore();
        const deleteRequest = store.delete(parseInt(cb.data));

        deleteRequest.onsuccess = function () {
            cb.success && cb.success();
        };

        deleteRequest.onerror = function () {
            console.log("Could not delete ", code);
        };
    };

    static save (cb) {
        const store = this.getStore();
        store.put(cb.data, keyValue);
        cb.success && cb.success();
    };
}

export default IndexDBHandler;