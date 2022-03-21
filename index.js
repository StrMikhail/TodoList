//Начальный массив задач-------------------------------------------------------------------------------
const tasks = [
    {
        id: 1138465078061,
        completed: false,
        text: 'Посмотреть новый урок по JavaScript',
    },
    {
        id: 1138465078062,
        completed: false,
        text: 'Выполнить тест после урока',
    },
    {
        id: 1138465078063,
        completed: false,
        text: 'Выполнить ДЗ после урока',
    },
]

//Переменные---------------------------------------------------------------------------------------------
const body = document.querySelector('body')
const tasksList = document.querySelector('.tasks-list')
const taskBlock = document.querySelector('.create-task-block')
const createButton = document.querySelector('.create-task-block__button')
const createInput = document.querySelector('.create-task-block__input')
let nightTheme = false



//Выгрузка задач из памяти-------------------------------------------------------------------------------
function loadTasks(taskList){
    taskList.forEach(task => createTaskForm(task))
}
loadTasks(tasks)


//Создание блока задачи-------------------------------------------------------------------------------
function createTaskForm(task){
    const htmlText = 
    `<div class="task-item" data-task-id=${task.id}>
        <div class="task-item__main-container">
            <div class="task-item__main-content">
                <form class="checkbox-form">
                    <input class="checkbox-form__checkbox" type="checkbox" id=${task.id}>
                    <label for="task-${task.id}"></label>
                </form>
                <span class="task-item__text">${task.text}</span>
            </div>
            <button class="task-item__delete-button default-button 
                delete-button" data-delete-task-id=${task.id}>Удалить</button>
        </div>
    </div>`

        tasksList.insertAdjacentHTML("beforeend", htmlText)
}
//Модальное окно с удалением------------------------------------------------------------------------
function createModalWindow(){
    const modalWindow =
    `<div class="modal-overlay modal-overlay_hidden">
        <div class="delete-modal">
            <h3 class="delete-modal__question">
                Вы действительно хотите удалить эту задачу?
            </h3>
            <div class="delete-modal__buttons">
                <button class="delete-modal__button delete-modal__cancel-button">
                    Отмена
                </button>
                <button class="delete-modal__button delete-modal__confirm-button">
                    Удалить
                </button>
            </div>
        </div>
    </div>`
    body.insertAdjacentHTML("beforeend",modalWindow)
}
createModalWindow()



//Вывод с задачи в DOM-------------------------------------------------------------------------------
//Создание задачи
createButton.addEventListener('click', (event)=> {
    event.preventDefault()
    checkTask({id: Date.now(), completed: false, text: createInput.value.trim()})
    createInput.value = null
})

//Проверка задачи 
function checkTask(task){
    checkSpan() /*Проверяем есть ли сообщение с ошибкой*/
    if (!task.text){
        errorMessage('Поле не должно быть пустым')
    }else if(tasks.find(item => item.text.toLowerCase() === task.text.toLowerCase())){
        errorMessage('Такая задача уже есть в нашем списке задач')
    }else{
        tasks.push(task)
        createTaskForm(task)
    }       
}

//Блок с ошибками-------------------------------------------------------------------------------
//Вывод сообщентя ошибки
function errorMessage(message){
    let span = document.createElement("span")
    span.className = "error-message-block"
    span.textContent = message
    taskBlock.append(span)
}

//Проверка наличия ошибки
function checkSpan(){
    if (taskBlock.querySelector('.error-message-block')){
        taskBlock.querySelector('.error-message-block').remove()
    }    
}
//Всплытие модального окна----------------------------------------------------------------------------------
//Находим модалку
const modalBlock = document.querySelector('.modal-overlay_hidden')

//Определяем клики на кнопки
tasksList.addEventListener('click', (event) => {
    event.preventDefault()
    const {target} = event
    const isBtn = event.target.closest('button')
    if (isBtn){
       modalBlock.classList.remove('modal-overlay_hidden')
        listenModal(target.dataset.deleteTaskId)
    }
})

//Cлушаем модальное окно и закрываем его
function listenModal(deleteId){
    modalBlock.addEventListener('click', (event) => {
        event.preventDefault()
        const {target} = event
        target.textContent.trim() === 'Отмена' || target.className === 'modal-overlay' ?
            modalBlock.classList.add('modal-overlay_hidden'): 
            (target.textContent.trim() === 'Удалить'? 
            deleteTask(deleteId): null)
    })
}
//Удаление задачи из DOM и памяти       
function deleteTask(deleteId){
    const removeTask = document.querySelectorAll('.task-item')
    removeTask.forEach(item => item.dataset.taskId === deleteId ? item.remove() : null)
    modalBlock.classList.add('modal-overlay_hidden')
    tasks.find((item, index) => Number(deleteId) === item.id ? tasks.splice(index, 1): null)
}
//Темная тема------------------------------------------------------------------------------------------------
//Слушатель на Tab
document.addEventListener('keydown', (event) => {
    const { key } = event
    if (key === 'Tab'){
        event.preventDefault()
        nightTheme? lightMode(): nightMode()
    }
})

//Светлая тема
function lightMode(){
    nightTheme = false
    body.style.background  = 'initial'
    const taskItem = document.querySelectorAll('.task-item')
    taskItem.forEach(item => {
        item.style.color = 'initial'
    }) 
    const buttons = document.querySelectorAll('button')
    buttons.forEach(item => {
        item.style.border ='none'
    })
}

//Темная тема
function nightMode(){
    nightTheme = true
    body.style.background  = '#24292E'
    const taskItem = document.querySelectorAll('.task-item')
    taskItem.forEach(item => {
        item.style.color = '#ffffff'
    }) 
    const buttons = document.querySelectorAll('button')
    buttons.forEach(item => {
        item.style.border ='1px solid #ffffff'
    })
}
