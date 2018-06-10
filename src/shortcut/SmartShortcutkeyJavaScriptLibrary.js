import LocalStorageHandler from './LocalStorageHandler';
import Modal from './Modal';
import IEFileDownLoader from './IEFileDownLoader';
import DeviceHelper from './DeviceHelper';

const supportedCreateNewShortcutKeyCode = ['altKey', 'ctrlKey', 'shiftKey'];
const firstLevelKeys = ["keyCode", "letter", "actionName", "element"];
const elementLevelKeys = ["id", "className", "label", "tagName"];

(function (window) {
    function SmartShortcutkeyJavaScriptLibrary() {
        let ssjs = {};
        const styles = '.fin-content {padding: 4px;}  #ShorcutKeyMapWindow {visibility: hidden;min-width: 250px;width: 400px;color: #4a4a4a;text-align: center;padding: 10px;position: fixed;z-index: 9997;right: 4px;bottom: 2px;font-size: 14px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: flex;flex-direction: column;border: 1px solid rgba(0,0,0,.2);border-radius: .3rem;}  .close {background: red;color: #fff;padding: 4px;justify-content: center;align-items: center;font-weight: bold;}  #ShorcutKeyMapWindow.show {visibility: visible;animation: fadein 0.5s;}  #ShorcutKeyMapWindow.hide {visibility: hidden;animation: fadeout 0.5s 2.5s;}  @keyframes fadein { from {bottom: 0;opacity: 0;} to {bottom: 30px;opacity: 1;} }  @keyframes fadeout { from {bottom: 30px;opacity: 1;} to {bottom: 0;opacity: 0;} }  .fin-overlay {position: fixed;z-index: 9998;top: 0;left: 0;opacity: 0;width: 100%;height: 100%;transition: 1ms opacity ease;background: rgba(10,10,10,.86);}  .fin-modal {position: absolute;z-index: 9999;top: 50%;left: 50%;opacity: 0;transition: 1ms opacity ease;transform: translate(-50%, -50%);color: #4a4a4a;background-color: #fff;box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);padding: 1rem;}  .close-win {cursor: pointer;font-size: 20px;text-decoration: none;}  /* Default Animation */  .fin-overlay.fade-and-drop {display: block;opacity: 0;}  .fin-modal.fade-and-drop {top: -300%;opacity: 1;display: block;}  .fin-modal.fade-and-drop.fin-open {top: 50%;transition: 500ms top 500ms ease;}  .fin-modal.fade-and-drop.fin-open.fin-anchored {transition: 500ms top 500ms ease;}  .fin-overlay.fade-and-drop.fin-open {top: 0;transition: 500ms opacity ease;opacity: 1;}  .fin-modal.fade-and-drop {transition: 500ms top ease;}  .fin-overlay.fade-and-drop {transition: 500ms opacity 500ms ease;}  .fin-modal .button {background-color: #4CAF50;color: white;padding: 14px 20px;margin: 8px 0;border: none;cursor: pointer;width: 100%;}  .button {background-color: #4CAF50;color: white;padding: 14px 20px;margin: 8px 0;border: none;cursor: pointer;}  .fin-modal .button:hover {background-color: #70B3FF;border-color: #70B3FF;}  .input {width: 100%;padding: 12px 20px;margin: 8px 0;display: inline-block;border: 1px solid #ccc;box-sizing: border-box;}  table {border-spacing: 0;width: 100%}  td,th {border-bottom: 0.1rem solid #e1e1e1;padding: 0.5rem 1rem;text-align: left}  td:first-child,th:first-child {padding-left: 0}  td:last-child,th:last-child {padding-right: 0}  .custom-file-upload {border: 1px solid #ccc;display: inline-block;padding: 6px 12px;cursor: pointer;}\n';
        let modal = null;
        let targetBtn = null;
        let enableShortcuts = true;
        let cachedPresetKeys = [];

        let defaultOptions = {
            openShortcutPopupKeyCode: 16,
            createNewShortcutKeyCode: 'altKey',
            triggerShortcutKeyCode: 'ctrlKey',
            applicationDefinedKeys: {}
        };


        let config = Object.assign({}, defaultOptions, {});

        LocalStorageHandler.createDB(config.applicationDefinedKeys);
        onloadAttachListener();

        function addNewKey(event) {
            for (let c=0; c < cachedPresetKeys.length; c++) {
                let record = cachedPresetKeys[c];
                if (enableShortcuts && event[config.triggerShortcutKeyCode]) {
                    if (record.keyCode === event.which) {
                        const id = record.element.id;
                        const className = record.element.className;
                        const label = record.element.label;

                        if (id !== '') {
                            let elems = null;
                            try {
                                elems = document.querySelectorAll("#" + id);
                            } catch (error) {
                                console.log("Element not found", error)
                            }

                            if (elems && elems.length === 1) {
                                elems[0].click();
                            } else {
                                console.error("Non or Too many element found ");
                                if (className !== '') {
                                    const elems = document.querySelectorAll("." + className.replace(/[ ,]+/g, ","));
                                    for(let i=0; i< elems.length; i++){
                                    let elem = elems[i];
                                        if (elem && elem.textContent.trim() === label) {
                                            elem.click();
                                        }
                                    }
                                }
                            }
                        }
                        else if (className !== '') {
                            const elems = document.querySelectorAll("." + className.replace(/[ ,]+/g, ","));
                            for(let i=0; i< elems.length; i++){
                                let elem = elems[i];
                                if (elem && elem.textContent.trim() === label) {
                                    elem.click();
                                }
                            }
                        } else if (label) {
                            let elems = document.getElementsByTagName(record.element.tagName);
                            for(let i=0; i< elems.length; i++){
                                let elm =elems[i];
                                if (elm.textContent === label) {
                                    elm.click();
                                    break;
                                }
                            }
                        }

                    }
                }
            }
        }

        function onloadAttachListener() {
            cachedPresetKeys = LocalStorageHandler.getAll();
            createShowKeyMap();
            document.addEventListener('keyup', addNewKey);

        }

        function addTargetElement(key, label, targetBtn, prompt) {
            prompt.cloneNode(true);
            let code = getKeyCode(key);

            let isKeyAlreadyExists = getExisitngKEyByCode(code);
            let isNewKey = true;
            const finalLabel = label ? label : targetBtn.textContent;
            if (isKeyAlreadyExists.length > 0) {

                const paragraph4 = document.createElement('p');
                const textnode4 = document.createTextNode('Shortcut key already exists! \n Do you want to replace the existing key ?');
                paragraph4.appendChild(textnode4);

                const button2 = document.createElement('button');
                button2.className = 'button';
                const t2 = document.createTextNode("Replace");       // Create a text node
                button2.appendChild(t2);

                let button3 = document.createElement('button');
                button3.className = 'button';
                let t3 = document.createTextNode("Cancel");       // Create a text node
                button3.appendChild(t3);

                button2.addEventListener('click', function () {
                    isNewKey = false;
                    for(let i=0; i<cachedPresetKeys.length; i++){
                        let record = cachedPresetKeys[i];
                        if (record.element.label === targetBtn.textContent.trim() && record.element.className === targetBtn.className) {
                            LocalStorageHandler.deleteById({
                                data: parseInt(record.keyCode)});
                        }
                    }
                    saveNewKey(code, key, finalLabel, targetBtn, prompt);
                });

                button3.addEventListener('click', function () {
                    modal.close();
                    buildPrompt(targetBtn)
                });

                prompt.innerHTML = '';
                prompt.appendChild(paragraph4);
                prompt.appendChild(button2);
                prompt.appendChild(button3);

            } else {

                const keyAlreadyExist = isKeyAlreadyDefineFor(targetBtn);
                for(let i=0; i<keyAlreadyExist.length; i++){
                    let record = keyAlreadyExist[i];
                    LocalStorageHandler.deleteById(record.code)
                }
                saveNewKey(code, key, finalLabel, targetBtn, prompt);
            }

        }

        function saveNewKey(code, key, finalLabel, targetBtn, prompt) {
            const data = {
                keyCode: code,
                letter: key,
                actionName: finalLabel,
                element: {
                    id: targetBtn.id,
                    className: targetBtn.className,
                    label: targetBtn.textContent.trim(),
                    tagName: targetBtn.tagName,
                    type: targetBtn.type
                },
            };
            LocalStorageHandler.save(data);
            buildEndMessage(prompt, 'Shortcut Key Created successfully !');
            onloadAttachListener();
        }

        function buildEndMessage(prompt, message) {
            let paragraph3 = document.createElement('p');
            let success = document.createTextNode(message);
            paragraph3.appendChild(success);

            let okButton = document.createElement('button');
            okButton.className = 'button';
            let okButtonText = document.createTextNode("Done");
            okButton.addEventListener('click', function () {
                modal.close();
            });
            okButton.appendChild(okButtonText);
            prompt.innerHTML = '';
            prompt.appendChild(paragraph3);
            prompt.appendChild(okButton);
        }

        let buildPrompt = function (targetBtn) {

            let prompt = document.createElement('div');
            let headingTag = document.createElement('h2');

            prompt.appendChild(headingTag);
            let paragraph1 = document.createElement('label');
            let textnode1 = document.createTextNode(' Name: ');
            paragraph1.appendChild(textnode1);

            let paragraph2 = document.createElement('label');
            let textnode2 = document.createTextNode(' Key: ');
            paragraph2.appendChild(textnode2);

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.className = "input";
            input1.title = "Enter the name / label for this shortcut";
            input1.value = targetBtn.textContent;
            input1.setAttribute('id', 'fin-input-label');

            let input2 = document.createElement("input");
            input2.type = "text";
            input2.className = "input";
            input2.title = "Assign a key for this shortcut";
            input2.maxLength = 1;
            input2.setAttribute('id', 'fin-input-key');

            let button = document.createElement('button');
            button.className = 'button';
            let t = document.createTextNode("Save");       // Create a text node
            button.appendChild(t);

            button.addEventListener('click', function () {
                let key = document.getElementById('fin-input-key').value;
                let label = document.getElementById('fin-input-label').value;
                addTargetElement(key, label.trim(), targetBtn, prompt);
            });

            prompt.appendChild(paragraph1);
            prompt.appendChild(input1);
            prompt.appendChild(paragraph2);
            prompt.appendChild(input2);
            prompt.appendChild(button);
            modal = new Modal({
                content: prompt
            });
            modal.open(buildModal);
            setTimeout(function () {
                document.getElementById("fin-input-key").focus();
            }, 0);
        };

        // Build the model using the provided content
        let buildModal = function () {

            let content, contentHolder, docFrag;

            content = this.options.content;

            docFrag = document.createDocumentFragment();

            this.modal = document.createElement("div");
            this.modal.className = "fin-modal " + this.options.className;
            this.modal.style.minWidth = this.options.minWidth + "px";
            this.modal.style.maxWidth = this.options.maxWidth + "px";

            if (this.options.closeButton === true) {
                this.closeButton = document.createElement("a");
                this.closeButton.className = "close-win";
                this.closeButton.style.right = "17px";
                this.closeButton.style.position = "absolute";
                this.closeButton.innerHTML = "&#10062;";
                this.modal.appendChild(this.closeButton);

            }

            if (this.options.overlay === true) {
                this.overlay = document.createElement("div");
                this.overlay.className = "fin-overlay " + this.options.className;
                docFrag.appendChild(this.overlay);
            }

            contentHolder = document.createElement("div");
            contentHolder.className = "fin-content";
            contentHolder.appendChild(content);
            this.modal.appendChild(contentHolder);

            docFrag.appendChild(this.modal);

            document.body.appendChild(docFrag);

        };

        function configureShortcutKey(event) {

            if (event[config.createNewShortcutKeyCode]) {
                event.stopPropagation();
                event.preventDefault();
                targetBtn = event.target;
                buildPrompt(targetBtn);
            }
        }

        // add styles to the page
        function appendStyle(styles) {
            let css = document.createElement('style');
            css.type = 'text/css';
            css.appendChild(document.createTextNode(styles));
            document.getElementsByTagName("body")[0].appendChild(css);
        }

        document.addEventListener("DOMContentLoaded", function () {
            !config.styles && appendStyle(styles);
            createShowKeyMap();
            document.addEventListener("click", configureShortcutKey, true);
            document.addEventListener("keydown", showKeyMap, true);
            document.addEventListener("keyup", keyUp, true);

        }, false);

        function createShowKeyMap() {

            let ShorcutKeyMapWindow = document.getElementById("ShorcutKeyMapWindow");
            if (!ShorcutKeyMapWindow) {
                ShorcutKeyMapWindow = document.createElement('div');
                ShorcutKeyMapWindow.id = "ShorcutKeyMapWindow";
                document.body.appendChild(ShorcutKeyMapWindow);
            } else {
                ShorcutKeyMapWindow.innerHTML = '';
            }

            let rows = '';
            for(let i=0; i<cachedPresetKeys.length; i++) {
                let key = cachedPresetKeys[i];
                rows = rows + '<tr>'
                    + '<td> ' + key.actionName + '</td>'
                    + '<td>' + config.triggerShortcutKeyCode + ' + ' + key.letter + '</td>'
                    + '<td style="text-align: right"><a style="cursor: pointer; font-size: 14px;" id="deleteShortcutKey_' + key.keyCode + '" title="Delete shortcut key">&#10060;</a></td>'
                    + '</tr>';
            }
            ShorcutKeyMapWindow.innerHTML = '' +
                '<div style="display: flex">' +
                '<div id="newKeyMessage" style="flex: 1; text-align: left">' + getDefaultMessage() + '</div>' +
                '&nbsp;<a class="close-win" href="#" id="closeKeyMap" title="Close keymap settings">&#10062;</a></div>' +
                '<table>' +
                '<thead><tr>' +
                '<th style="text-align: left">Actions</th>' +
                '<th style="text-align: left">Shortcuts</th><th>&nbsp;</th></tr></thead>' +

                rows + '<tr><td>Disable shortcuts <input type="checkbox" id="disableShortcuts"/></td><td colspan="2" style="text-align: right"><label class="custom-file-upload" id="exportShotcutKeys"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB9SURBVDhPY4CBkmlH/pOCodoQACR46MV/ovDAGzBt1z3yDdh04yuYhmpDAGINCG/a/X/FhffkG+BXtfV/UN2O/76VW4KgWiEA3QCQQnzYt3LrX7/KrflQ7TQwABcGaSbKC7gwxYFIcTSCMEUJCYRBaqHaEIAqBpCCIboYGAChhos9udbvkgAAAABJRU5ErkJggg==">&nbsp;Export</label>' +
                '&nbsp;<label class="custom-file-upload"><input style="display: none" type="file" id="importShortCutKeys"/><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABLSURBVDhPY8AH/Kq2/gdhKJd0MGrAQBngW7m1AaYRHYPkoMrwA2yGEK0ZBpANIVkzDIA0kq2ZfgA5oMjBYAO6t38gC8MNIB9v/Q8AxxzRl6+r/DQAAAAASUVORK5CYII=">&nbsp;Import</label></div></td></tr></table>';


          /*  '</div>' + rows + '</div>';*/

            document.getElementById("closeKeyMap").addEventListener('click', closeKeyMap);
            document.getElementById("disableShortcuts").addEventListener('click', disableShortcuts);
            document.getElementById("exportShotcutKeys").addEventListener('click', exportShotcutKeys);
            document.getElementById("importShortCutKeys").addEventListener('change', importShortcutKey);

            let shortcutKeyElms = document.querySelectorAll("[id^='deleteShortcutKey_']");
            for(let i=0; i<shortcutKeyElms.length; i++){
                let elm = shortcutKeyElms[i];
                elm.addEventListener('click', deleteShortcutKey);
            }
        }
        function deleteShortcutKey(event) {
            const code = event.target.id.substr(event.target.id.indexOf('_') + 1, event.target.id.length);
            LocalStorageHandler.deleteById(parseInt(code));
            onloadAttachListener();
        }

        let shiftKeyDownTimer = null;

        function keyUp(event) {
            if (event.keyCode === config.openShortcutPopupKeyCode) {
                shiftKeyDownTimer && clearTimeout(shiftKeyDownTimer);
            }
        }

        function closeKeyMap() {
            let x = document.getElementById("ShorcutKeyMapWindow");
            x.className = "hide";
        }

        function showKeyMap(event) {

            if (event.keyCode === config.openShortcutPopupKeyCode) {
                shiftKeyDownTimer = setTimeout(() => {
                    createShowKeyMap('');
                    let x = document.getElementById("ShorcutKeyMapWindow");
                    x.className = "show";
                }, 2000)
            }

        }

        function getKeyCode(letter) {
            let code = letter.toUpperCase().charCodeAt(0);
            return code;
        }

        function getExisitngKEyByCode(code) {
            return cachedPresetKeys.filter((key) => key.keyCode === code);
        }

        function isKeyAlreadyDefineFor(elem) {
            return cachedPresetKeys.filter((key) => {
                (key.id === elem.id) || (key.element.label === key.label && key.element.className === elem.className);
            });
        }

        ssjs.setConfig = (options) => {
            config = Object.assign({}, defaultOptions, options);
            if (config.createNewShortcutKeyCode && supportedCreateNewShortcutKeyCode.indexOf(config.createNewShortcutKeyCode) < 0) {
                throw Error(config.createNewShortcutKeyCode + ' is Not supported, Only supported createNewShortcutKeyCode are ' + supportedCreateNewShortcutKeyCode.toString());
            }

            if (config.triggerShortcutKeyCode && supportedCreateNewShortcutKeyCode.indexOf(config.triggerShortcutKeyCode) < 0) {
                throw Error(config.triggerShortcutKeyCode + ' is not supported, Only supported triggerShortcutKeyCode are ' + supportedCreateNewShortcutKeyCode.toString());
            }

            if(config.applicationDefinedKeys) {

                if(!Array.isArray(config.applicationDefinedKeys))
                    throw Error("applicationDefinedKeys should be an array");
                    for (let i = 0; i < config.applicationDefinedKeys.length; i++) {
                        validateAppKeys(config, i);
                        LocalStorageHandler.save(config.applicationDefinedKeys[i]);
                    }
                    onloadAttachListener();
            }
        };

        function validateAppKeys(config, i) {
            const key = config.applicationDefinedKeys[i];
            let valid = isObjectValid(firstLevelKeys, Object.keys(key));
            if (!valid) {
                throw Error("applicationDefinedKeys invalid format");
            }

            if (key.element) {
                let valid = isObjectValid(elementLevelKeys, Object.keys(key.element));
                if (!valid) {
                    throw Error("applicationDefinedKeys invalid format");
                }
            }
        }

        function isObjectValid(source, applicationDefinedKey) {

            let valid = true;
            for (let i=0; i< source.length; i++){
                valid = applicationDefinedKey.indexOf(source[i]) >= 0 ;
                 if(!valid){
                     return false;
                 }
            }

            return valid;
        }

        function importShortcutKey() {
            let fileInput = document.getElementById("importShortCutKeys");
            let file = fileInput.files[0];
            let textType = /text.*/;
            if (file.type.match(textType)) {
                let reader = new FileReader();

                reader.onload = function () {
                    try {
                        let imortedKeys = JSON.parse(reader.result);
                        for(let i=0; i<imortedKeys.length; i++){
                            let key = imortedKeys[i];
                           const keyAlreadyExists = LocalStorageHandler.getById(key.keyCode);
                            if (!keyAlreadyExists) {
                                const data = {
                                    keyCode: key.keyCode,
                                    letter: key.letter,
                                    actionName: key.element.label,
                                    element: {
                                        id: key.element.id,
                                        className: key.element.className,
                                        label: key.element.label,
                                        tagName: key.element.tagName,
                                        type: key.element.type
                                    },
                                };
                                LocalStorageHandler.save(data);
                                onloadAttachListener();
                            }else{
                                document.getElementById('newKeyMessage').innerHTML = '&#9940;Key Already exists ';
                                document.getElementById('newKeyMessage').style.color = '#ff0000';
                                console.error("Key Already exists", result)
                            }
                        }
                    } catch (e) {
                        document.getElementById('newKeyMessage').innerHTML = '&#9940; Invalid format ';
                        document.getElementById('newKeyMessage').style.color = '#ff0000';
                        console.error('Invalid format', e);
                    }


                };

                reader.onerror = function (e) {
                    console.log('error loading', e);
                };

                reader.onloadend = function (e) {
                    console.log('onloadend', e);
                };

                reader.onabort = function (e) {
                    console.log('onabort', e);
                };
                reader.readAsText(file);
            } else {
                console.log("File not supported!");
            }
        }

        function exportShotcutKeys() {
            cachedPresetKeys = LocalStorageHandler.getAll();
            let keys = "";
            for (let i = 0; i < cachedPresetKeys.length; i++) {
                let key = cachedPresetKeys[i];
                keys += JSON.stringify(key);
                if (i < (cachedPresetKeys.length - 1)) {
                    keys += ",";
                }
            }


            if(DeviceHelper.isMicrosoftBrowser()){
                IEFileDownLoader.saveFile(keys);
            }else {

                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('[' + keys + ']'));
                element.setAttribute('download', 'shortcutkeys');

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }

        }

        function getDefaultMessage() {
            return "Press <strong>" + config.createNewShortcutKeyCode + "</strong> and click the element to define the shortcut key";
        }

        return ssjs;
    }

    if (typeof(window.ssjs) === 'undefined') {
        window.ssjs = SmartShortcutkeyJavaScriptLibrary();
    }
})(window);

if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}
