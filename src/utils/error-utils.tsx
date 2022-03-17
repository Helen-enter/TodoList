import {Dispatch} from "redux";
import {setStatusAC, setErrorAC } from "../app/app-reducer";

export const handleServerAppError = (dispatch: Dispatch, message: string) => {
    dispatch(setErrorAC(message))
    dispatch(setStatusAC('failed'))
}