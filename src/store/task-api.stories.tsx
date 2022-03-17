import React, {useEffect, useState} from "react";
import {TaskPriorities, TaskStatuses, todolistsAPI} from "../api/todolist-api";

export default {
    title: 'API-TASK'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = "21169ffb-a3cb-4795-8e9c-df0b88afeba8"
    useEffect(() => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = "21169ffb-a3cb-4795-8e9c-df0b88afeba8"
    useEffect(() => {
        const title = 'smile'
        todolistsAPI.createTask(todolistId, title)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = "21169ffb-a3cb-4795-8e9c-df0b88afeba8";
    const taskId = '77135ee8-ff1c-4051-9528-a0b43a7e01ab'
    useEffect(() => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = "21169ffb-a3cb-4795-8e9c-df0b88afeba8";
    const taskId = "3c3fe61f-ce68-42c2-8eff-0744cdddbf29"
    let title = 'Angular'
    useEffect(() => {
        todolistsAPI.updateTask(todolistId, taskId, {
            title,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            status: TaskStatuses.New,
            description: ''
        })
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}