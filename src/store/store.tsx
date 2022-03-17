import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {appReducer} from "../app/app-reducer";
import { todolistsReducer } from "./todolist-reducer";
import { tasksReducer } from "./tasks-reducer";
import {authReducer} from "../features/auth-reducer";

const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootState = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;