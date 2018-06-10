
const SHORTCUT_KEY_DB = 'ssckdb';

class LocalStorageHandler {

    static getAll () {
        const sckdb = JSON.parse(window.localStorage.getItem(SHORTCUT_KEY_DB));
        let result = [] ;

        Object.keys(sckdb).forEach(function(key) {
            result.push(sckdb[key])
        });
        return result;
    };


    static createDB () {
        const sckdb = window.localStorage.getItem(SHORTCUT_KEY_DB);
        if(!sckdb){
            window.localStorage.setItem(SHORTCUT_KEY_DB, JSON.stringify({}));
        }
    };

    static getById(id) {
        const sckdb = window.localStorage.getItem(SHORTCUT_KEY_DB);
        return JSON.parse(sckdb)[id]
    }

    static deleteById (id){
        const sckdb = JSON.parse(window.localStorage.getItem(SHORTCUT_KEY_DB));
        delete sckdb[id]
        window.localStorage.setItem(SHORTCUT_KEY_DB, JSON.stringify(sckdb));

    };

    static save (data) {
        const sckdb = window.localStorage.getItem(SHORTCUT_KEY_DB);
        let parsedData = Object.assign({},JSON.parse(sckdb), {[data.keyCode]: data});
        window.localStorage.setItem(SHORTCUT_KEY_DB, JSON.stringify(parsedData));
    };
}

export default LocalStorageHandler;