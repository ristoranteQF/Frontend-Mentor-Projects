const boardsData = JSON.parse(localStorage.getItem("allData")) || [];


document.addEventListener("DOMContentLoaded", function() {
    toggleSideBar();
    createNewBoardButton();
    responsiveDesign();
    addNewBoard();
    renderSidebarBoardsUI();
    renderUI();
    updateNavbarBoardName();
    loadStatusData();
    renderUIforTasks();
    editBoardFunctionality();

    syncLeftSubtasksCount();
});


document.addEventListener("click", (e) => {
    if(e.target && (e.target.matches(".task-input-container") 
        || e.target.matches(".subtask-name") || e.target.matches("#sub-completed")) ){
            
            syncLeftSubtasksCount();
    }
})



function syncLeftSubtasksCount() {
    const tasksCards = document.querySelectorAll(".task-card");

    tasksCards.forEach(card => {
        const leftSubtasksCardCount = card.querySelector(".left-subtask-count");
        const taskId = card.getAttribute("task-id"); 

        let totalSubtasks = 0;
        let completedSubtasks = 0;

        boardsData.forEach(board => {
            board.columns.forEach(column => { 
                column.tasks.forEach(task => { 
                    if (task.id == taskId) {  
                        totalSubtasks = task.SUBTASKS.length;
                        completedSubtasks = task.SUBTASKS.filter(subtask => subtask.completed).length;

                        return;
                    }
                });
            });
        });

        leftSubtasksCardCount.textContent = completedSubtasks;

        console.log(leftSubtasksCardCount);
    });
}






function editBoardFunctionality() {
    const threeDotsResetButton = document.querySelector(".three-dots-reset-button");
    const editBoardDeleteBoardContainer = document.querySelector(".edit-board-delete-board-container");
    const overlay = document.querySelector(".overlay");

    threeDotsResetButton.addEventListener("click", () => {
        editBoardDeleteBoardContainer.style.display = "block";
        overlay.style.display = "block";
    })

    document.addEventListener("click", (e) => {
        if(e.target == overlay){
            editBoardDeleteBoardContainer.style.display = "none";
        }
    })


    // delete the board
    const deleteBoardButton = document.querySelector(".delete-board-button");
    const deleteBoardConfirmationContainer = document.querySelector(".delete-board-confirmation-container");
    const deleteBoardYesButton = document.querySelector(".delete-board-yes-button");
    const deleteBoardNoButton = document.querySelector(".delete-board-no-button");
    deleteBoardButton.addEventListener("click", () => {
        deleteBoardConfirmationContainer.style.display = "block";
        editBoardDeleteBoardContainer.style.display = "none";
    })
    deleteBoardNoButton.addEventListener("click", () => {
        deleteBoardConfirmationContainer.style.display = "none";
        overlay.style.display = "none";
        editBoardDeleteBoardContainer.style.display = "none";
    })

    deleteBoardYesButton.addEventListener("click", () => {
        const allData = JSON.parse(localStorage.getItem("allData"));

        if(allData.length == 1){
            allData.length = 0;
            localStorage.setItem("allData", JSON.stringify(allData));
            overlay.style.display = "none";
            deleteBoardConfirmationContainer.style.display = "none";

            const mainTasksContainer = document.querySelector(".main-tasks-container");
            mainTasksContainer.innerHTML = "";
            renderUI();
            renderUIforTasks();
            renderSidebarBoardsUI();
            updateNavbarBoardName();

            return;
        }

        for(let i = 0; i < allData.length; i++){
            if(allData[i].ACTIVE){
                allData.splice(i, 1);
            }
        }

        allData[0].ACTIVE = true;

        localStorage.setItem("allData", JSON.stringify(allData));
        overlay.style.display = "none";
        deleteBoardConfirmationContainer.style.display = "none";

        renderUI();
        renderUIforTasks();
        renderSidebarBoardsUI();
        updateNavbarBoardName();
    })


    document.addEventListener("click", (e) => {
        if(e.target == overlay){
            deleteBoardConfirmationContainer.style.display = "none";
        }
    })




    // edit the board
    const editBoardButton = document.querySelector(".edit-board-button");
    const editBoardContainer = document.querySelector(".edit-board-container");
    const allData = JSON.parse(localStorage.getItem("allData")) || [];

    editBoardButton.addEventListener("click", () => {
        if (allData.length == 0) {
            alert("Please create a board first!");
            return;
        }

        overlay.style.display = "block";
        editBoardContainer.style.display = "block";
        editBoardDeleteBoardContainer.style.display = "none";

        // close the edit board if user clicks outside of container
        document.body.addEventListener("click", (e) => {
            if (e.target === overlay) {
                editBoardContainer.style.display = "none";
                overlay.style.display = "none";
            }
        });

        const boardName = document.querySelector(".editBoardName");
        const boardColumnsEditContainer = document.querySelector(".edit-board-column-container");
        boardColumnsEditContainer.innerHTML = "";
        allData.forEach(column => {
            if(column.ACTIVE){
                boardName.value = column.boardName;

                column.columns.forEach(col => {
                    const div = document.createElement("div");
                    div.setAttribute("column-id", col.id);
                    div.classList.add("new-board-input");
                    div.innerHTML = `
                        <input value="${col.columnsName}" class="column-name" style="color: white; width: 80%;" type="text" required>
                        <img style="margin-left: 0.4rem;" class="delete-new-board-column-input" src="./assets/icon-cross.svg">
                    `;

                    boardColumnsEditContainer.appendChild(div);
                })

                return;
            }
        })



    }); 
}





