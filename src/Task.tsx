import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, removeTaskTC} from "./store/tasks-reducer";
import {Checkbox, IconButton} from "@mui/material";
import React, {ChangeEvent, useCallback} from "react";
import EditableSpan from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskType} from "./TodoList";

export type TaskPropsType = {
    task: TaskType
    id: string
}
const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()

    const onChangeHandler = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(changeTaskStatusAC(props.task.id, newIsDoneValue, props.id))
    }, [dispatch, props.task.id, props.id])

/*    const onclickHandler = useCallback((todolistId: string, taskId: string) => {
        dispatch(removeTaskTC(todolistId, taskId))
        }, [])*/
    const onclickHandler = useCallback(() => {
            dispatch(removeTaskAC(props.task.id, props.id))
        }, [dispatch, props.task.id, props.id])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.task.id, title, props.id))
    }, [dispatch, props.task.id, props.id])


    return <li key={props.task.id}>
        <Checkbox
            color={'primary'}
            size={'small'}
            checked={props.task.isDone}
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