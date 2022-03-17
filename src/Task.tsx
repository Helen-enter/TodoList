import {Checkbox, IconButton} from "@mui/material";
import React, {ChangeEvent, useCallback} from "react";
import EditableSpan from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType } from "./api/todolist-api";
import {removeTaskAC, updateTaskAC, updateTaskTC } from "./store/tasks-reducer";
import {useDispatch} from "react-redux";


type TaskPropsType = {
    task: TaskType
    id: string
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()
    const onClickHandler = useCallback(() => {
        dispatch(removeTaskAC(props.id, props.task.id))
    }, [dispatch, props.task.id, props.id])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(props.task.id, {status: newIsDoneValue}, props.id))
    }, [dispatch, props.task.id, props.id])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskAC(props.task.id,{ title}, props.id))
    }, [dispatch, props.task.id, props.id])

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan title={props.task.title} changeTitle={changeTaskTitle}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})

export default Task;