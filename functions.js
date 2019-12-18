'use strict';
var list = [{
        id: 0,
        parent: -1,
        text: "New List",
        type: "1"
    }],
    example = false,
    cookie = false;

//
const header = document.querySelector("header");
const main = document.querySelector("main");
const saveSystem = storageAvailable('localStorage');
const listTypes = ["1", "A", "a", "I", "i", "disc", "circle", "square", "none"];
const cookieText = ["On this project we (mostly) use cookies if you chose to save something so we don't have to setup a server for your information.",
    "You can manage your own save files by using the options in the header."
];
const noSave = "There are no saves on this webbrowser.";

//
header.appendChild(createButton("Preview/Editer", () => otherPage(0)));
if (saveSystem) {
    cookie = checkCookie();
    header.appendChild(createButton("save", () => saveInfo()));
    header.appendChild(createButton("Load save", () => loadInfo()));
    header.appendChild(createButton("Remove save", () => removeInfo()));
    header.appendChild(createButton("Clear saves", () => clearSaves()));
}
header.appendChild(createButton("New list", () => newList()));
renderEditor(main, 0);

//
function createButton(text, onClicked) {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", onClicked);
    return button;
}

function renderEditor(root, open) {
    const temp = list.find(x => x.id == open);
    root.innerHTML = "";
    root.appendChild(createHeader(temp.text));
    if (open > 0) {
        root.appendChild(createUndertitle(temp.parent));
    }
    root.appendChild(createTextarea("text"));
    root.appendChild(document.createElement("br"));
    root.appendChild(createButton("Add", () => addContent(open)));
    if (saveSystem) {
        root.appendChild(createButton("Inport save", () => inportInfo(open)));
    }
    if (open > 0) {
        root.appendChild(createButton("Preview item", () => otherPage(open)));
    }
    root.appendChild(createTypeOptoins(temp));
    root.appendChild(createContent(open));
}

function createHeader(text) {
    const head = document.createElement("h1");
    head.appendChild(document.createTextNode(text));
    return head;
}

function createTextarea(context) {
    const textarea = document.createElement("textarea");
    textarea.setAttribute("id", context);
    return textarea;
}

function createContent(open) {
    const content = document.createElement("div");
    content.setAttribute("id", "content");
    const temp = list.filter(x => x.parent == open);
    temp.forEach(function (item, i) {
        const up = (i > 0) ? true : false;
        const down = (i < temp.length - 1) ? true : false;
        content.appendChild(createItem(item));
        content.appendChild(createDropdown(item, up, down));
    });
    return content;
}

function createItem(i) {
    const item = document.createElement("div");
    item.setAttribute("class", "item");
    item.appendChild(createDivButton(i.text, () => renderEditor(main, i.id), "context"));
    return item;
}

function createDivButton(text, onClicked, context) {
    const button = document.createElement("div");
    button.setAttribute("class", context);
    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", onClicked);
    return button;
}

function createUndertitle(parent) {
    const title = document.createElement("div");
    title.setAttribute("id", "back");
    title.appendChild(createButton("back", () => renderEditor(main, parent)));
    return title;
}

function renderExample(root, open) {
    root.innerHTML = "";
    if (open > 0) {
        root.appendChild(createButton("Back to item", () => otherPage(open)));
    }
    root.appendChild(getList(open));
}

function getList(open) {
    const div = document.createElement("div");
    const title = list.find(x => x.id == open).text;
    div.setAttribute("id", "list");
    div.appendChild(createHeader(title));
    const temp = list.filter(x => x.parent == open);
    if (temp.length > 0) {
        div.appendChild(createList(temp));
    }
    return div;
}

function createList(temp) {
    const type = list.find(x => x.id == temp[0].parent).type;
    var ol;
    if (type.length == 1) {
        ol = document.createElement("ol");
        ol.setAttribute("type", type);
    } else {
        ol = document.createElement("ul");
        ol.style.listStyleType = type;
    }
    temp.forEach(function (item) {
        ol.appendChild(createListItem(item));
    });
    return ol;
}

function createListItem(item) {
    const li = document.createElement("li");
    li.appendChild(createDivButton(item.text, () => otherPage(item.id), "item"));
    const temp = list.filter(x => x.parent == item.id);
    if (temp.length > 0) {
        li.appendChild(createList(temp));
    }
    return li;
}