function updateNavbarBoardName(){
    const boardNavbarTitle = document.querySelector(".board-navbar-title");
    const data = JSON.parse(localStorage.getItem("allData"));

    if(data.length == 0){
        boardNavbarTitle.textContent = "";
        return;
    }

    data.forEach(board => {
        if(board.ACTIVE){
            boardNavbarTitle.textContent = board.boardName;
            return;
        }
    })
}




document.addEventListener("click", e => {
    if(e.target && (e.target.matches(".sidebar-board-container") ||
     e.target.matches(".sidebar-board-title"))){
        renderUIforTasks();
        updateNavbarBoardName();
     }
})




function loadStatusData() {
    const taskStatusContainer = document.querySelector("#Status-choices");
    taskStatusContainer.innerHTML = `
        <option class="default-status" value="default" selected>---</option>
    `;

    const data = JSON.parse(localStorage.getItem("allData"));
    
    if (!data) {
        console.log("No data found in localStorage");
        return;
    }

    data.forEach(board => {
        if (board.ACTIVE) {
            board.columns.forEach(col => {
                let newOption = document.createElement("option");
                newOption.textContent = col.columnsName;
                newOption.setAttribute("option-id", col.id);
                taskStatusContainer.appendChild(newOption);
            });
            return;
        }
    });
}



function addNewBoard(){
    let allData = JSON.parse(localStorage.getItem("allData")) || [];
    let board = {};

    const boardName = document.querySelector(".boardName");
    const addContainerAddNewColumnButton = document.querySelector(".add-container-add-new-column-button");
    const createBoardButton = document.querySelector(".add-container-save-button");
    const sideBarContainer = document.querySelector(".boards-container");
    const boardNavbarTitle = document.querySelector(".board-navbar-title");
    const newBoardColumnContainer = document.querySelector(".new-board-column-container");
    const overlay = document.querySelector(".overlay");
    const addNewBoardContainer = document.querySelector(".add-board-container");

    document.body.addEventListener("click", e => {
            if(e.target && e.target.matches(".delete-new-board-column-input")){
                const parentElement = e.target.closest(".new-board-input");
                
                if(parentElement){
                    parentElement.remove();
                }
            }
        });

        addContainerAddNewColumnButton.addEventListener("click", () => {
            const div = document.createElement("div");
            div.classList.add("new-board-input");
            div.innerHTML = `
                <input class="column-name" style="color: white; width: 80%;" type="text" required>
                <img style="margin-left: 0.4rem;" class="delete-new-board-column-input" src="./assets/icon-cross.svg">
            `;

            newBoardColumnContainer.appendChild(div);

        })

        createBoardButton.addEventListener("click", () => {
            if(!boardName.value) {
                alert("You must enter the board name!");
                return;
            }
    
            const id = Date.now();
            const nameOfBoard = boardName.value;
            let active = true;
            allData.forEach(board => {
                board.ACTIVE = false;
            })
    
    
            let columnNames = [];
            const columnInputs = document.querySelectorAll(".column-name");
            let uniqueId = 0; // Define outside the loop

            columnInputs.forEach(input => {
                uniqueId++;
                if (input.value.trim()) {
                    columnNames.push({
                        id: uniqueId,
                        columnsName: input.value.trim().toUpperCase(),
                        tasks: []
                    });
                }
            });

    
            board = {
                ID: id,
                boardName: nameOfBoard,
                ACTIVE: active,
                columns: columnNames
            };

            allData.push(board);
            localStorage.setItem("allData", JSON.stringify(allData));

            overlay.style.display = "none";
            addNewBoardContainer.style.display = "none";


            addBoard(id, nameOfBoard);


            //render the total number of boards in the ui
            const totalNumberOfBoards = document.querySelector(".boards-count");
            totalNumberOfBoards.textContent = allData.length;


            // reset input values to default
            boardName.value = "";

            const columnsInput = document.querySelectorAll(".column-name");
            columnsInput.forEach(input => {
                input.parentElement.remove();
            })

            renderUI();
            updateNavbarBoardName();
            renderUIforTasks();
        })

}






