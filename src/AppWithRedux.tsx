import React, {useEffect} from 'react';
import './App.css';
import AddItemForm from "./AddItemForm";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    addTodolistTC, changeTodolistFilterAC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC, TodolistDomainType
} from "./store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import {addTaskTC, deleteTaskTC, updateTaskTC} from "./store/tasks-reducer";
import {TodoList} from "./TodoList";
import {RequestStatusType} from "./app/app-reducer";
import {ErrorSnackBar} from "./components/ErrorSnackBar/ErrorSnackBar";
import { FilterValuesType, TaskStatuses, TaskType } from './api/todolist-api';

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const todoLists = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todoLists)
    const tasks = useSelector<AppRootState, TaskStateType>(state => state.tasks)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    function removeTask(id: string, todolistId: string) {
        dispatch(deleteTaskTC(todolistId, id))
    }

    function addTask(title: string, todolistId: string) {
        dispatch(addTaskTC(title, todolistId))
    }

    function changeStatus(id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC(todolistId, {status}, id))
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTC(todolistId, {title: newTitle}, id))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }

    function removeTodolist(id: string) {
        dispatch(removeTodolistTC(id))
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatch(changeTodolistTitleTC(id, title))
    }

    function addTodolist(title: string) {
        dispatch(addTodolistTC(title))
    }

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)
    const todoListsComponents = todoLists.map(tL => {
        let allTodolistTasks = tasks[tL.id];
        return (
            <Grid item key={tL.id}>
                <Paper elevation={20} style={{padding: '30px'}}>
                    <TodoList
                        tasks={allTodolistTasks}
                        key={tL.id}
                        addTask={addTask}
                        removeTask={removeTask}
                        changeTaskStatus={changeStatus}
                        id={tL.id}
                        filter={tL.filter}
                        entityStatus={tL.entityStatus}
                        title={tL.title}
                        changeFilter={changeFilter}
                        removeTodoList={removeTodolist}
                        changeTodoListTitle={changeTodolistTitle}
                        changeTaskTitle={changeTaskTitle}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <ErrorSnackBar/>
            <AppBar position={'static'}>
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <IconButton
                        edge={'start'}
                        color={'inherit'}
                        aria-label={'menu'}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        TodoLists
                    </Typography>
                    <Button variant={'outlined'} color={'inherit'}>
                        Login
                    </Button>
                </Toolbar>
                {status === 'loading' ? <LinearProgress/> : <div/>}
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={5}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
