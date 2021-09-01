import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, IconButton, TextField} from "@material-ui/core";
import {AddBox, Delete} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

function AddItemForm(props: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)}
    // const errorMsg = error
    //     ? <div style={{color: 'red'}}>Title is required!</div>
    //     : null
    const addItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle('')
    }

    const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addItem()
        }
    }
    return (
            <div>
                <TextField
                    value={title}
                    onChange={changeTitle}
                    onKeyPress={onKeyPressAddTask}
                    size={'small'}
                    error={error}
                    helperText={error && 'Title is required!'}
                    label={'Title'}
                    variant={'outlined'}
                />
                {/*<input*/}
                {/*    value={title}*/}
                {/*    onChange={changeTitle}*/}
                {/*    onKeyPress={onKeyPressAddTask}*/}
                {/*    className={error ? 'error' : ''}*/}
                {/*/>*/}
                <IconButton onClick={addItem}>
                    <AddBox/>
                </IconButton>
                {/*<button onClick={addItem}>+</button>*/}
                {/*{errorMsg}*/}
            </div>
    )
}

export default AddItemForm;