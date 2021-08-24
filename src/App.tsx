import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'completed' | 'active';

type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

type TaskStateType = {
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

    const todoListsComponents = todoLists.map(tL => {
        let tasksForTodoList = tasks[tL.id]
        if (tL.filter === 'completed') {
            tasksForTodoList = tasks[tL.id].filter(t => t.isDone === true);
        }
        if (tL.filter === 'active') {
            tasksForTodoList = tasks[tL.id].filter(t => t.isDone === false);
        }

        return (
            <TodoList
                key={tL.id}
                id={tL.id}
                filter={tL.filter}
                title={tL.title}
                tasks={tasksForTodoList}
                removeTask={removeTask}
                changeFilter={changeFilter}
                changeTaskStatus={changeTaskStatus}
                addTask={addTask}
                removeTodoList={removeTodoList}
            />
        )
    })

    return (
        <div className="App">
            {todoListsComponents}
        </div>
    );
}

export default App;