function createDropdown(item, up, down) {
    const drop = document.createElement("div");
    drop.setAttribute("class", "dropdown");
    drop.appendChild(createDropdownButton());
    drop.appendChild(createDropdownList(item, up, down));
    return drop;
}

function createDropdownButton() {
    const dropButton = document.createElement("div");
    dropButton.setAttribute("class", "dropbtn");
    dropButton.appendChild(document.createTextNode("•••"));
    return dropButton;
}

function createDropdownList(item, up, down) {
    const dropList = document.createElement("div");
    dropList.setAttribute("class", "dropdown-content");
    if (up) {
        dropList.appendChild(createDivButton("Move up", () => move(item.id, -1), ""));
    }
    if (down) {
        dropList.appendChild(createDivButton("Move down", () => move(item.id, 1), ""));
    }
    dropList.appendChild(createDivButton("Edit text", () => editInfo(item), ""));
    dropList.appendChild(createDivButton("Delete item", () => deleteItem(item), ""));
    dropList.appendChild(createDivButton("Transfer item", () => transferInfo(item), ""));
    dropList.appendChild(createDivButton("Copy item", () => copyInfo(item), ""));
    return dropList;
}

function editInfo(item) {
    const info = document.createElement("div");
    info.appendChild(document.createTextNode("Here you can edit the text"));
    info.appendChild(document.createElement("br"));
    info.appendChild(createTextarea("infoText"));
    document.body.appendChild(createInfo(info, () => edit(item.id)));
    document.getElementById("infoText").value = item.text;
}

function createInfo(content, onClicked) {
    const info = document.createElement("div");
    info.setAttribute("id", "info");
    info.appendChild(content);
    info.appendChild(createButton("Cancel", () => cancel()));
    info.appendChild(createButton("Ok", onClicked));
    const mid = document.createElement("div");
    mid.setAttribute("id", "mid");
    mid.appendChild(info);
    const dark = document.createElement("div");
    dark.setAttribute("id", "dark");
    dark.appendChild(mid);
    return dark;
}

function transferInfo(item) {
    const select = document.createElement("select");
    select.setAttribute("id", "infoSelect");
    select.appendChild(getSelectContent(0, item, 1, false));
    if (select.childElementCount == 0) {
        alert("There is no safe place to transfer this item to at the moment");
    } else {
        const info = document.createElement("div");
        info.appendChild(document.createTextNode("Where do you want to transfer this item to?"));
        info.appendChild(document.createElement("br"));
        info.appendChild(select);
        document.body.appendChild(createInfo(info, () => transfer(item.id)));
    }
}

function getSelectContent(parent, item, r, copy) {
    const temp = list.filter(x => x.parent == parent);
    const select = document.createDocumentFragment();
    if (parent == 0 && (temp.findIndex(x => x.id == item.id) == -1 || copy)) {
        select.appendChild(new Option("Root", parent));
    }
    temp.forEach(function (i, index) {
        if (i.id != item.id) {
            if (i.id != item.parent || copy) {
                var text = "";
                for (var x = 0; x < r; x++) {
                    text += "-";
                }
                text += ` ${index + 1}. ${i.text}`;
                select.appendChild(new Option(text, i.id));
            }
            select.appendChild(getSelectContent(i.id, item, r + 1, copy));
        }
    });
    return select;
}

function copyInfo(item) {
    const select = document.createElement("select");
    select.setAttribute("id", "infoSelect");
    select.appendChild(getSelectContent(0, item, 1, true));
    const info = document.createElement("div");
    info.appendChild(document.createTextNode("Where do you want to copy this item to?"));
    info.appendChild(document.createElement("br"));
    info.appendChild(document.createElement("br"));
    info.appendChild(select);
    document.body.appendChild(createInfo(info, () => copy(item.id)));
}

function createCookieBanner() {
    const title = document.createElement("h3");
    title.appendChild(document.createTextNode("Come to our website, we have cookies."));
    const text = document.createElement("div");
    cookieText.forEach(function (item) {
        text.appendChild(document.createTextNode(item));
        text.appendChild(document.createElement("br"));
        text.appendChild(document.createElement("br"));
    });
    text.appendChild(createButton("accept", () => cookieAccord()));
    const info = document.createElement("div");
    info.setAttribute("id", "cookie");
    info.appendChild(title);
    info.appendChild(text);
    document.body.appendChild(info);
}

