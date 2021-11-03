import React from "react";
import {TaskStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT, SetTodosActionType, todoListId_1, todoListId_2} from "./todolist-reducer";
import {Dispatch} from "redux";
import {taskApi} from "../api/task-api";
import {TaskType} from "../api/task-api";


export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}

type RemoveTaskAT = {
    type: 'REMOVE-TASK'
    todoListId: string
    taskId: string
}

type AddTaskAT = {
    type: 'ADD-TASK'
    task: TaskType
}

type ChangeTaskStatusAT = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    isDone: boolean
    todoListId: string
}

type ChangeTaskTitleAT = {
    type: 'CHANGE-TASK-TITLE'
    todoListId: string
    taskId: string
    title: string
}

const initialState: TaskStateType = {
    [todoListId_1]: [],
    [todoListId_2]: []

  /*  [todoListId_1]: [
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'React', isDone: false}
    ],
    [todoListId_2]: [
        {id: v1(), title: 'Beer', isDone: true},
        {id: v1(), title: 'Fish', isDone: true},
        {id: v1(), title: 'Meat', isDone: true},
    ]*/
}

type ActionsType = RemoveTaskAT | AddTaskAT | ChangeTaskTitleAT | ChangeTaskStatusAT |
    AddTodoListAT | RemoveTodoListAT |SetTodosActionType | SetTasksActionType

const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        };

        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId];
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todoListId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD-TASK' : {
           /* const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            const newTask = {id: v1(), title: action.title, isDone: false}
            const newTasks = [newTask, ...tasks]
            stateCopy[action.task.id] = newTasks
            return stateCopy;*/

           /* const stateCopy = {...state}
            const tasks = stateCopy[action.task.id];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.id] = newTasks;
            return stateCopy;*/

            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE-TASK-TITLE' : {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            let task = tasks.find(t => t.id === action.taskId)
            if (task) {
                task.title = action.title
            }
            return stateCopy
        }

        case 'CHANGE-TASK-STATUS' : {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            stateCopy[action.todoListId] = tasks.map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)

            return stateCopy
        }

        case 'ADD-TODOLIST' : {
            const stateCopy = {...state}
            stateCopy[action.id] = []
            return stateCopy
        }

        case 'REMOVE-TODOLIST' : {
            const stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        }

        case "SET-TODOS":
            let copyState = {...state}
            action.todos.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState

        default:
            return state;
    }
}


export default tasksReducer;

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskAT => ({
    type: 'REMOVE-TASK',
    todoListId: todoListId,
    taskId: taskId
})

export const addTaskAC = (task: TaskType): AddTaskAT => ({
    type: 'ADD-TASK',
    task
})

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string): ChangeTaskStatusAT => ({
    type: 'CHANGE-TASK-STATUS',
    taskId,
    isDone,
    todoListId
})

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): ChangeTaskTitleAT => ({
    type: 'CHANGE-TASK-TITLE',
    todoListId,
    taskId,
    title
})

export const AddTodolistAC = (title: string): AddTodoListAT => ({
    type: 'ADD-TODOLIST',
    title,
    id: v1()
})

export const RemoveTodolistAC = (todoListId: string): RemoveTodoListAT => ({
    type: 'REMOVE-TODOLIST',
    todoListId
})

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        taskApi.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                const action = setTasksAC(tasks, todolistId)
                dispatch(action)
            })
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    taskApi.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const createTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    taskApi.createTask(title, todolistId)
        .then((res) => {
            let task = res.data.data.item
             dispatch(addTaskAC(task))
        })
}

/*export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    taskApi.createTask(todolistId, title)
        .then((res) => {
            let task = res.data.data.item
            dispatch(addTaskAC(task))
        })
}*/
