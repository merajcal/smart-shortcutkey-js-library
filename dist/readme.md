# Smart ShortcutKey JS Library

A smart generic java script based small library to create shortcut/access key for any web
application. This library also allows user to create their own shortcut key for the web
application based on their convenient key combination.

Let’s first understand what is a shortcut key? A special key combination that causes a
specific command to be executed. Typically, shortcut keys combine the Ctrl or Alt keys with
some other keys. Shortcut key of any application save time and increase productivity. But we
have noticed very few web application/pages allow shortcut key for their users. There may be
many reasons of not providing shortcut key by any web application. It may be due to complexity,
development effort, browser handling etc. Now we understand that shortcut key of any web
application is as important as having shortcut key for any desktop application to increase the
productivity of the users. User really needs shortcut key specially he/she has to perform/interact
with repeated actions in the webapp. Users really hate every time using mouse to click or select
any option of the webpage.
The Webapp Shortcut key library allows any web based application to create shortcut
for the user and also allow users to define/create their own shortcut keys. The key feature of
this library is to allow users to create their own shortcut key for the webapp. Because User
might not be comfortable with predefine shortcut provided by the web application. The user may
not want huge number of predefined shortcut key, but he/she wants few frequent used shortcut
keys.

### Features (Version 1.0.0)

- **Application defined shortcut keys**
- **End User defined shortcut key**
- **Export and Import Shortcut Keys**
- **User define shortcut key works only for the browser for which shortcut keys are created**: To reuse user defined shortcut keys across browser then use Export and Import shortcut key feature.
- **Add/Delete shortcut key**

### Future Features (Version 1.1.0)

- **Shortcut key support for IFrame**: IFrame does not need to have focus to execute the shortcut key.
- **Create Single Shortcut key for Menu Items**
- **Sync Keys with server**

### How it works
When user creates new shortcut key, smart shortcut key library captures the selected elements details like id, label, css class etc. and when user press the cobmination of shortcut key, the library finds the element and fire the event

### Guidelines
This library best work with the element which has unique id(**Recommended**). 
This library also work with css selector.
This library also work if element has unique label.

## Limitations
- **Work for only single level elements.**

    Works for only single level visible elements like button anchor element etc. Single key is not supported for menu item. User has to create multiple shortcut keys for menu item.

- **Webpage must have to focus to execute the shortcut key**
- **Iframe should have have focus to execute the shortcut key**: If shortcut is created for any action which is inside an Iframe then focus should be inside the Iframe.
- **Clearing Cache removes all user defined shortcut keys**: Before clearing browser cache please export the all created shortcut keys otherwise all the user defined shortcut keys will be removed.

### Usage

```<script src="xxx/ssjsl.min.js"></script>```

#### Additional Configurations

|           Key                 |      Value     |                                                   Description                                         |
|-------------------------------|----------------|-------------------------------------------------------------------------------------------------------|
|   triggerShortcutKeyCode      | shiftKey       |    To trigger the action e.g. shiftKey + l                                                            |
|   openShortcutPopupKeyCode    | 16             |    To open the shortcut key map popup.  default is shift Key(keyCode is 16). keep shift key for 2 seconds ro opn shortcut key map popup.|
|   createNewShortcutKeyCode    | shiftKey       |    To define new shortcut key for any action. Default is shiftKey. press the shiftKey (keep the key pressed) and click on the element for which shortcut is created. Allowed keys are 'altKey', 'ctrlKey', 'shiftKey'                                                          |
|   **applicationDefinedKeys**  |   -            |    To define default shortcut key by the application.                                                                                                 |
|       keyCode                 |   76           |    The letter which will be combined with triggerShortcutKeyCode (i.e. shiftKey) to execute the action.|
|       letter                  |   l            |    The letter which will be combined with triggerShortcutKeyCode (i.e. shiftKey) to execute the action.|
|       actionName              |   Login        |    label of the shortcut key|
|       **element**             |   -            |    Element on which shortcut key need to be created.                                                                                                   |
|           id                  |   xxxx         |    id of the element for which shortcut key need to be defined.                                        |
|           className           |   l            |    css class name of the element if id is missing then class selector will be used to locate the element.|
|           label               |   l            |    label of the element, if id and css both are missing then label will be used to locate the element.|
|           tagName             |   l            |    element type e.g. div, span, button etc. If Id and CSS is missing then label and tagName is mandatory.|


```js
window.ssjsl.setConfig({
    triggerShortcutKeyCode: 'shiftKey',
    applicationDefinedKeys:[{
                    "keyCode": 76,
                    "letter": "l",
                    "actionName": "Login",
                    "element": {
                        "id": "",
                        "className": "",
                        "label": "Login",
                        "tagName": "DIV"
                    }
            }]}
);
```

### Supported Browsers
- Latest Chrome
- Latest Firefox
- Edge
- IE 11
### User Experience

#### Display Pre Configured Key
If any user wants to see all the shortcut key created for the web page. Press SHIFT Key
for 2 seconds, web application will display small popup and display the list of key map created.

#### Create new shortcut key
- Press ALT + SHIFT from the keyboard and click on the button for which you
want to create a shortcut key. Let suppose in the below image I want to create a
shortcut key (CTRL +n) for answer button.

- A modal popup will be displayed, enter the name of the key and an alphabet
which you want to combine with ctrl for shortcut key (e.g. CTRL + n)

- Then Save. A new shortcut key is created

#### Disable All Shortcut Key
If any time user wants to disable the shortcut key he can disable by selecting the “Disable
shortcuts” from key map popup.

### Version
1.0.0