function createTypeOptoins(i) {
    const option = document.createElement("select");
    option.setAttribute("id", "type");
    option.addEventListener("change", () => setType(i.id));
    listTypes.forEach(function (item) {
        const select = item == i.type;
        option.appendChild(new Option(item, undefined, select, select));
    });
    return option;
}

function saveInfo() {
    if (cookie === false) {
        alert("Please accept our cookie banner first.");
    } else if (list.length == 1) {
        alert("Sorry but we don't save an empy list.");
    } else {
        const select = document.createElement("select");
        select.setAttribute("id", "infoSelect");
        select.appendChild(new Option("New Save", -1, false, false));
        select.appendChild(createSaveList());
        const info = document.createElement("div");
        info.appendChild(document.createTextNode("Will this be a new save or do you want to overwrite an old save?"));
        info.appendChild(document.createElement("br"));
        info.appendChild(document.createElement("br"));
        info.appendChild(select);
        document.body.appendChild(createInfo(info, () => saveList()));
    }
}

function createSaveList() {
    const option = document.createDocumentFragment();
    for (var i = 0; i < localStorage.length; i++) {
        const item = localStorage.key(i);
        const select = item == list[0].text;
        option.appendChild(new Option(item, i, select, select));
    }
    return option;
}

function loadInfo() {
    createInfoNode("load", () => loadList());
}

function removeInfo() {
    createInfoNode("remove", () => removeList());
}

function inportInfo(open) {
    createInfoNode("inport", () => inportList(open));
}

function createInfoNode(message, onClicked) {
    if (localStorage.length == 0) {
        alert(noSave);
    } else {
        const select = document.createElement("select");
        select.setAttribute("id", "infoSelect");
        select.appendChild(createSaveList());
        const info = document.createElement("div");
        info.appendChild(document.createTextNode(`Which save do you want to ${message}?`));
        info.appendChild(document.createElement("br"));
        info.appendChild(document.createElement("br"));
        info.appendChild(select);
        document.body.appendChild(createInfo(info, onClicked));
    }
}

//
function storageAvailable(type) {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
}

function itemNumber(i) {
    for (;; i++) {
        if (list.findIndex(x => x.id == i) == -1) {
            return i;
        }
    }
}

function addItems(temp) {
    const addSpace = list.findIndex(x => x.parent > temp[0].parent);
    if (addSpace == -1) {
        temp.forEach(function (item) {
            list.push(item);
        });
    } else {
        temp.forEach(function (item, i) {
            list.splice(addSpace + i, 0, item);
        });
    }
}

function addContent(open) {
    const text = document.getElementById("text").value;
    if (text.length > 0) {
        addItems([{
            id: itemNumber(1),
            parent: open,
            text: text,
            type: "1"
        }]);
        renderEditor(main, open);
    } else {
        alert("Please write something to add in the item");
    }
}

function otherPage(open) {
    if (example) {
        renderEditor(main, open);
    } else {
        renderExample(main, open);
    }
    example = !example;
}

function move(id, pos) {
    const origin = list.findIndex(x => x.id == id);
    const item = list.splice(origin, 1);
    list.splice(origin + pos, 0, item[0]);
    renderEditor(main, item[0].parent);
}

function cancel() {
    document.getElementById("dark").remove();
}

function edit(id) {
    const item = list.find(x => x.id == id);
    const text = document.getElementById("infoText").value;
    if (item.text == text) {
        alert("Please change the text\n\nNOTE: You can also cancel the process");
    } else {
        item.text = text;
        document.getElementById("dark").remove();
        renderEditor(main, item.parent);
    }
}

function deleteItem(item) {
    const sure = confirm("Are you sure that you want to delete this item and all it's children?\n\nWARNING: this can't be undone!!!");
    if (sure) {
        var temp = [item.id];
        list.splice(list.findIndex(x => x.id == item.id), 1);
        while (temp.length > 0) {
            const temp2 = list.filter(x => x.parent == temp[0]);
            if (temp2.length > 0) {
                temp2.forEach(function (i) {
                    temp.push(i.id);
                });
                list.splice(list.findIndex(x => x.parent == temp[0]), temp2.length);
            }
            temp.shift();
        }
        renderEditor(main, item.parent);
    }
}

