import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, removeTaskTC} from "./store/tasks-reducer";
import {Checkbox, IconButton} from "@mui/material";
import React, {ChangeEvent, useCallback} from "react";
import EditableSpan from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "./api/task-api";

export type TaskPropsType = {
    task: TaskType
    id: string
}
const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(changeTaskStatusAC(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.id))
    }, [dispatch, props.task.id, props.id])

    const onclickHandler = useCallback((/*todolistId, taskId*/) => {
       /* dispatch(removeTaskTC(todolistId, taskId))*/
        dispatch(removeTaskAC(props.task.id, props.id))
    }, [dispatch, props.task.id, props.id])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.task.id, title, props.id))
    }, [dispatch, props.task.id, props.id])

    return <li key={props.task.id}>
        <Checkbox
            color={'primary'}
            size={'small'}
            checked={props.task.status === TaskStatuses.Completed}
            onChange={onChangeHandler}
        />
        <EditableSpan
            title={props.task.title}
            changeTitle={changeTaskTitle}/>
        <IconButton
            size={'small'}
            onClick={onclickHandler}>
            <Delete/>
        </IconButton>
    </li>
})

export default Task;