var list = [],
    listName = "New List",
    example = false;

//
const header = document.querySelector("header");
const main = document.querySelector("main");
const saveSystem = storageAvailable('localStorage');

//
header.appendChild(createButton("Preview/Editer", () => otherPage(0)));
renderEditor(main, 0);

//
function createButton(text, onClicked) {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode(text));
    button.addEventListener("click", onClicked);
    return button;
}

function renderEditor(root, open){
    root.innerHTML = "";
    if(open == 0){
        root.appendChild(createHeader(listName));
    } else {
        const temp = list.find(x => x.id == open);
        root.appendChild(createHeader(temp.text));
        root.appendChild(createUndertitle(temp.parent))
    }
    root.appendChild(createTextarea("text"));
    root.appendChild(document.createElement("br"));
    root.appendChild(createButton("Add", () => addContent(open)));
    root.appendChild(createContent(open));
}

function createHeader(text){
    const head = document.createElement("h1");
    head.appendChild(document.createTextNode(text));
    return head;
}

function createTextarea(context){
    const textarea = document.createElement("textarea");
    textarea.setAttribute("id", context);
    return textarea;
}

function createContent(open){
    const content = document.createElement("div");
    content.setAttribute("id", "content");
    const temp = list.filter(x => x.parent == open);
    temp.forEach(function(item, i){
        const up = (i > 0) ? true : false;
        const down = (i < temp.length - 1) ? true : false;
        content.appendChild(createItem(item));
        content.appendChild(createDropdown(item, up, down));
    });
    return content;
}

function createItem(i){
    const item = document.createElement("div");
    item.setAttribute("class", "item");
    item.appendChild(createDivButton(i.text, () => renderEditor(main, i.id), "context"));
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
    title.appendChild(createButton("back", () => renderEditor(main, parent)));
    return title;
}

function renderExample(root, open){
    root.innerHTML = "";
    root.appendChild(getList(open));
}

function getList(open){
    const div = document.createElement("div");
    div.setAttribute("id", "list");
    const temp = list.filter(x => x.parent == open);
    if(temp.length > 0){
        div.appendChild(createList(temp));
    }
    return div;
}

function createList(temp){
    const ol = document.createElement("ol");
    temp.forEach(function(item){
        ol.appendChild(createListItem(item));
    });
    return ol;
}

function createListItem(item){
    const li = document.createElement("li");
    li.appendChild(createDivButton(item.text, () => otherPage(item.id), "item"));
    const temp = list.filter(x => x.parent == item.id);
    if(temp.length > 0){
        li.appendChild(createList(temp));
    }
    return li;
}

function createDropdown(item, up, down){
    const drop = document.createElement("div");
    drop.setAttribute("class", "dropdown");
    drop.appendChild(createDropdownButton());
    drop.appendChild(createDropdownList(item, up, down));
    return drop;
}

function createDropdownButton(){
    const dropButton = document.createElement("div");
    dropButton.setAttribute("class", "dropbtn");
    dropButton.appendChild(document.createTextNode("•••"));
    return dropButton;
}

function createDropdownList(item, up, down){
    const dropList = document.createElement("div");
    dropList.setAttribute("class", "dropdown-content");
    if(up){
        dropList.appendChild(createDivButton("Move up", () => move(item.id, -1), ""));
    }
    if(down){
        dropList.appendChild(createDivButton("Move down", () => move(item.id, 1), ""));
    }
    dropList.appendChild(createDivButton("Edit text", () => editInfo(item), ""));
    dropList.appendChild(createDivButton("Delete item", () => deleteItem(item), ""));
    dropList.appendChild(createDivButton("Transfer item", () => transferInfo(item), ""));
    return dropList;
}

function editInfo(item){
    const info = document.createElement("div");
    info.appendChild(document.createTextNode("Here you can edit the text"));
    info.appendChild(document.createElement("br"));
    info.appendChild(createTextarea("infoText"));
    document.body.appendChild(createInfo(info, () => edit(item.id)));
    document.getElementById("infoText").value = item.text;
}

