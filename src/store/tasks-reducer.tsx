import React from "react";
import {TaskStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {addTodoListAC, removeTodoListAC, setTodosAC, todoListId_1, todoListId_2} from "./todolist-reducer";
import {Dispatch} from "redux";
import {taskApi, TaskStatuses, TaskType} from "../api/task-api";
import {AppRootState} from "./store";

const initialState: TaskStateType = {
     [todoListId_1]: [],
     [todoListId_2]: []
}

type ActionsType = ReturnType<typeof removeTaskAC> | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskTitleAC> | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof addTodoListAC> | ReturnType<typeof removeTodoListAC>
    | ReturnType<typeof setTodosAC> | ReturnType<typeof setTasksAC>

const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId];
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todoListId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD-TASK' : {
            const stateCopy = {...state}
            const newTask: TaskType = {
                id: v1(),
                title: action.task.title,
                description: '',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                todoListId: action.task.todoListId,
                order: 0,
                addedDate: ''
            }
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [newTask, ...tasks];
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
            stateCopy[action.todoListId] = tasks.map(t => t.id === action.taskId ? {
                ...t,
                taskStatus: action.taskStatus
            } : t)

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

        case "SET-TODOLISTS":
            let copyState = {...state}
            action.todolists.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState

        default:
            return state;
    }
}


export default tasksReducer;

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({
    type: 'SET-TASKS',
    todolistId,
    tasks
} as const)

export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE-TASK',
    todoListId: todoListId,
    taskId: taskId
} as const)

export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
/*export const addTaskAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}*/

export const changeTaskStatusAC = (taskId: string, taskStatus: number, todoListId: string) => ({
    type: 'CHANGE-TASK-STATUS',
    taskId,
    taskStatus,
    todoListId
} as const)

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    todoListId,
    taskId,
    title
} as const)

export const AddTodolistAC = (title: string) => ({
    type: 'ADD-TODOLIST',
    title,
    id: v1()
} as const)

export const RemoveTodolistAC = (todoListId: string) => ({
    type: 'REMOVE-TODOLIST',
    todoListId
} as const)

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    taskApi.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(todolistId, tasks))
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    taskApi.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(todolistId, taskId))
        })
}

export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    taskApi.createTask(todolistId, title)
        .then((res) => {
            let task = res.data.data.item
            dispatch(addTaskAC(task))
        })
}

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootState) => {

        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })

        if (task) {
            taskApi.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            }).then(() => {
                const action = changeTaskStatusAC(taskId, status, todolistId)
                dispatch(action)
            })
        }
    }
}