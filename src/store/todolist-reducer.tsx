import React from "react";
import {v1} from "uuid";
import {todolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootState} from "./store";
import {TodolistType} from "../api/task-api";
import {RequestStatusType, setStatusAC} from "../app/app-reducer";

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todoListId_1 = v1()
export const todoListId_2 = v1()

const initialState: Array<TodolistDomainType> = [
    {id: todoListId_1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
    {id: todoListId_2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
]

type ActionsType = ReturnType<typeof removeTodoListAC> | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof changeTodoListTitleAC> | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof setTodosAC> | ReturnType<typeof changeTodolistEntityStatusAC>

const todolistsReducer = (todoLists: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST' :
            return todoLists.filter(tL => tL.id !== action.todoListId)
        case 'ADD-TODOLIST' :
            return [{
                id: action.id, title: action.title, filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'
            }, ...todoLists]
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tL => tL.id === action.todoListId ? {...tL, title: action.title} : tL)
        case 'CHANGE-TODOLIST-FILTER':
            return todoLists.map(tL => tL.id === action.todoListId ? {...tL, filter: action.filter} : tL)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => {
                return {...tl, filter: 'all', entityStatus: 'idle'}
            })
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return todoLists.map(tL => tL.id === action.id ? {...tL, entityStatus: action.entityStatus} : tL)
        default:
            return todoLists;
    }
}

export default todolistsReducer;

export const removeTodoListAC = (todoListId: string) => ({
    type: 'REMOVE-TODOLIST',
    todoListId: todoListId
} as const)

export const addTodoListAC = (title: string) => ({
    type: 'ADD-TODOLIST',
    title,
    id: v1()
} as const)


export const changeTodoListTitleAC = (title: string, todoListId: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title,
    todoListId
} as const)

export const changeTodoListFilterAC = (filter: FilterValuesType, todoListId: string) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter,
    todoListId
} as const)

export const setTodosAC = (todolists: Array<TodolistType>) => {
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        id,
        entityStatus
    } as const
}

export const setLoadingHelper = <T extends Dispatch, P>(API_Method: () => Promise<P>, setData: (res: P) => void, dispatch: T) => {
    dispatch(setStatusAC('loading'))
    API_Method()
        .then((res) => {
            setData(res)
            dispatch(setStatusAC('succeeded'))
        })
}


export const setTodoListsTC = () => (dispatch: Dispatch, getState: () => AppRootState): void => {
    // dispatch(setStatusAC('loading'))
    // todolistApi.getTodo()
    //     .then((res) => {
    //         let todoLists = res.data
    //         dispatch(setTodosAC(todoLists))
    //         dispatch(setStatusAC('succeeded'))
    //     })
    setLoadingHelper(todolistApi.getTodo,
        (res) => dispatch(setTodosAC(res.data)),
        dispatch
    )
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistApi.deleteTodo(todolistId)
        .then((res) => {
            dispatch(removeTodoListAC(todolistId))
            dispatch(setStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        })
}