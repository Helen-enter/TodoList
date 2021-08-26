import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import App, {FilterValuesType} from "./App";
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";

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
    changeTaskTitle: (taskID: string,title: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

function TodoList(props: TodolistPropsType) {
    /*    const [title, setTitle] = useState<string>('')
        const [error, setError] = useState<boolean>(false)*/

    /*    const addTask = () => {
            const trimmedTitle = title.trim()
            if (trimmedTitle) {
                props.addTask(trimmedTitle, props.id)
            } else {
                setError(true)
            }
            setTitle('')
        }*/
    /*    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
            setError(false)
            setTitle(e.currentTarget.value)}
        const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                addTask()
            }
        }*/
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
    /*    const errorMsg = error
            ? <div style={{color: 'red'}}>Title is required!</div>
            : null*/
    //const changeTaskTitle = (title: string) => props.changeTaskTitle(t.id, title, props.id)
    return (
        <div>
            <div>
                <h3>
                    <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                    <button onClick={removeTodoList}>x</button>
                </h3>
                <AddItemForm addItem={addTask}/>
                {/*<div>
                    <input
                        value={title}
                        onChange={changeTitle}
                        onKeyPress={onKeyPressAddTask}
                        className={error ? 'error' : ''}
                    />
                    <button onClick={addTask}>+</button>
                    {errorMsg}
                </div>*/}
                <ul>
                    {
                        props.tasks.map((t) => {
                            const changeTaskTitle = (title: string) => props.changeTaskTitle(t.id, title, props.id)
                            return <li key={t.id}><input
                                type="checkbox"
                                checked={t.isDone}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)}
                            />
                                {/*<span>{t.title}</span>*/}
                                <EditableSpan
                                    title={t.title}
                                    changeTitle={changeTaskTitle}/>
                                <button onClick={() => props.removeTask(t.id, props.id)}>x</button>
                            </li>
                        })
                    }
                </ul>
                <div>
                    <button
                        className={props.filter === 'all' ? 'active-filter' : ''}
                        onClick={setAllFilterValue}>All
                    </button>
                    <button
                        className={props.filter === 'active' ? 'active-filter' : ''}
                        onClick={setActiveFilterValue}>Active
                    </button>
                    <button
                        className={props.filter === 'completed' ? 'active-filter' : ''}
                        onClick={setCompletedFilterValue}>Completed
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TodoList;