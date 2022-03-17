import React from "react";
import {Provider} from "react-redux";
import {AppRootState} from "../../store/store";
import { combineReducers, createStore } from "redux";
import { todolistsReducer } from "../../store/todolist-reducer";
import {tasksReducer} from "../../store/tasks-reducer";
import {appReducer} from "../../app/app-reducer";
import {authReducer} from "../../features/auth-reducer";


const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootState = {
    tasks: {},
    todoLists: [] ,
    app: {
        error: null,
        status: 'idle',
        isInitialized: false
    },
    auth: {isLoggedIn: false}
};


export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState);


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}