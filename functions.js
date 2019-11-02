var list = [],
    saveSystem,
    listName = "New List",
    open = 0;

//
if(storageAvailable('localStorage')){
    saveSystem = true;
} else {
    saveSystem = false;
}
if(saveSystem){
    document.getElementsByTagName("header")[0].innerHTML = "<button id='switch'>Example</button>" +
        "<button id='saveList'>Save</button>" +
        "<button id='loadList'>Load</button>" +
        "<button id='deleteList'>Delete a save</button>" +
        "<button id='newList'>New list</button>" +
        "<button id='deleteStorage'>Clear saves</button>";
} else {
    document.getElementsByTagName("header")[0].innerHTML = "<button id='switch'>Example</button>";
}
editer();

//
document.getElementById("add").addEventListener("click", function(){
    var text = document.getElementById("text").value,
        id = itemNumber(1);
    if(text.length > 0){
        addItems([{id:id, parent:open, text:text}]);
    } else {
        alert("Please fill in some text so we can add your item");
    }
    fill();
    document.getElementById("text").value = "";
});

document.getElementById("back").addEventListener("click", function(){
    var temp = list.find(x => x.id == open);
    console.log(temp);
    open = temp.parent;
    editer();
});

document.getElementById("content").addEventListener("click", function(button){
    if(button.target.classList.contains("context")){
        var id = button.target.dataset.id;
        open = id;
        editer();
    }
});

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

//
function editer(){
    var content = ""
    if(open == 0){
        content += "<h1>" + listName + "</h1>";
    } else {
        var temp = list.find(x => x.id == open)
        content += "<h1>" + temp.text + "</h1>";
    }
    content += "<div id='header'><button id='back'>Back</button></div>" +
        "<div><textarea id='text'></textarea><br>";
    if(saveSystem){
        content += "<button id='add'>Add</button>" +
            "<button id='importList'>Import</button></div>";
    } else {
        content += "<button id='add''>Add</button></div>";
    }
    content += "<div id='content'></div>";
    document.getElementsByTagName("main")[0].innerHTML = content;
    fill();
}

function fill(){
    var temp = list.filter(x => x.parent == open),
        content = "";
    temp.forEach(function(item){
        content += "<div class='item'><div class='context' data-id='" + item.id + "'>" + item.text + "</div></div>";
    });
    document.getElementById("content").innerHTML = content;
}