import React, {useCallback} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC
} from "./store/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store/store";

export type FilterValuesType = 'all' | 'completed' | 'active';

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootState, Array<TodolistType>>(state => state.todoLists)

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

        return (
            <Grid item key={tL.id}>
                <Paper elevation={20} style={{padding: '30px'}}>
                    <TodoList
                        key={tL.id}
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
