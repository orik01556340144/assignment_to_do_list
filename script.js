const inputbox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputbox.value === '') {
        alert("You must write a task!");
    } else {
        let li = document.createElement("li");
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);
        li.addEventListener('dragend', dragEnd); // Added dragend event to remove dragging class

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                li.classList.add("check");
            } else {
                li.classList.remove("check");
            }
            saveData();
        });
        li.appendChild(checkbox);

        let taskText = document.createTextNode(inputbox.value);
        li.appendChild(taskText);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.addEventListener("click", function () {
            li.remove();
            saveData();
        });
        li.appendChild(span);

        listContainer.appendChild(li);
    }
    inputbox.value = "";
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        const checkbox = e.target.querySelector("input[type='checkbox']");
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                e.target.classList.add("check");
            } else {
                e.target.classList.remove("check");
            }
            saveData();
        }
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function show() {
    listContainer.innerHTML = localStorage.getItem("data");

    Array.from(listContainer.getElementsByTagName("li")).forEach(li => {
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);
        li.addEventListener('dragend', dragEnd); // Added dragend event to remove dragging class

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                li.classList.add("check");
                checkbox.checked = true;
            } else {
                li.classList.remove("check");
                checkbox.checked = false;
            }
            saveData();
        });

        const span = li.querySelector("span");
        span.addEventListener("click", function () {
            li.remove();
            saveData();
        });

        if (li.classList.contains("check")) {
            checkbox.checked = true;
        }
    });
}

function deleteAllTasks() {
    listContainer.innerHTML = "";
    saveData();
}

function dragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
    e.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    if (e.target.tagName === 'LI' && e.target !== draggingElement) {
        const dropY = e.clientY;
        const targetRect = e.target.getBoundingClientRect();
        const dropBefore = (dropY - targetRect.top) < (targetRect.height / 2);

        if (dropBefore) {
            listContainer.insertBefore(draggingElement, e.target);
        } else {
            listContainer.insertBefore(draggingElement, e.target.nextSibling);
        }
    }
    saveData();
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

show();
