import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

export const EditableSpan = React.memo( (props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }
    const onKeyPressOffEditMode = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            offEditMode()
        }
    }
    return (
        editMode
            ? <TextField
                onChange={changeTitle}
                value={title}
                onBlur={offEditMode}
                autoFocus={true}
                onKeyPress={onKeyPressOffEditMode}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    )
})

export default EditableSpan;