function createInfo(content, onClicked){
    const info = document.createElement("div");
    info.setAttribute("id", "dark");
    info.appendChild(createInfo2(content, onClicked));
    return info;
}

function createInfo2(content, onClicked){
    const info = document.createElement("div");
    info.setAttribute("id", "mid");
    info.appendChild(createInfo3(content, onClicked));
    return info;
}

function createInfo3(content, onClicked){
    const info = document.createElement("div");
    info.setAttribute("id", "info");
    info.appendChild(content);
    info.appendChild(createButton("Cancel", () => cancel()));
    info.appendChild(createButton("Ok", onClicked));
    return info;
}

function transferInfo(item){
    const select = document.createElement("select");
    select.setAttribute("id", "infoSelect")
    select.appendChild(getSelectContent(0, item, 1, false));
    if(select.childElementCount == 0){
        alert("There is no safe place to transfer this item to at the moment");
    } else {
        const info = document.createElement("div");
        info.appendChild(document.createTextNode("Where do you want to transfer this item to?"));
        info.appendChild(document.createElement("br"));
        info.appendChild(select);
        document.body.appendChild(createInfo(info, () => transfer(item.id)));
    }
}

function getSelectContent(parent, item, r, copy){
    const temp = list.filter(x => x.parent == parent);
    const select = document.createDocumentFragment();
    if(temp.length > 0){
        if(parent == 0 && (temp.findIndex(x => x.id == item.id) == -1 || copy)){
            select.appendChild(createOption("Root", parent))
        }
        temp.forEach(function(i, index){
            if(i.id != item.id){
                if(i.id != item.parent || copy){
                    var text = "";
                    for(x = 0; x < r; x++){
                        text += "-";
                    }
                    text += " " + eval("index + 1") + ". " + i.text;
                    select.appendChild(createOption(text, i.item));
                }
                select.appendChild(getSelectContent(i.id, item, r + 1, copy));
            }
        });
    }
    return select;
}

function createOption(text, value){
    const option = document.createElement("option");
    option.setAttribute("value", value);
    option.appendChild(document.createTextNode(text));
    return option;
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
        return false;
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
    const addSpace = list.findIndex(x => x.parent > temp[0].parent);
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
        renderEditor(main, open);
    } else {
        alert("Please write something to add in the item");
    }
}

function otherPage(open){
    if(example){
        renderEditor(main, open);
    } else {
        renderExample(main, open);
    }
    example = !example;
}

function move(id, pos){
    const origin = list.findIndex(x => x.id == id);
    const item = list.splice(origin, 1);
    list.splice(origin + pos, 0, item[0]);
    renderEditor(main, item[0].parent);
}

function cancel(){
    document.getElementById("dark").remove();
}

function edit(id){
    const item = list.find(x => x.id == id);
    const text = document.getElementById("infoText").value;
    if(item.text == text){
        alert("Please change the text\n\nNOTE: You can also cancel the process");
    } else {
        item.text = text;
        document.getElementById("dark").remove();
        renderEditor(main, item.parent);
    }
}

function deleteItem(item){
    const sure = confirm("Are you sure that you want to delete this item and all it's children?\n\nWARNING: this can't be undone!!!");
    if(sure){
        var temp = [item.id];
        list.splice(list.findIndex(x => x.id == item.id), 1);
        while(temp.length > 0){
            const temp2 = list.filter(x => x.parent == temp[0]);
            if(temp2.length > 0){
                temp2.forEach(function(i){
                    temp.push(i.id);
                });
                list.splice(list.findIndex(x => x.parent == temp[0]), temp2.length);
            }
            temp.shift();
        }
        renderEditor(main, item.parent);
    }
}

function transfer(id){
    const item = list.splice(list.findIndex(x => x.id == id), 1);
    renderEditor(main, item.parent);
    item[0].parent = Number(document.getElementById("infoSelect").value);
    addItems(item);
    document.getElementById("dark").remove();
}