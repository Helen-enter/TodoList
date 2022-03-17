import {authAPI} from "../api/todolist-api"
import {setIsLoggedInAC} from "../features/auth-reducer"
import {Dispatch} from "redux";

const InitialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = InitialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-ISINITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}

export const setIsInitializedAC = (isInitialized: boolean) => {
    return {
        type: 'APP/SET-ISINITIALIZED',
        isInitialized
    } as const
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
        }
    })
        .finally(() => {
            dispatch(setIsInitializedAC(true))
        })
}


export type ActionsType = SetAppErrorActionType | SetAppStatusActionType | setIsInitializedACType

export type SetAppStatusActionType = ReturnType<typeof setStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setErrorAC>
export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export const setErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)