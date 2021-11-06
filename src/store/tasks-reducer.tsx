import React from "react";
import {TaskStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {addTodoListAC, removeTodoListAC, setTodosAC, todoListId_1, todoListId_2} from "./todolist-reducer";
import {Dispatch} from "redux";
import {taskApi, TaskStatuses, TaskType} from "../api/task-api";

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
            ;

        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = state[action.todoListId];
            const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            stateCopy[action.todoListId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD-TASK' :/* {
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy;

            description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    isDone: boolean
        }*/
        {
            const stateCopy = {...state}
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                description: '',
                status: TaskStatuses.New,
                priority: 0,
                startDate: '',
                deadline: '',
                todoListId: action.todolistId,
                order: 0,
                addedDate: ''
            }
            const tasks = stateCopy[action.todolistId];
            const newTasks = [newTask, ...tasks];
            stateCopy[action.todolistId] = newTasks;
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
            stateCopy[action.todoListId] = tasks.map(t => t.id === action.taskId ? {...t, taskStatus: action.taskStatus} : t)

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

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
    type: 'SET-TASKS',
    tasks,
    todolistId
} as const)

export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE-TASK',
    todoListId: todoListId,
    taskId: taskId
} as const)

/*export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)*/
export const addTaskAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}

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

/*export const createTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    taskApi.createTask(title, todolistId)
        .then((res) => {
            let task = res.data.data.item
            dispatch(addTaskAC(task))
        })
}*/