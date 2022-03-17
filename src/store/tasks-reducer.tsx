import { AxiosError } from "axios";
import { Dispatch } from "redux";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolist-api";
import { setStatusAC, setErrorAC } from "../app/app-reducer";
import { TaskStateType } from "../AppWithRedux";
import { handleServerAppError } from "../utils/error-utils";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    setTodolistsACType,
} from "./todolist-reducer";
import {AppRootState} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'UPDATE-TASK',
    apiModel: UpdateTaskModelDomainType,
    todolistId: string,
    taskId: string
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | setTodolistsACType
    | setTasksACType

const initialState: TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask: TaskType = action.task
            const tasks = stateCopy[newTask.todoListId];
            const newTasks = [newTask, ...tasks];
            stateCopy[newTask.todoListId] = newTasks;
            return stateCopy;
        }
        case 'UPDATE-TASK': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map((t) => t.id === action.taskId ? {...t, ...action.apiModel} : t)
            state[action.todolistId] = newTasksArray
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS' : {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET-TASKS": {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const updateTaskAC = (taskId: string, apiModel: UpdateTaskModelDomainType, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'UPDATE-TASK', taskId, apiModel, todolistId}
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setStatusAC('succeeded'))
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(setStatusAC('succeeded'))
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setStatusAC('succeeded'))
                dispatch(addTaskAC(res.data.data.item))
            } else {
                dispatch(setErrorAC(res.data.messages[0]))
            }
            dispatch(setStatusAC('failed'))
        })
        .catch((error: AxiosError) => {
            handleServerAppError(dispatch, error.message)
        })
}

export const updateTaskTC = (todolistId: string, domainModel: UpdateTaskModelDomainType, taskId: string) => (dispatch: Dispatch, getState: () => AppRootState) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.warn('task not found in the state')
        return;
    }
    const apiModel: UpdateTaskModelType = {
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        title: task.title,
        description: task.description,
        ...domainModel
    }

    dispatch(setStatusAC('loading'))
    todolistsAPI.updateTask(todolistId, taskId, apiModel)
        .then((res) => {
            dispatch(setStatusAC('succeeded'))
            dispatch(updateTaskAC(taskId, domainModel, todolistId))
        })
}

export type setTasksACType = ReturnType<typeof setTasksAC>

export type UpdateTaskModelDomainType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}