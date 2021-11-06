import React from "react";
import axios from "axios";
import {TodolistType} from "./task-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'fb3a72fc-b182-466b-85fc-baa514f38724'
    }

})

export const todolistApi = {
    getTodo() {
        return instance.get<Array<TodolistType>>('todo-lists',)
    },
    createTodo(title: string) {
        return instance.post<{title: string},CommonResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodo(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodo(todolistId: string) {
        return instance.put<{title: string}, CommonResponseType>(`todo-lists/${todolistId}`, {title: 'REACT>>>>>>>>>'})
    }
}

type CommonResponseType<T={}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: T
}