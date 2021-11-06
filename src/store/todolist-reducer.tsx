import React from "react";
import {v1} from "uuid";
import {todolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootState} from "./store";
import {TodolistType} from "../api/task-api";

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todoListId_1 = v1()
export const todoListId_2 = v1()

const initialState: Array<TodolistDomainType> = [
    {id: todoListId_1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todoListId_2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}
]

type ActionsType = ReturnType<typeof removeTodoListAC> | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof changeTodoListTitleAC> | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof setTodosAC>

const todolistsReducer = (todoLists: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST' :
            return todoLists.filter(tL => tL.id !== action.todoListId)
        case 'ADD-TODOLIST' :
            return [{
                id: action.id, title: action.title, filter: 'all', addedDate: '', order: 0
            }, ...todoLists]
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tL => tL.id === action.todoListId ? {...tL, title: action.title} : tL)
        case 'CHANGE-TODOLIST-FILTER':
            return todoLists.map(tL => tL.id === action.todoListId ? {...tL, filter: action.filter} : tL)
        case "SET-TODOS":
            return action.todos.map(tl => {
                return {...tl, filter: 'all'}
            })
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

export const setTodosAC = (todos: Array<TodolistType>) => {
    return {
        type: 'SET-TODOS',
        todos
    } as const
}

export const setTodosTC = () => (dispatch: Dispatch, getState: () => AppRootState): void => {
    todolistApi.getTodo()
        .then((res) => {
            let todos = res.data
            dispatch(setTodosAC(todos))
        })
}