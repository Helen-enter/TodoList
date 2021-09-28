import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./AppWithRedux";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from '@material-ui/core'
import {Delete} from "@material-ui/icons";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./store/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";

type TodolistPropsType = {
    id: string
    filter: FilterValuesType
    title: string
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

function TodoList(props: TodolistPropsType) {

    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.id])
    const dispatch = useDispatch()

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
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(title, props.id)
    }

        let tasksForTodoList = tasks
        if (props.filter === 'completed') {
            tasksForTodoList = tasks.filter(t => t.isDone === true);
        }
        if (props.filter === 'active') {
            tasksForTodoList = tasks.filter(t => t.isDone === false);
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
                </h3>
                <AddItemForm addItem={(title) => {
                    dispatch(addTaskAC(title, props.id))
                }}/>

                <ul style={{
                    listStyle: 'none',
                    padding: '0px'
                }}>
                    {
                        tasksForTodoList.map((t) => {
                            const changeTaskTitle = (title: string) => {
                                dispatch(changeTaskTitleAC(t.id, title, props.id))
                            }
                            return <li key={t.id}>
                                <Checkbox
                                    color={'primary'}
                                    size={'small'}
                                    checked={t.isDone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        let newIsDoneValue = e.currentTarget.checked
                                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, props.id))}
                                    }
                                />
                                <EditableSpan
                                    title={t.title}
                                    changeTitle={changeTaskTitle}/>
                                <IconButton
                                    size={'small'}
                                    onClick={() => dispatch(removeTaskAC(t.id, props.id))}>
                                    <Delete/>
                                </IconButton>
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
                        onClick={setAllFilterValue}>All
                    </Button>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'active' ? 'secondary' : 'default'}
                        style={{margin: '0 3px'}}
                        onClick={setActiveFilterValue}>Active
                    </Button>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'completed' ? 'secondary' : 'default'}
                        style={{margin: '0 3px'}}
                        onClick={setCompletedFilterValue}>Completed
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TodoList;