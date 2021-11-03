import React from "react";
// @ts-ignore
import {action} from '@storybook/addon-actions';
// @ts-ignore
import {ComponentStory, ComponentMeta} from '@storybook/react';
import Task, {/*TaskPropsType*/} from "./Task";
import {v1} from "uuid";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./store/tasks-reducer";
import {Provider} from "react-redux";
import {store} from "./store/store";
//import {TaskType} from "./TodoList";


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
    id: string
    title: string
    isDone: boolean
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
    task: {id: v1(), title: 'js', isDone: true},
    id: 'todo1',
};

export const TaskIsNotDoneStories = Template.bind({});
TaskIsNotDoneStories.args = {
    task: {id: v1(), title: 'js', isDone: false},
    id: 'todo1',
};

