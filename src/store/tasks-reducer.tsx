import React from "react";
import {TaskStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT, todoListId_1, todoListId_2} from "./todolist-reducer";

type RemoveTaskAT = {
    type: 'REMOVE-TASK'
    todoListId: string
    taskId: string
}

type AddTaskAT = {
    type: 'ADD-TASK'
    title: string
    todoListId: string
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
    [todoListId_1]: [
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'React', isDone: false}
    ],
    [todoListId_2]: [
        {id: v1(), title: 'Beer', isDone: true},
        {id: v1(), title: 'Fish', isDone: true},
        {id: v1(), title: 'Meat', isDone: true},
    ]
}

type ActionsType = RemoveTaskAT | AddTaskAT | ChangeTaskTitleAT | ChangeTaskStatusAT | AddTodoListAT | RemoveTodoListAT

const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId];
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todoListId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD-TASK' : {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            const newTask = {id: v1(), title: action.title, isDone: false}
            const newTasks = [newTask, ...tasks]
            stateCopy[action.todoListId] = newTasks
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
        default:
            return state;
    }
}

export default tasksReducer;

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskAT => ({
    type: 'REMOVE-TASK',
    todoListId: todoListId,
    taskId: taskId
})

export const addTaskAC = (title: string, todoListId: string): AddTaskAT => ({
    type: 'ADD-TASK',
    todoListId,
    title
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

