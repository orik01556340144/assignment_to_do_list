const inputbox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputbox.value === '') {
        alert("You must write a task!");
    } else {
        let li = document.createElement("li");

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
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                li.classList.add("check");
                checkbox.checked = true;

            } else {
                li.classList.remove("check");
                checkbox.checked = false;
            }
            
        });

        const span = li.querySelector("span");
        span.addEventListener("click", function () {
            li.remove();
            
        });


        if (li.classList.contains("check")) {
            checkbox.checked = true;
        }
    });
}

show();
