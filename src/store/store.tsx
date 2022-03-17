import {applyMiddleware, combineReducers, createStore} from "redux";
import React from "react";
import thunk from "redux-thunk";
import {appReducer} from "../app/app-reducer";
import { todolistsReducer } from "./todolist-reducer";
import { tasksReducer } from "./tasks-reducer";

const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootState = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;