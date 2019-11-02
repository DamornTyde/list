var list = [],
    saveSystem,
    listName = "New List";

//
const header = document.querySelector("header");
const main = document.querySelector("main");

//
if(storageAvailable('localStorage')){
    saveSystem = true;
} else {
    saveSystem = false;
}
main.appendChild(createEditor(0));

//
function createButton(text, onClicked, context) {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", onClicked);
    return button;
}

function createEditor(open){
    document.getElementsByTagName("main")[0].innerHTML = "";
    const editor = document.createElement("div");
    if(open == 0){
        editor.appendChild(createHeader(listName));
    } else {
        var temp = list.find(x => x.id == open);
        editor.appendChild(createHeader(temp.text));
        editor.appendChild(createUndertitle(temp.parent))
    }
    editor.appendChild(createTextarea());
    editor.appendChild(document.createElement("br"));
    editor.appendChild(createButton("add", () => addContent(open)));
    editor.appendChild(createContent(open));
    return editor;
}

function createHeader(text){
    const header = document.createElement("h1");
    header.appendChild(document.createTextNode(text));
    return header;
}

function createTextarea(){
    const textarea = document.createElement("textarea");
    textarea.setAttribute("id", "text");
    return textarea;
}

function createContent(open){
    const content = document.createElement("div");
    content.setAttribute("id", "content");
    const temp = list.filter(x => x.parent == open);
    temp.forEach(function(item){
        content.appendChild(createItem(item));
    });
    return content;
}

function createItem(i){
    const item = document.createElement("div");
    item.setAttribute("class", "item");
    item.appendChild(createDivButton(i.text, () => openItem(i.id), "context"));
    return item;
}

function createDivButton(text, onClicked, context){
    const button = document.createElement("div");
    button.setAttribute("class", context);
    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", onClicked);
    return button;
}

function createUndertitle(parent){
    const title = document.createElement("div");
    title.setAttribute("id", "back");
    title.appendChild(createButton("back", () => openItem(parent)));
    return title;
}

//
function storageAvailable(type) {
    try {
        var storage = window[type],
        x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}

function itemNumber(i){
    for(;;i++){
        if(list.findIndex(x => x.id == i) == -1){
            return i;
        }
    }
}

function addItems(temp){
    addSpace = list.findIndex(x => x.parent > temp[0].parent);
    if(addSpace == -1){
        temp.forEach(function(item){
            list.push(item);
        });
    } else {
        temp.forEach(function(item, i){
            list.splice(addSpace + i, 0 ,item);
        });
    }
}

function addContent(open){
    const text = document.getElementById("text").value;
    if(text.length > 0){
        addItems([{id:itemNumber(1), parent:open, text:text}]);
        main.appendChild(createEditor(open));
        document.getElementById("text").value = "";
    } else {
        alert("Please write something to add in the item");
    }
}

function openItem(id){
    main.appendChild(createEditor(id));
}