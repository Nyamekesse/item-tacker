const formArea = document.querySelector('.form');
const submitItem = document.querySelector('button.submit');
const displayArea = document.querySelector('.displayArea');
const clearItem = document.querySelector('.clear button');
const items = document.querySelector('.item');
const alertSection = document.querySelector('.alert');
const inputArea = document.querySelector('#inputArea');

//edit options
let editElement;
let editFlag = false;
let editId = '';

/* #################### ALL FUNCTIONS START ############## */
//FUNCTION TO RESPONSIBLE FOR CREATING ITEM TEMPLATE
const createItemTemplate = (id, value) => {
    //creating new element
    const element = document.createElement('div');
    //adding class to element
    element.classList.add('item');
    //creating an attribute
    const attr = document.createAttribute('data-id');
    //assigning the attribute the id value created
    attr.value = id;
    //attaching the dataset attribute created to the element you've created
    element.setAttributeNode(attr);
    //adding the template html inside the parent element
    element.innerHTML = `<div class="itemName"><h4>${value}</h4></div>
                         <div class="icons">
                            <button type='button' class='editBtn'><i class="fas fa-edit icon"></i></button>
                            <button type='button' class='deleteBtn'><i class="fas fa-trash icon"></i></button>
                         </div>
                        `;
    //appending the element inside the parent element for it to be displayed
    displayArea.appendChild(element);
    //selecting the delete and edit buttons after the items have been created and adding event listeners straight forward
    const deleteBtn = element.querySelector('button.deleteBtn').addEventListener('click', deleteItem);   
    const editBtn = element.querySelector('button.editBtn').addEventListener('click', editItem);    
}
//ADDING NEW ITEM
const addItem = (e) => {
    e.preventDefault();
    const value = inputArea.value;
    const id = new Date().getTime().toString();
    
    if(value && !editFlag) {
        //calling the creat item template function
        createItemTemplate(id, value);
        //showing the alert that new item is added
        alertDisplay('Item added', '#76fa76');
        //displaying the clear button as soon as an item is added
        clearItem.classList.add('visible');
        //adding added item to the local storage
        addLocalStore(id, value);
        //set back to default
        setBackToDefault();
        
    }
    else if (value && editFlag) {
        editElement.innerHTML = `<h4>${value}</h4>`;
        //calling the the function responsible for editing the items in local storage
        editItemLocalStorage(editId, value);
        alertDisplay('item successfully changed', '#76fa76');
        setBackToDefault();
    }
    else {
        alertDisplay('empty value', '#ff3333');
    }
};
//CLEAR ALL ITEMS
const clearAllItems = () => {
    const items = document.querySelectorAll('.item');
    //checking if the list is more than 0 then remove the items by using the removeChild method on the parent div
    items.length > 0 ? items.forEach(item => {displayArea.removeChild(item)}) : pass;
    //removing the clear items button when all the items are deleted
    clearItem.classList.remove('visible');
    //calling the alert section to display recently performed actions
    alertDisplay('all items cleared', '#ff3333');
    //also clearing everything form the local storage
    localStorage.removeItem('list');
    //setting back everything to default
    setBackToDefault();
};

//DELETING INDIVIDUAL ITEM
const deleteItem = (e) => {
    const currentItemClicked = e.currentTarget.parentElement.parentElement;
    //getting the unique ID of the current target
    const targetId = currentItemClicked.dataset.id;
    displayArea.removeChild(currentItemClicked);
    //clearing the 'clear all items' button if there are no item element in parent element after deleting an item
    displayArea.children.length == 0 ? clearItem.classList.remove('visible') : 1;
    //local storage delete
    removeFromLocalStorage(targetId);
    //calling the alert
    alertDisplay('selected item removed', '#ff3333');
    setBackToDefault();
}
//EDITING INDIVIDUAL ITEM
const editItem = (e) => {
    const currentItemClicked = e.currentTarget.parentElement.parentElement;
    //getting the edit element thats the actual item name or textContent
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //setting the input area to the element we want to change, thus the element been clicked on
    inputArea.value = editElement.textContent;
    //setting edit flag to be true
    editFlag = true;
    //getting the unique id
    editId = currentItemClicked.dataset.id;
    //changing the button text content to edit mode
    submitItem.textContent = 'Edit';
}
//GET ALL ITEMS IN LOCAL STORAGE OR RETURN EMPTY ARRAY IF NOT EXIST
const getItemsLocalStorage = () => {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}
//ADDING ITEMS TO LOCAL STORAGE FUNCTION
const addLocalStore = (id, value) => {
    const placeholder = {id:id, value:value};
    //we will check if there are items that already exist with the name list
    //and get it and pass it to JSON parser or set an empty array if there's none
    let localItems = getItemsLocalStorage();
    //appending items to the list whether it already exist or newly created
    localItems.push(placeholder);
    //finally adding the item to local storage, this will either add new if the list does'nt exist or append and overwrite
    //it if it does already exist
    localStorage.setItem('list', JSON.stringify(localItems))
};
//REMOVING ITEMS FROM LOCAL STORAGE
const removeFromLocalStorage = (id) => {
    //this will get all items existing in the local storage
    let items = getItemsLocalStorage();
    //we then filter and return the items which does not have the same id as specified
    //leaving the one that matches the specified id it out
    items = items.filter((item) => {
        if(item.id !== id) {
            return item;
        }
    });
    //saving and overriding the new list leaving the matched id out
    localStorage.setItem('list', JSON.stringify(items));
}
//EDITING ITEMS IN LOCAL STORAGE
const editItemLocalStorage = (id, value) => {
    let items = getItemsLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}
//SETTING BACK TO DEFAULT FUNCTION
const setBackToDefault = () => {
    inputArea.value = '';
    editFlag = false;
    editId = '';
    submitItem.textContent = 'Submit';
}
//ALERT NOTIFICATION DISPLAY FUNCTION
const alertDisplay = (textContent, bgColor) => {
    alertSection.classList.add('active');
    alertSection.innerHTML = `<h3>${textContent}</h3>`;
    alertSection.style.backgroundColor = bgColor;

    //removing the alert after some set time
    setTimeout(() => {
        alertSection.style.backgroundColor = '';
        alertSection.classList.remove('active');
        alertSection.innerHTML = ``;
    }, 2500);
};
//FUNCTION THAT WILL GET ALL ITEM =S FROM LOCAL STORAGE ON APP STARTUP
const setUpItemsOnLoaded = () => {
    //getting all ite,s from local storage
    let items = getItemsLocalStorage();
    //checking that the return value length is more than 0
    if (items.length > 0) {
        //using the for each method to represent each id & value
        items.forEach((item) => {
            //calling the create item template and passing the itemId as well the itemValue 
            createItemTemplate(item.id, item.value);
        })
        //showing the clear all button once all the items are displayed
        clearItem.classList.add('visible');
    }
}
/* #################### ALL FUNCTIONS END############## */


/* #################### EVENT LISTENERS START ############## */
formArea.addEventListener('submit', addItem);
clearItem.addEventListener('click', clearAllItems);
window.addEventListener('DOMContentLoaded', setUpItemsOnLoaded);
/* #################### EVENT LISTENERS END ############## */
