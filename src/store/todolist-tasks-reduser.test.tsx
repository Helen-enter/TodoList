import React from "react";
import {addTodolistAC, TodolistDomainType, todolistsReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";
import { TaskStateType } from "../AppWithRedux";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = addTodolistAC({
        title: "new todolist",
        id:'',
        order: 0,
        addedDate: ''
    });

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
