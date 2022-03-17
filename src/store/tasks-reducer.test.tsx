import React from "react";
import {
    addTaskAC,
    removeTaskAC,
    tasksReducer,
    updateTaskAC,
} from "./tasks-reducer";
import { TaskStateType } from "../AppWithRedux";
import {TaskPriorities, TaskStatuses } from "../api/todolist-api";
import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";

let startState: TaskStateType;

beforeEach(() => {
    startState = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId1", order: 0, addedDate: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId1", order: 0, addedDate: '' },
            { id: "3", title: "React", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId1", order: 0, addedDate: '' }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId2", order: 0, addedDate: '' },
            { id: "2", title: "milk", status: TaskStatuses.Completed,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId2", order: 0, addedDate: ''},
            { id: "3", title: "tea", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId2", order: 0, addedDate: '' }
        ]
    }
})


test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId1", order: 0, addedDate: ''  },
            { id: "2", title: "JS", status: TaskStatuses.Completed,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId1", order: 0, addedDate: '' },
            { id: "3", title: "React", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId1", order: 0, addedDate: ''  }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId2", order: 0, addedDate: ''  },
            { id: "3", title: "tea", status: TaskStatuses.New,
                description: '', priority: 0, startDate: '', deadline: '', todoListId: "todolistId2", order: 0, addedDate: ''  }
        ]
    });
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC({
        todoListId: "todolistId2",
        title: "juice",
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        id: '',
        priority: TaskPriorities.Low,
        startDate: '',
        order: 0
    });

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC("2", {status: TaskStatuses.New}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});


test('title of specified task should be changed', () => {

    const action = updateTaskAC("2", {title: "MilkyWay"}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("MilkyWay");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new property with new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        id: '',
        title: "new todolist",
        addedDate: '',
        order: 0
    });

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(3);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});