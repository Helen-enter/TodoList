import {FilterValuesType, todolistsAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setStatusAC, setErrorAC} from "../app/app-reducer";
import {AxiosError} from "axios";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | setTodolistsACType
    | changeTodolistEntityStatusACType

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomainType = {
                ...action.todolist,
                filter: 'all',
                entityStatus: 'idle'
            }
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case 'TODOLIST/CHANGE-TODOLIST-ENTITY-STATUS': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.entityStatus = action.entityStatus;
            }
            return [...state]
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => {
                return {
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle'
                }
            })
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => {
    return {
        type: 'TODOLIST/CHANGE-TODOLIST-ENTITY-STATUS',
        id,
        entityStatus
    } as const
}

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type setTodolistsACType = ReturnType<typeof setTodolistsAC>
export type changeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            const action = setTodolistsAC(res.data)
            dispatch(setStatusAC('succeeded'))
            dispatch(action)
        })
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(id, 'loading'))
    todolistsAPI.deleteTodolist(id)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setStatusAC('succeeded'))
                dispatch(removeTodolistAC(id))
            } else {
                dispatch(setErrorAC(res.data.messages[0]))
            }
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(setStatusAC('succeeded'))
                    dispatch(addTodolistAC(res.data.data.item))
                } else {
                    dispatch(setErrorAC(res.data.messages[0]))
                }
            }
        )
        .catch((error: AxiosError) => {
            dispatch(setErrorAC(error.message))
            dispatch(setStatusAC('failed'))
        })
}

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.updateTodolist(id, title)
        .then((res) => {
                dispatch(setStatusAC('succeeded'))
                dispatch(changeTodolistTitleAC(id, title))
            }
        )
}