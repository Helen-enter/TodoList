import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import App, {FilterValuesType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from '@material-ui/core'
import {Dashboard, Delete} from "@material-ui/icons";

type TodolistPropsType = {
    id: string
    filter: FilterValuesType
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoListId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (taskID: string, title: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

function TodoList(props: TodolistPropsType) {

    const setAllFilterValue = () => {
        props.changeFilter('all', props.id)
    }
    const setActiveFilterValue = () => {
        props.changeFilter('active', props.id)
    }
    const setCompletedFilterValue = () => {
        props.changeFilter('completed', props.id)
    }
    const removeTodoList = () => props.removeTodoList(props.id)
    const addTask = (title: string) => props.addTask(title, props.id)
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(title, props.id)
    }

    return (
        <div>
            <div>
                <h3>
                    <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                    <IconButton
                        size={'small'}
                        onClick={removeTodoList}>
                        <Delete/>
                    </IconButton>
                    {/*<button onClick={removeTodoList}>x</button>*/}
                </h3>
                <AddItemForm addItem={addTask}/>

                <ul style={{
                    listStyle: 'none',
                    padding: '0px'
                }}>
                    {
                        props.tasks.map((t) => {
                            const changeTaskTitle = (title: string) => props.changeTaskTitle(t.id, title, props.id)
                            return <li key={t.id}>
                                <Checkbox
                                    color={'primary'}
                                    size={'small'}
                                    checked={t.isDone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)}
                                />
                                <EditableSpan
                                    title={t.title}
                                    changeTitle={changeTaskTitle}/>
                                <IconButton
                                    size={'small'}
                                    onClick={() => props.removeTask(t.id, props.id)}>
                                    <Delete/>
                                </IconButton>
                                {/*<button onClick={() => props.removeTask(t.id, props.id)}>x</button>*/}
                            </li>
                        })
                    }
                </ul>
                <div>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'all' ? 'secondary' : 'default'}
                        style={{margin: '0 3px'}}
                        // className={props.filter === 'all' ? 'active-filter' : ''}
                        onClick={setAllFilterValue}>All
                    </Button>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'active' ? 'secondary' : 'default'}
                        style={{margin: '0 3px'}}
                        // className={props.filter === 'active' ? 'active-filter' : ''}
                        onClick={setActiveFilterValue}>Active
                    </Button>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'completed' ? 'secondary' : 'default'}
                        style={{margin: '0 3px'}}
                        // className={props.filter === 'completed' ? 'active-filter' : ''}
                        onClick={setCompletedFilterValue}>Completed
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TodoList;