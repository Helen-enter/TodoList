import React from "react";
// @ts-ignore
import {action} from '@storybook/addon-actions';
// @ts-ignore
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Task from "./Task";
import {v1} from "uuid";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./store/tasks-reducer";
import {Provider} from "react-redux";
import {store} from "./store/store";
import {TaskPriorities, TaskStatuses} from "./api/task-api";


export default {
    title: 'TodoLists/Task',
    component: Task,
    args: {
        changeTaskStatusAC: action('changeTaskStatusAC'),
        changeTaskTitleAC: action('changeTaskTitleAC'),
        removeTaskAC: action('removeTaskAC')
    }
} as ComponentMeta<typeof Task>

type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type TaskPropsType = {
    task: TaskType
    id: string
}


const Template: ComponentStory<typeof Task> = (args: TaskPropsType) => <Provider store={store}>
    <Task {...args} />
</Provider>

export const TaskIsDoneStories = Template.bind({});

TaskIsDoneStories.args = {
    task: {id: v1(), title: 'js', status: TaskStatuses.Completed,
        description: '', priority: 0, startDate: '', deadline: '', todoListId: v1(), order: 0, addedDate: ''},
    id: 'todo1',
};

export const TaskIsNotDoneStories = Template.bind({});

TaskIsNotDoneStories.args = {
    task: {id: v1(), title: 'js', status: TaskStatuses.New,
        description: '', priority: 0, startDate: '', deadline: '', todoListId: v1(), order: 0, addedDate: ''},
    id: 'todo1',
};

