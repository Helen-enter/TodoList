import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type FilterValuesType = 'all' | 'completed' | 'active';

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListId_1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'React', isDone: false}
        ],
        [todoListId_2]: [
            {id: v1(), title: 'Beer', isDone: true},
            {id: v1(), title: 'Fish', isDone: true},
            {id: v1(), title: 'Meat', isDone: true},
        ]
    })

    const [todoLists, setTodoLists] = useState<Array<TodolistType>>([
        {id: todoListId_1, title: 'What to learn', filter: 'all'},
        {id: todoListId_2, title: 'What to buy', filter: 'all'}
    ])

    const removeTask = (id: string, todoListId: string) => {
        const todoListsTasks = tasks[todoListId]
        tasks[todoListId] = todoListsTasks.filter(t => t.id !== id)
        setTasks({...tasks});
    }
    const addTask = (title: string, todoListId: string) => {
        const newTask: TaskType = {
            id: v1(),
            title,
            isDone: false
        }
        tasks[todoListId] = [newTask, ...tasks[todoListId]]
        setTasks({...tasks});
    }
    const changeTaskStatus = (id: string, isDone: boolean, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map(t => t.id === id ? {...t, isDone: isDone} : t)
        setTasks({...tasks})
    }
    function changeFilter(filter: FilterValuesType, todoListId: string) {
        setTodoLists(todoLists.map(tL => tL.id === todoListId ? {...tL, filter: filter} : tL))
    }

    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(tL => tL.id !== todoListId))
        const copyTasks = {...tasks}
        delete tasks[todoListId]
        setTasks(copyTasks)
    }
    const addTodoList = (title: string) => {
        const newTodoListID = v1()
        const newTodoList: TodolistType = {
            id: newTodoListID, title, filter: 'all'
        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoListID]: []})
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        setTodoLists(todoLists.map(tL => tL.id === todoListId ? {...tL, title} : tL))
    }
    const changeTaskTitle = (taskID: string, title: string, todoListID: string) => {
        tasks[todoListID] = tasks[todoListID].map(t => t.id === taskID ? {...t, title} : t)
        setTasks({...tasks})
    }
    const todoListsComponents = todoLists.map(tL => {
        let tasksForTodoList = tasks[tL.id]
        if (tL.filter === 'completed') {
            tasksForTodoList = tasks[tL.id].filter(t => t.isDone === true);
        }
        if (tL.filter === 'active') {
            tasksForTodoList = tasks[tL.id].filter(t => t.isDone === false);
        }

        return (
            <Grid item key={tL.id}>
                <Paper elevation={20} style={{padding: '30px'}}>
                    <TodoList
                        id={tL.id}
                        filter={tL.filter}
                        title={tL.title}
                        tasks={tasksForTodoList}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        changeTaskStatus={changeTaskStatus}
                        addTask={addTask}
                        removeTodoList={removeTodoList}
                        changeTaskTitle={changeTaskTitle}
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

export default App;