function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}





function createNewBoardButton() {
    const createNewBoardButton = document.querySelector(".create-new-board-container");
    const addBoardContainer = document.querySelector(".add-board-container");
    const overlay = document.querySelector(".overlay");

        createNewBoardButton.addEventListener("click", () => {
            addBoardContainer.style.display = "block";
            overlay.style.display = "block";
        });

    document.body.addEventListener("click", (e) => {
        if (e.target === overlay) {
            addBoardContainer.style.display = "none";
            overlay.style.display = "none";
        }

        if(e.target && e.target.matches("create-new-board-container")) {
            addBoardContainer.style.display = "block";
            overlay.style.display = "block";
        }
    });
}




function responsiveDesign(){
    window.addEventListener("resize", () => {
        const addNewTaskButton = document.querySelector(".add-new-task");
        const logo = document.querySelector(".logo");
        const boardNavbarTitle = document.querySelector(".board-navbar-title");
    
        if(window.innerWidth < 823){
            addNewTaskButton.textContent = "+";
            addNewTaskButton.style.fontSize = "1.3rem";
            addNewTaskButton.style.width = "35px";
            addNewTaskButton.style.height = "35px";
            addNewTaskButton.style.display = "flex";
            addNewTaskButton.style.alignItems = "center";
            addNewTaskButton.style.justifyContent = "center";
            logo.src = "./assets/logo-mobile.svg";
            boardNavbarTitle.style.marginLeft = "1.1rem";
        } else {
            addNewTaskButton.style.width = "150px";
            addNewTaskButton.style.height = "40px";
            addNewTaskButton.textContent = "+ Add New Task";
            addNewTaskButton.style.fontSize = "1rem";
            logo.src = "./assets/logo-light.svg";
            boardNavbarTitle.style.marginLeft = "3.5rem";
        }

    })
}






function addBoard(ID, boardName){
    const boardsContainer = document.querySelector(".boards-container");
    
    const boards = document.querySelectorAll(".sidebar-board-container");
    boards.forEach(board => {
        board.classList.remove("active-board");

        // Target the inner div inside each sidebar-board-container
        const innerTextDiv = board.querySelector(".sidebar-board-title"); 
        if (innerTextDiv) {
            innerTextDiv.style.color = "grey";
            innerTextDiv.classList.remove("active-board-text");
        }
    });



    const board = document.createElement("div");
    board.classList.add("sidebar-board-container");
    board.classList.add("active-board");
    board.classList.add("sidebar-board-container");
    board.setAttribute("data-id", ID);
    board.innerHTML = `
        <img style="filter: brightness(0) invert(1);" src="./assets/icon-board.svg">
        <div style="margin-left: 0.8rem;" class="sidebar-board-title active-board-text">${boardName}</div>
    `;
    boardsContainer.appendChild(board);
}




function toggleSideBar() {
    const hideSidebarButton = document.querySelector(".hide-sidebar-container");
    const sidebar = document.querySelector(".sidebar");
    const openSideBarButton = document.querySelector(".open-sidebar");
    const main = document.querySelector(".main");
    const offDoamne1 = document.querySelector(".offDoamne1");
    const offDoamne2 = document.querySelector(".offDoamne2");
    const tasksContainer = document.querySelector(".tasks-container");


    hideSidebarButton.addEventListener("click", () => {
            sidebar.classList.add("hidden");  
            main.classList.add("sidebar-hidden"); 
            openSideBarButton.style.display = "flex"; 
            offDoamne1.style.display = "none";
            offDoamne2.style.display = "none";
    });

    openSideBarButton.addEventListener("click", () => {
            sidebar.classList.remove("hidden");
            main.classList.remove("sidebar-hidden");
            openSideBarButton.style.display = "none"; 
            
            setTimeout(function() {
                offDoamne1.style.display = "block";
                offDoamne2.style.display = "block";
            }, 300);
            
    });
}






