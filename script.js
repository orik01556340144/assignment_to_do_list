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
        li.addEventListener('dragend', dragEnd);

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

        let taskText = document.createElement("span");
        taskText.textContent = inputbox.value;
        li.appendChild(taskText);

        let span = document.createElement("p");
        span.innerHTML = "\u00d7";
        span.addEventListener("click", function () {
            li.remove();
            saveData();
        });
        li.appendChild(span);

        let edit = document.createElement("button");
        edit.innerHTML = "\u270e";
        edit.addEventListener("click", function () {
            let input = document.createElement("input");
            input.type = "text";
            input.value = taskText.textContent;
            input.addEventListener("blur", function () {
                taskText.textContent = input.value;
                li.replaceChild(taskText, input);
                saveData();
            });
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
            li.replaceChild(input, taskText);
            input.focus();
        });
        li.appendChild(edit);

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
    listContainer.innerHTML = localStorage.getItem("data") || "";

    Array.from(listContainer.getElementsByTagName("li")).forEach(li => {
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);
        li.addEventListener('dragend', dragEnd);

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                li.classList.add("check");
            } else {
                li.classList.remove("check");
            }
            saveData();
        });

        const span = li.querySelector("p");
        span.addEventListener("click", function () {
            li.remove();
            saveData();
        });

        const edit = li.querySelector("button");
        edit.addEventListener("click", function () {
            let taskText = li.querySelector("span:nth-of-type(1)");
            let input = document.createElement("input");
            input.type = "text";
            input.value = taskText.textContent;
            input.addEventListener("blur", function () {
                taskText.textContent = input.value;
                li.replaceChild(taskText, input);
                saveData();
            });
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    input.blur();
                }
            });
            li.replaceChild(input, taskText);
            input.focus();
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
