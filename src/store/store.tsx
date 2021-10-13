import {combineReducers, createStore} from "redux";
import React from "react";
import todolistsReducer from "./todolist-reducer";
import tasksReducer from "./tasks-reducer";

const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer
})

export const store = createStore(rootReducer)

export type AppRootState = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;