function renderSidebarBoardsUI() {
    const boardsContainer = document.querySelector(".boards-container");
    boardsContainer.innerHTML = ""; // Clear the container

    let allBoards = localStorage.getItem("allData") ? JSON.parse(localStorage.getItem("allData")) : [];

    allBoards.forEach(board => {
        const boardElement = document.createElement("div");
            boardElement.classList.add("sidebar-board-container");
            boardElement.setAttribute("data-id", board.ID);
            if (board.ACTIVE) {
                boardElement.classList.add("active-board");
                boardElement.style.color = "white";
            }
            boardElement.innerHTML = `
                <img style="filter: brightness(0) invert(1);" src="./assets/icon-board.svg">
                <div style="margin-left: 0.8rem;" class="sidebar-board-title">${board.boardName}</div>
            `;
            boardsContainer.appendChild(boardElement);
    })
}












document.body.addEventListener("click", e => {
    if(e.target && e.target.matches(".sidebar-board-title")){
        const targetId = e.target.parentElement.getAttribute("data-id");
        const boards = JSON.parse(localStorage.getItem("allData"));

        boards.forEach(board => {
            if(board.ID == targetId){
                board.ACTIVE = true;
            } else {
                board.ACTIVE = false;
            }
        })

        localStorage.setItem("allData", JSON.stringify(boards));
        renderSidebarBoardsUI();
        renderUI();
    }
})







function renderUI() {
    const bigButton = document.querySelector(".new-column");
    const addNewTaskButton = document.querySelector(".add-new-task");
    const boardsCount = document.querySelector(".boards-count");
    const mainTasksContainer = document.querySelector(".main-tasks-container");
    const editDeleteBoardButton = document.querySelector(".three-dots-reset-button");
    const overlay = document.querySelector(".overlay");
    const editBoard = document.querySelector(".edit-board-container");

    const allData = JSON.parse(localStorage.getItem("allData")) || [];
    boardsCount.textContent = allData.length;


    bigButton.addEventListener("click", () => {
        if (allData.length == 0) {
            alert("Please create a board first!");
            return;
        }

        overlay.style.display = "block";
        editBoard.style.display = "block";

        // close the edit board if user clicks outside of container
        document.body.addEventListener("click", (e) => {
            if (e.target === overlay) {
                editBoard.style.display = "none";
                overlay.style.display = "none";
            }
    
            if(e.target && e.target.matches("new-column")) {
                addBoardContainer.style.display = "block";
                overlay.style.display = "block";
            }
        });



        // display the board name into the edit input value 
        // also add the columns for syncing with edit board funcitonality
        const editBoardName = document.querySelector(".editBoardName");
        const editBoardColumnContainer = document.querySelector(".edit-board-column-container");
        editBoardColumnContainer.innerHTML = "";

        allData.forEach(board => {
            if(board.ACTIVE){
                editBoardName.value = board.boardName;

                board.columns.forEach(column => {
                    const div = document.createElement("div");
                    div.classList.add("new-board-input");
                    div.setAttribute("column-id", column.id);

                    div.innerHTML = `
                        <input value="${column.columnsName}" class="column-name" style="color: white; width: 80%;" type="text" required>
                        <img style="margin-left: 0.4rem;" class="delete-new-board-column-input" src="./assets/icon-cross.svg">
                    `;

                    editBoardColumnContainer.appendChild(div);
                })

                return;
            }
        })
    });




    const addNewTaskContainer = document.querySelector(".add-new-task-container-pop-up");

    addNewTaskButton.addEventListener("click", () => {
        if (allData.length == 0) {
            alert("Please create a board first!");
            return;
        }

        overlay.style.display = "block";
        addNewTaskContainer.style.display = "block";

        document.body.addEventListener("click", e => {
            if(e.target == overlay){
                addNewTaskContainer.style.display = "none";
            }
        })


        loadStatusData();



        // add create new task functionality
        const createTaskButton = document.querySelector(".task-create-task-button");
        const taskTitle = document.querySelector(".title-input");
        const taskDescription = document.querySelector("#Description");

        createTaskButton.addEventListener("click", () => {
            if(!taskTitle.value.trim()){
                alert("You must enter the task's title.");
                return;
            }
            if(!taskDescription.value.trim()){
                alert("You must enter a description for your task.");
                return;
            }


            const subtasks = [];
            let subtaskCounter = 0;
            const subtaskInput = document.querySelectorAll(".subtask-input");
            subtaskInput.forEach(input => {
                if(input.value.trim()){
                    let id = subtaskCounter++;
                    const description = input.value.trim();
                    const COMPLETED = false;

                    const subtask = {
                        Id: id,
                        desc: description,
                        completed: COMPLETED
                    };

                    subtasks.push(subtask);
                }
            })

            const subtasksContainer = document.querySelector(".subtasks-container");
            subtasksContainer.innerHTML = `
                <div class="subtask-container">
                    <input class="subtask-input" type="text" placeholder="e.g. Make coffee">
                    <img style="margin-left: 0.4rem;" class="delete-subtask-input" src="./assets/icon-cross.svg">
                </div>

                <div class="subtask-container">
                    <input class="subtask-input" type="text" placeholder="e.g. Drink coffee & smile">
                    <img style="margin-left: 0.4rem;" class="delete-subtask-input" src="./assets/icon-cross.svg">
                </div>
            `;


            // check if user selected a status for his task
            const defaultOption = document.querySelector(".default-status");
            if(defaultOption.getAttribute("selected") == "selected" || 
                defaultOption.selected == true){
                alert("You must select a status for your task.");
                return;
            }


            let optionId, taskStatus;
            const taskStatusContainer = document.querySelector(".task-status-container");
            let options = taskStatusContainer.querySelectorAll("option");
            options.forEach(option => {
                if(option.getAttribute("selected") == "selected"){
                    optionId = option.getAttribute("option-id");
                    taskStatus = option.textContent;
                    return;
                }
            })

            const taskObject = {
                id: Date.now(),
                title: taskTitle.value.trim(),
                description: taskDescription.value.trim(),
                SUBTASKS: subtasks,
                status: [optionId, taskStatus]
            };

            const allData = JSON.parse(localStorage.getItem("allData"));

            allData.forEach(column => {
                if(column.ACTIVE){
                    column.columns.forEach(col => {
                        if(col.id == taskObject.status[0]){
                            col.tasks.push(taskObject);
                            return;
                        }
                    })
                    return;
                }
            })

            localStorage.setItem("allData", JSON.stringify(allData));


            taskTitle.value = "";
            taskDescription.value = "";
            overlay.style.display = "none";
            addNewTaskContainer.style.display = "none";

            renderUIforTasks();
        })


    });




    editDeleteBoardButton.addEventListener("click", () => {
        if(allData.length == 0){
            alert("Please create a board first!");
            return;
        }
    })
}






