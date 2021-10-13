import React from "react";
import {Provider} from "react-redux";
import {AppRootState, store} from "../../store/store";
import { combineReducers, createStore } from "redux";
import tasksReducer from "../../store/tasks-reducer";
import todolistsReducer from "../../store/todolist-reducer";
import { v1 } from "uuid";
import {FilterValuesType} from "../../AppWithRedux";

const rootReducer = combineReducers({
    todoLists: todolistsReducer,
    tasks: tasksReducer
})

const initialGlobalState: AppRootState = {
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true}
        ]
    },
    todoLists: [
        {id: "todolistId1", title: "What to learn", filter: "all"},
        {id: "todolistId2", title: "What to buy", filter: "all"}
    ] ,
};


export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState);


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}