function transfer(id) {
    const item = list.splice(list.findIndex(x => x.id == id), 1);
    renderEditor(main, item[0].parent);
    item[0].parent = Number(document.getElementById("infoSelect").value);
    addItems(item);
    document.getElementById("dark").remove();
}

function copy(id) {
    const temp = list.find(x => x.id == id);
    const parent = Number(document.getElementById("infoSelect").value);
    copyMachine(list, parent, temp);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    const accord = getCookie("accord");
    if (accord == "") {
        createCookieBanner();
        return false;
    }
    setCookie("accord", "accord", 365);
    return true;
}

function cookieAccord() {
    setCookie("accord", "accord", 365);
    cookie = true;
    document.getElementById("cookie").remove();
}

function setType(id) {
    const temp = list.find(x => x.id == id);
    const type = document.getElementById("type").value;
    temp.type = type;
}

function saveList() {
    const save = Number(document.getElementById("infoSelect").value);
    if (save != -1) {
        const name = localStorage.key(save);
        return confirmThenSave(name, `Do you realy want to overwrite '${name}'?`);
    }
    const name = prompt("What will be the name of this new save?");
    if (name.length <= 0) {
        alert("Please fill in a save name or choose a save to overwrite");
    } else if (localStorage.getItem(name) !== null) {
        confirmThenSave(name, `'${name}' already exist, do you want to overwrite this old save?`);
    } else {
        confirmThenSave(name, `Are you sure you want to save the list under the name '${name}'?`);
    }
}

function confirmThenSave(name, message) {
    if (confirm(message)) {
        list[0].text = name;
        localStorage.setItem(name, JSON.stringify(list));
        reloadAfterSave();
    }
}

function clearSaves() {
    if (localStorage.length == 0) {
        alert(noSave);
    } else if (confirm("Do you realy want the clear all saves?\n\nWARNING: this can't be undone!")) {
        localStorage.clear();
    }
}

function loadList() {
    const name = localStorage.key(Number(document.getElementById("infoSelect").value));
    var sure;
    if (list.length == 1) {
        sure = true;
    } else {
        sure = confirm(`Do you realy want to load '${name}'?\n\nWARNING: All unsaved progress will be lost!`);
    }
    if (sure) {
        list = JSON.parse(localStorage.getItem(name));
        reloadAfterSave();
    }
}

function reloadAfterSave() {
    document.getElementById("dark").remove();
    if (example) {
        renderExample(main, 0);
    } else {
        renderEditor(main, 0);
    }
}

function removeList() {
    const name = localStorage.key(Number(document.getElementById("infoSelect").value));
    if (confirm(`Do you realy want to remove '${name}'?\n\nWARNING: this can't do undone!`)) {
        localStorage.removeItem(name);
    }
}

function newList() {
    if (list.length == 1) {
        alert("You are already working on an empty list");
    } else {
        if (confirm("Do you realy want to create a new list\n\nWARNING: all unsaved progress will be lost!")) {
            list = [{
                id: 0,
                parent: -1,
                text: "New List",
                type: "1"
            }];
            renderEditor(main, 0);
        }
    }
}

function inportList(open) {
    const temp = JSON.parse(localStorage.getItem(localStorage.key(Number(document.getElementById("infoSelect").value))));
    copyMachine(temp, open, temp[0], open);
}

function copyMachine(temp, parent, root, open) {
    var newId = itemNumber(1),
        temp2 = ([{
            oldId: root.id,
            newId: newId
        }]);
    addItems([{
        id: newId,
        parent: parent,
        text: root.text,
        type: root.type
    }]);
    if (parent == open) {
        renderEditor(main, parent);
    }
    while (temp2.length > 0) {
        const temp3 = temp.filter(x => x.parent == temp2[0].oldId);
        if (temp3.length > 0) {
            var temp4 = [];
            temp3.forEach(function (item) {
                newId = itemNumber(newId + 1);
                temp4.push({
                    id: newId,
                    parent: temp2[0].newId,
                    text: item.text,
                    type: item.type
                });
                temp2.push({
                    oldId: item.id,
                    newId: newId
                });
            });
            addItems(temp4);
        }
        temp2.shift();
    }
    document.getElementById("dark").remove();
}