function renderUIforTasks(){
    const allBoards = JSON.parse(localStorage.getItem("allData"));
    if(allBoards.length === 0){
        const boardsContainer = document.querySelector(".boards-container");
        boardsContainer.innerHTML = "";
        return;
    }

    const mainTasksContainer = document.querySelector(".main-tasks-container");
    mainTasksContainer.innerHTML = "";
    let boardColumns;

    // first extract all relevant data and then insert the html into
    //  the main container
    allBoards.forEach(board => {
        if(board.ACTIVE){
            boardColumns = board.columns;
            return;
        }
    })
    
    boardColumns.forEach(column => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container");
        taskContainer.setAttribute("column-id", column.id);
    
        taskContainer.innerHTML = `
                <div class="task-header">
                    <div style="background-color: ${getRandomColor()};" class="circle"></div>
                    <p class="task-header-text">${column.columnsName} (<span class="tasks-count">${column.tasks.length}</span>)</p>
                </div>
    
                <div class="dynamic-tasks-container">
                    ${column.tasks.map(task => {
                        return `
                            <div task-id="${task.id}" class="task-card">
                                <h2 class="task-title">${task.title}</h2>
                                <p class="subtasks-count-container">
                                    <span class="left-subtask-count">0</span> of 
                                    <span class="right-subtask-todo-count">${task.SUBTASKS.length}</span> subtasks
                                </p>
                            </div>
                        `;
                    }).join('')} <!-- Join the array of HTML strings into one string -->
                </div>
        `;
    
        mainTasksContainer.appendChild(taskContainer);
    });
    
}






// this updates the selected options attribute to be able to
//  check if an option was selected
document.getElementById("Status-choices").addEventListener("change", function () {
        let options = this.querySelectorAll("option");

        options.forEach(option => {
            if (option === this.selectedOptions[0]) {
                option.setAttribute("selected", "selected");
            } else {
                option.removeAttribute("selected");
            }
        });
    });









// this is the subtasks container from the add new task container
const subtasksContainer = document.querySelector(".subtasks-container");


document.addEventListener("click", e => {
    if(e.target && e.target.matches(".delete-subtask-input")){
        const parentContainer = e.target.parentElement;
        parentContainer.remove();
    }
})


const addNewTaskFromNewTaskContainer = document.querySelector(".add-new-subtask-button");
addNewTaskFromNewTaskContainer.addEventListener("click", () => {
    const subtaskInput = document.createElement("div");
    subtaskInput.classList.add("subtask-container");

    subtaskInput.innerHTML = `
        <input class="subtask-input" type="text">
        <img style="margin-left: 0.4rem;" class="delete-subtask-input" src="./assets/icon-cross.svg">
    `;

    subtasksContainer.appendChild(subtaskInput);
})









