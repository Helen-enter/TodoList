import React from "react";
import {FilterValuesType, TodolistType} from "../AppWithRedux";
import {v1} from "uuid";
import {todolistApi, TodoType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootState} from "./store";

export type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    todoListId: string
}

export type AddTodoListAT = {
    type: 'ADD-TODOLIST'
    title: string
    id: string
}

export type ChangeTodoListTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    todoListId: string
}

export type ChangeTodoListFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterValuesType
    todoListId: string
}

export const todoListId_1 = v1()
export const todoListId_2 = v1()

const initialState: Array<TodolistType> = [
    {id: todoListId_1, title: 'What to learn', filter: 'all'},
    {id: todoListId_2, title: 'What to buy', filter: 'all'}
]

type ActionsType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListTitleAT | ChangeTodoListFilterAT | SetTodosActionType

const todolistsReducer = (todoLists: Array<TodolistType> = initialState, action: ActionsType): Array<TodolistType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST' :
            return todoLists.filter(tL => tL.id !== action.todoListId)
        case 'ADD-TODOLIST' :
            return [{
                id: action.id, title: action.title, filter: 'all'
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

export const removeTodoListAC = (todoListId: string): RemoveTodoListAT => ({
    type: 'REMOVE-TODOLIST',
    todoListId: todoListId
})

export const addTodoListAC = (title: string): AddTodoListAT => ({
    type: 'ADD-TODOLIST',
    title,
    id: v1()
})


export const changeTodoListTitleAC = (title: string, todoListId: string): ChangeTodoListTitleAT => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title,
    todoListId
})

export const changeTodoListFilterAC = (filter: FilterValuesType, todoListId: string): ChangeTodoListFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter,
    todoListId
})

export const setTodosAC = (todos: Array<TodoType>) => {
    return {
        type: 'SET-TODOS',
        todos
    } as const
}

export type SetTodosActionType = ReturnType<typeof setTodosAC>

export const setTodosTC = () => (dispatch: Dispatch, getState: () => AppRootState): void => {
    todolistApi.getTodo()
        .then((res)=>{
            let todos = res.data
            dispatch(setTodosAC(todos))
        })
}