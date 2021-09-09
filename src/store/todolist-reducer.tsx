import React from "react";
import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    todoListId: string
}

type AddTodoListAT = {
    type: 'ADD-TODOLIST'
    title: string
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

type ActionsType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListTitleAT | ChangeTodoListFilterAT

const todolistsReducer = (todoLists: Array<TodolistType>, action: ActionsType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST' :
            return todoLists.filter(tL => tL.id !== action.todoListId)
        case 'ADD-TODOLIST' :
            const newTodoListID = v1()
            return [...todoLists, {
                id: newTodoListID, title: action.title, filter: 'all'
            }]
        case 'CHANGE-TODOLIST-TITLE':
            return todoLists.map(tL => tL.id === action.todoListId ? {...tL, title: action.title} : tL)
        case 'CHANGE-TODOLIST-FILTER':
            return todoLists.map(tL => tL.id === action.todoListId ? {...tL, filter: action.filter} : tL)
        default:
            return todoLists;
    }
}

export default todolistsReducer;

export const removeTodoListAC = (todoListId: string): RemoveTodoListAT => ({
    type: 'REMOVE-TODOLIST',
    todoListId: todoListId
})

export const AddTodoListAC = (title: string): AddTodoListAT => ({
    type: 'ADD-TODOLIST',
    title
})

export const ChangeTodoListTitleAC = (title: string, todoListId: string): ChangeTodoListTitleAT => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title,
    todoListId
})

export const ChangeTodoListFilterAC = (filter: FilterValuesType, todoListId: string): ChangeTodoListFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter,
    todoListId
})