const editContainerAddNewColumnButton = document.querySelector(".edit-container-add-new-column-button");
const editBoardColumnContiner = document.querySelector(".edit-board-column-container");

editContainerAddNewColumnButton.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("new-board-input");
    div.innerHTML = `
        <input class="column-name" style="color: white; width: 80%;" type="text" required>
        <img style="margin-left: 0.4rem;" class="delete-new-board-column-input" src="./assets/icon-cross.svg">
    `;

    editBoardColumnContiner.appendChild(div);
})
















// wtf is happening in this code xD
const editContainerSaveButton = document.querySelector(".edit-container-save-button");
const editBoardName = document.querySelector(".editBoardName");

editContainerSaveButton.addEventListener("click", () => {
    if (!editBoardName.value) {
        alert("You must enter the board name!");
        return;
    }

    const nameOfBoard = editBoardName.value;
    const allData = JSON.parse(localStorage.getItem("allData")) || [];

    allData.forEach(board => {
        if (board.ACTIVE) {
            board.boardName = nameOfBoard;
    
            const columnInputs = document.querySelectorAll(".column-name");
            
            // Collect column IDs from input fields
            const inputColumns = Array.from(columnInputs).map(input => ({
                id: input.parentElement.getAttribute("column-id"),
                name: input.value.trim()
            })).filter(col => col.name); // Remove empty names
    
            // Filter board.columns to keep only matching IDs
            board.columns = board.columns.filter(col =>
                inputColumns.some(inputCol => inputCol.id && col.id == inputCol.id)
            );
    
            // Update existing columns & add new ones
            inputColumns.forEach(inputCol => {
                if (inputCol.id) {
                    // Update existing column
                    const column = board.columns.find(col => col.id == inputCol.id);
                    if (column) {
                        column.columnsName = inputCol.name;
                    }
                } else {
                    // Add new column (no existing ID)
                    board.columns.push({
                        id: Date.now(), // Generate unique ID
                        columnsName: inputCol.name,
                        tasks: [],
                    });
                }
            });
    
            return;
        }
    });
    


    localStorage.setItem("allData", JSON.stringify(allData));

    const editBoardContainer = document.querySelector(".edit-board-container");
    editBoardContainer.style.display = "none";
    overlay.style.display = "none";

    renderUI();
    renderUIforTasks();
    updateNavbarBoardName();
});





function toggleTheme(){
    const body = document.body;
    body.classList.toggle("light-theme");
}


const sliderButton = document.querySelector(".slider");
sliderButton.addEventListener("click", toggleTheme);






 
document.addEventListener("click", e => {
    const taskView = document.querySelector(".task-view");
    const overlay = document.querySelector(".overlay");
    const taskTitle = document.querySelector(".task-title");
    const taskDescription = document.querySelector(".task-description");
    const taskStatus = document.querySelector("#task-status");
    const leftSubtaskCount = document.querySelector(".task-view-left-subtask-count");
    const totalSubtaskCount = document.querySelector(".total-subtask-count");
    const subtasksContainer = document.querySelector(".subtasks-container-task");
    

    const card = e.target.closest(".task-card"); 
    if (card) {
        overlay.style.display = "block";
        taskView.style.display = "block";



       const columnId = card.parentElement.parentElement.getAttribute("column-id");
       const cardId = card.getAttribute("task-id");
       taskView.setAttribute("columnID", columnId);
       taskView.setAttribute("cardID", cardId);

       const data = JSON.parse(localStorage.getItem("allData"));
       data.forEach(board => {
        if (board.ACTIVE) {
            board.columns.forEach(column => {
                if (column.id == columnId) {
                    column.tasks.forEach(task => {
                        if (task.id == cardId) {
                            taskTitle.textContent = task.title;
                            taskDescription.textContent = task.description;
                            totalSubtaskCount.textContent = task.SUBTASKS.length;
    
                            subtasksContainer.innerHTML = "";
    
                            let countFinishedSubtasks = 0;
    
                            task.SUBTASKS.forEach(subtask => {
                                const div = document.createElement("div");
                                div.classList.add("task-input-container");
                                div.setAttribute("subtask-id", subtask.Id);
    
                                div.innerHTML = `
                                    <input type="checkbox" name="sub-completed" id="sub-completed" ${subtask.completed ? 'checked' : ''}>
                                    <p style="margin-left: 0.5rem;" class="subtask-name">${subtask.desc}</p>
                                `;
    
                                subtasksContainer.appendChild(div);
    
                                const checkbox = div.querySelector('input[type="checkbox"]');
    
                                if (subtask.completed) {
                                    countFinishedSubtasks++;
                                    div.classList.add("completed");
                                }
    
                                div.addEventListener("click", () => {
                                    subtask.completed = !subtask.completed;
    
                                    if (subtask.completed) {
                                        div.classList.add("completed");
                                        checkbox.checked = true;
                                        countFinishedSubtasks++;
                                    } else {
                                        div.classList.remove("completed");
                                        checkbox.checked = false;
                                        countFinishedSubtasks--;
                                    }
    
                                    localStorage.setItem("allData", JSON.stringify(data));
                                    leftSubtaskCount.textContent = countFinishedSubtasks;
                                });
                            });
    
                            leftSubtaskCount.textContent = countFinishedSubtasks;

                            const leftSubtaskCountCard = document.querySelector(`[task-id="${cardId}"]`);
                            const actualSubtaskCountCard = leftSubtaskCountCard.querySelector(".left-subtask-count");
                            actualSubtaskCountCard.textContent = countFinishedSubtasks;
    
                            return;
                        }
                    });
    
                    return;
                }
            });
    
            return;
        }
    });
    } 

    if (e.target.classList.contains("overlay")) {
        overlay.style.display = "none";
        taskView.style.display = "none";
    }
});





