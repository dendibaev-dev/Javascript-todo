const body = document.querySelector('body')
const tasksDOM = document.getElementById("tasks")


// обробатка основых кликов
body.addEventListener('click', function(e) {
    const click = e.target

    // Переключение окна добавление задачи
    if ( click.id === 'addOpen' ) {
        addWindowHandler('open')
    } else if ( click.id === 'addClose' ) {
        addWindowHandler('close')
    }
})

// Показываем список задач
function showMain() {
    const mainStart = document.querySelector('.main__start')
    const mainTitleWrapper = document.querySelector('.main__title-wrapper')
    const addFlexBtn = document.querySelector('.add__newTask_button-wrapper')
    const lsLength = localStorage.length

    if (lsLength) {
        mainStart.style.display = "none"
        mainTitleWrapper.style.display = "none"
        tasksDOM.style.display = "flex"
        addFlexBtn.style.display = "flex"
    } else {
        mainStart.style.display = "block"
        tasksDOM.style.display = "none"
        addFlexBtn.style.display = "none"
    }
}

// Переключение окна добавление задачи
function addWindowHandler(value) {
    const addWrapper = document.querySelector('.add-wrapper')

    if ( value === 'open') {
        addWrapper.style.display = "flex"
    } else if ( value === 'close' ) {
        addWrapper.style.display = "none"
    }
}

//Добавление задачи
function addTask() {
    const addBtn = document.querySelector('.add__button')

    addBtn.addEventListener('click', function(e) {
        const text = document.querySelector('.add__input').value
        const time = document.querySelector('.add__time').value

        const obj = {
            "text": text,
            "time": time,
            "done": false
        }
        const newTask = JSON.stringify(obj)
        localStorage.setItem(localStorage.length, newTask)

        location.reload()
    })
}

// Создаём пустой массив
const tasks = [];

// Запускаем цикл что бы обработать список задач из локального хранилища
for(let i = 0; i < localStorage.length; i++) {
    // Добавляем все таски из локального хранилища
    tasks.push(JSON.parse(localStorage.getItem(i)))
}

function renderCard(id) {
    // Создаём основной блок
    const card = document.createElement("div")
    card.classList.add("card")
    card.id = id

    // Создаём обёртку чекбокса
    const cardCheckboxWrapper = document.createElement("div")
    cardCheckboxWrapper.classList.add("card__checkbox-wrapper")

    // Создаём чекбокс
    const cardCheckbox = document.createElement("input")
    cardCheckbox.type = "checkbox"
    cardCheckbox.classList.add("card__checkbox")
    cardCheckbox.id = id

    // Добавляем чекбокс в обёртке
    cardCheckboxWrapper.appendChild(cardCheckbox)
    
    // -----------------------------------------------

    // Создаём блок о задаче
    const cardItem = document.createElement("div")
    cardItem.classList.add("card__item")

    // Название задачи
    const cardTitle = document.createElement("div")
    cardTitle.classList.add("card__title")
    cardTitle.textContent = tasks[id].text

    // Добавляем время
    const cardTime = document.createElement("div")
    cardTime.classList.add("card__time")
    cardTime.textContent = tasks[id].time

    // Элементы Название и Время добавляем в родительский блок
    cardItem.appendChild(cardTitle)
    cardItem.appendChild(cardTime)

    // Добавляем элемент удаление задачи
    const deleteItem = document.createElement("div")
    deleteItem.classList.add("card__delete")
    deleteItem.id = id

    if (tasks[id].done) {
        card.classList.add("done-task")
        cardCheckbox.checked = true
    }

    // Все элементы добавляем в основной блок
    card.appendChild(cardCheckboxWrapper)
    card.appendChild(cardItem)
    card.appendChild(deleteItem)

    // Возвращаем готовый шаблон
    return card
}

// Рендерим все задачи
for(let i = 0; i < tasks.length; i++) {
    tasksDOM.appendChild(renderCard(i))
}

// Удаление задачи
function removeCard(id) {
    tasks.splice(id, 1)

    localStorage.clear()

    for(let i = 0; i < tasks.length; i++) {
        localStorage.setItem(
            i, JSON.stringify(tasks[i])
        )
    }
    location.reload()
}

// Отметка задачи
function doneTask(e) {
    tasks[e.target.id].done = !tasks[e.target.id].done

    localStorage.clear()

    for(let i = 0; i < tasks.length; i++) {
        localStorage.setItem(
            i, JSON.stringify(tasks[i])
        )
    }

    const currentParent = e.target.parentNode
    const mainParent = currentParent.parentNode

    mainParent.classList.toggle("done-task")

    location.reload()
}

// Обработка/манипулация кликов
tasksDOM.addEventListener("click", function(e) {
    if ( e.target.className === 'card__delete') {
        removeCard(e.target.id)
    } else if ( e.target.className === 'card__checkbox') {
        doneTask(e)
    }
})

// Количество тасков
function countTasks() {
    const countDOM = document.querySelector('.task__count')
    const countDonesDOM = document.querySelector('.task__count-dones')

    countDOM.innerHTML = tasks.length
    countDonesDOM.innerHTML = tasks.filter( task => task.done).length
}

showMain()
addTask()
countTasks()
