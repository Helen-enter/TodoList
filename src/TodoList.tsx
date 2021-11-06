import React, {useCallback, useEffect} from "react";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from '@mui/material'
import {Delete} from "@mui/icons-material";
import {
    changeTaskTitleAC,
    fetchTasksTC,
    removeTaskAC
} from "./store/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";
import {TaskStatuses, TaskType} from "./api/task-api";
import {FilterValuesType} from "./store/todolist-reducer";

export type TodolistPropsType = {
    id: string
    filter: FilterValuesType
    title: string
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    addTask: (title: string, id: string) => void
}

export const TodoList = React.memo((props: TodolistPropsType) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [])

    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.id])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id])

    const removeTodoList = () => props.removeTodoList(props.id)

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, props.id)
    }, [props.changeTodoListTitle, props.id])

    const setAllFilterValue = useCallback(() => {
        props.changeFilter('all', props.id)
    }, [props.changeFilter, props.id])
    const setActiveFilterValue = useCallback(() => {
        props.changeFilter('active', props.id)
    }, [props.changeFilter, props.id])
    const setCompletedFilterValue = useCallback(() => {
        props.changeFilter('completed', props.id)
    }, [props.changeFilter, props.id])

    let tasksForTodoList = tasks

    if (props.filter === 'completed') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    if (props.filter === 'active') {
        tasksForTodoList = tasks.filter(t => t.status === TaskStatuses.New);
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
                <AddItemForm addItem={addTask}/>

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
                        color={props.filter === 'all' ? 'secondary' : 'inherit'}
                        style={{margin: '0 3px'}}
                        onClick={setAllFilterValue}>All
                    </Button>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'active' ? 'secondary' : 'inherit'}
                        style={{margin: '0 3px'}}
                        onClick={setActiveFilterValue}>Active
                    </Button>
                    <Button
                        size={'small'}
                        variant={'contained'}
                        color={props.filter === 'completed' ? 'secondary' : 'inherit'}
                        style={{margin: '0 3px'}}
                        onClick={setCompletedFilterValue}>Completed
                    </Button>
                </div>
            </div>
        </div>
    )
})

export default TodoList;