// move the task's column container
const taskStatus = document.querySelector("#task-status");
const data = JSON.parse(localStorage.getItem("allData")) || [];

taskStatus.innerHTML = "";

// Populate the status dropdown
data.forEach(board => {
    if (board.ACTIVE) {
        board.columns.forEach(col => {
            const option = document.createElement("option");
            option.setAttribute("status-id", col.id);
            option.textContent = col.columnsName;
            taskStatus.appendChild(option);
        });
        return;
    }
});

if (taskStatus) {
    // Function to handle the task movement logic
    const handleTaskMove = () => {
        const selectedOption = taskStatus.selectedOptions[0];
        const newColumnId = selectedOption.getAttribute("status-id"); // Get the status-id of the selected option
        const taskCardId = taskStatus.parentElement.parentElement.getAttribute("cardid");
        const currentTaskColumnId = taskStatus.parentElement.parentElement.getAttribute("columnid");

        let copyObject;

        // Step 1: Find and remove the task from the current column
        data.forEach(board => {
            if (board.ACTIVE) {
                board.columns.forEach(column => {
                    if (column.id == currentTaskColumnId) {
                        const taskIndex = column.tasks.findIndex(task => task.id == taskCardId);
                        if (taskIndex !== -1) {
                            copyObject = column.tasks[taskIndex];
                            column.tasks.splice(taskIndex, 1);
                        }
                        return;
                    }
                });
                return;
            }
        });

        // Step 2: Add the task to the new column
        if (copyObject) {
            data.forEach(board => {
                if (board.ACTIVE) {
                    board.columns.forEach(column => {
                        if (column.id == newColumnId) {
                            column.tasks.push(copyObject); 
                            return;
                        }
                    });
                    return;
                }
            });

            localStorage.setItem("allData", JSON.stringify(data));

            // Close the task view after moving the task
            const overlay = document.querySelector(".overlay");
            const taskView = document.querySelector(".task-view");
            overlay.style.display = "none";
            taskView.style.display = "none";
        } else {
            console.error("Task not found or copyObject is undefined");
        }

        renderUIforTasks();
    };

    // Add change event listener
    taskStatus.addEventListener("change", handleTaskMove);
}




const taskEditDeleteButton = document.querySelector(".task-edit-delete-button");
const editTaskDeleteTaskContainer = document.querySelector(".edit-task-delete-task-container");
const overlay = document.querySelector(".overlay");

taskEditDeleteButton.addEventListener("click", () => {
    if (editTaskDeleteTaskContainer.style.display === "block") {
        editTaskDeleteTaskContainer.style.display = "none";
    } else {
        editTaskDeleteTaskContainer.style.display = "block";
        overlay.style.display = "block";
    }
});


document.addEventListener("click", (e) => {
    if(e.target == overlay || e.target.classList.contains("task-view")){
        editTaskDeleteTaskContainer.style.display = "none";
    }
})





const deleteTaskButton = document.querySelector(".delete-task-button");

