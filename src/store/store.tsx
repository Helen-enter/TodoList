import {combineReducers, createStore} from "redux";
import React from "react";
import todolistsReducer from "./todolist-reducer";
import tasksReducer from "./tasks-reducer";
import {TodolistType} from "../AppWithRedux";
import {TaskStateType} from "../AppWithRedux";

const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer)

// @ts-ignore
window.store = store;