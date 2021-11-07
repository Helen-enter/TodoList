import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TaskStatuses, TaskType} from "./api/task-api";
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
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    FilterValuesType,
    removeTodoListAC, setTodoListsTC, TodolistDomainType
} from "./store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import ErrorSnackBar from "./components/ErrorSnackBar/ErrorSnackBar";
import {createTaskTC, removeTaskTC, updateTaskStatusTC} from "./store/tasks-reducer";
import {TodoList} from "./TodoList";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {

    useEffect(() => {
        dispatch(setTodoListsTC())
    }, [])

    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todoLists)
    const tasks = useSelector<AppRootState, TaskStateType>(state => state.tasks)

     const addTask = useCallback(function (todolistId, title) {
         dispatch(createTaskTC(todolistId, title))
     }, []);

    const removeTask = useCallback(function (todolistId, taskId) {
        dispatch(removeTaskTC(todolistId, taskId))
    }, [])

    /*const addTask = useCallback(function (title: string, todolistId: string) {
        const action = addTaskAC(title, todolistId);
        dispatch(action);
    }, []);*/

    const changeTaskStatus = useCallback(function (id, status: TaskStatuses, todolistId) {
        dispatch(updateTaskStatusTC(todolistId, id, status))
    }, []);

    const changeFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
        const action = changeTodoListFilterAC(filter, todoListId)
        dispatch(action)
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        const action = removeTodoListAC(todoListId)
        dispatch(action)
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        const action = addTodoListAC(title)
        dispatch(action)
    }, [dispatch])

    const changeTodoListTitle = useCallback((title: string, todoListId: string) => {
        const action = changeTodoListTitleAC(title, todoListId)
        dispatch(action)
    }, [dispatch])


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
                        changeTaskStatus={changeTaskStatus}
                        id={tL.id}
                        filter={tL.filter}
                        title={tL.title}
                        changeFilter={changeFilter}
                        removeTodoList={removeTodoList}
                        changeTodoListTitle={changeTodoListTitle}
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
                <LinearProgress/>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