deleteTaskButton.addEventListener("click", () => {
    const columnID = deleteTaskButton.parentElement.parentElement.getAttribute("columnid");
    const cardID = deleteTaskButton.parentElement.parentElement.getAttribute("cardid");
    const data = JSON.parse(localStorage.getItem("allData"));

    data.forEach(board => {
        if(board.ACTIVE){
            board.columns.forEach(column => {
                if(column.id == columnID){
                    for(let index = 0; index < column.tasks.length; index++){
                        let task = column.tasks[index];
                        if(task.id == cardID){
                            column.tasks.splice(index, 1);
                            break;
                        }
                    }
                }
            });

            return;
        }
    });


    const taskView = document.querySelector(".task-view");
    overlay.style.display = "none";
    taskView.style.display = "none";
    editTaskDeleteTaskContainer.style.display = "none";

    localStorage.setItem("allData", JSON.stringify(data));
    renderUIforTasks();
})







const editTaskButton = document.querySelector(".edit-task-button");
const editTaskContainer = document.querySelector(".edit-new-task-container-pop-up");
const editTaskTitle = document.querySelector("#editTaskTitle");
const editTaskDescription = document.querySelector("#editDescription");
const editTaskSubtasksContainer = document.querySelector(".edit-task-subtasks-container");
const addNewSubtaskButtonEdit = document.querySelector(".add-new-subtask-button-edit");

editTaskButton.addEventListener("click", () => {
    editTaskContainer.style.display = "block";
    editTaskSubtasksContainer.innerHTML = "";

    const columnID = editTaskButton.parentElement.parentElement.getAttribute("columnid");
    const cardID = editTaskButton.parentElement.parentElement.getAttribute("cardid");
    editTaskContainer.setAttribute("columnID", columnID);
    editTaskContainer.setAttribute("cardID", cardID);
    const data = JSON.parse(localStorage.getItem("allData"));

    data.forEach(board => {
        if(board.ACTIVE){
            board.columns.forEach(column => {
                if(column.id == columnID){
                    column.tasks.forEach(task => {
                        if(task.id == cardID){
                            editTaskTitle.value = `${task.title}`;
                            editTaskDescription.textContent = `${task.description}`;

                            task.SUBTASKS.forEach(subtask => {
                                const div = document.createElement("div");
                                div.classList.add("edit-subtask-container");

                                div.innerHTML = `
                                    <input class="edit-subtask-input" type="text" value="${subtask.desc}">
                                    <img style="margin-left: 0.4rem;" class="delete-subtask-input" src="./assets/icon-cross.svg">
                                `; 

                                editTaskSubtasksContainer.appendChild(div);
                            })
                            return;
                        }
                    })

                    return;
                }
            })

            return;
        }
    })
})



addNewSubtaskButtonEdit.addEventListener("click", () => {
    editTaskSubtasksContainer.innerHTML += `
        <div data-id="${Date.now()}" class="edit-subtask-container">
          <input class="edit-subtask-input" type="text">
          <img style="margin-left: 0.4rem;" class="delete-subtask-input" src="./assets/icon-cross.svg">
        </div>
    `;
})

document.addEventListener("click", e => {
    if(e.target == overlay){
        editTaskContainer.style.display = "none";
    }
})






const editTaskSaveButton = document.querySelector(".edit-task-button-save");

editTaskSaveButton.addEventListener("click", () => {
    const columnID = editTaskContainer.getAttribute("columnID");
    const cardID = editTaskContainer.getAttribute("cardID");

    const title = document.querySelector("#editTaskTitle").value;
    const description = document.querySelector("#editDescription").value;
    const subtasksElements = document.querySelectorAll(".edit-subtask-input");
    const subtasks = [];
    let subtaskId = 0;

    subtasksElements.forEach(subtask => {
        if(subtask.value.trim()){
            let subtaskObject = {
                Id: subtaskId++,
                desc: subtask.value.trim(),
                completed: false
            };

            subtasks.push(subtaskObject);
        }
    })

    if(!title){
        alert("You must enter a title for your task.");
        return;
    }
    if(!description){
        alert("You must enter a description for your task.");
        return;
    }

    
    const data = JSON.parse(localStorage.getItem("allData"));

    data.forEach(board => {
        if(board.ACTIVE){
            board.columns.forEach(column => {
                if(column.id == columnID){
                    column.tasks.forEach(task => {
                        if(task.id == cardID){
                            task.title = title;
                            task.description = description;
                            task.SUBTASKS.length = 0;
                            task.SUBTASKS = subtasks;

                            return;
                        }
                    })

                    return;
                }
            })

            return;
        }
    })

    localStorage.setItem("allData", JSON.stringify(data));
    editTaskContainer.style.display = "none";
    overlay.style.display = "none";
    const taskViewContainer = document.querySelector(".task-view");
    taskViewContainer.style.display = "none";
    editTaskDeleteTaskContainer.style.display = "none";

    renderUIforTasks();
});