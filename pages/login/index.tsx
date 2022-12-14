import MyButton from '../../UI/buttons/MyButton'
import MyInput from '../../UI/inputs/MyInput'
import { useRouter } from 'next/router'

// @ts-ignore
import { useForm } from 'react-hook-form'
import {useAppDispatch, wrapper} from "../../redux/store";

import {useGetCookie, useSetCookie} from "../../hooks/useAuth";
import {loginUser} from "../../asyncActions/users";
import {setUser} from "../../redux/users/slice";
import {toast, ToastContainer} from "react-toastify";
import React from "react";
import {useUploadStore} from "../../hooks/useStore";
import AdminPage from "../admin";
import {toastError} from "../../hooks/useModalAndAlert";



const Login = () => {

    const dispatch = useAppDispatch()
    const router = useRouter()

    const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async ({username, password}) => {
        const data: any = await loginUser({username, password})

        if (data.message) {
            if(data.message === 'User not found') {
                setError('username', {type: 'manual', message: data.message})

            }
            if(data.message === 'Password is incorrect') {
                setError('password', {type: 'manual', message: data.message})
            }
            toastError(data.message)
        } else {
            const {token, user} = data
            await dispatch(setUser(user))
            useSetCookie('token', token)
            router.push('/admin')
        }



    }

    return (
        <>
            <div className="login-wrap">
                <div className="login">
                    <h1 className="label">Login</h1>
                    <form action="#" onSubmit={handleSubmit(onSubmit)}>
                        <div className="login-form">
                            <div className="login-form__item">
                                <label className="label">Username</label>
                                {errors.username && <span className="login-form__alert">{errors.username?.message}</span>}
                                <MyInput
                                    placeholder={'Enter username'}
                                    error={errors.username}
                                    validRegister={{...register('username', {required: 'Enter your username'})}}
                                />
                            </div>
                            <div className="login-form__item">
                                <label className="label">Password</label>
                                {errors.password && <span className="login-form__alert">{errors.password?.message}</span>}
                                <MyInput
                                    placeholder={'Enter password'}
                                    error={errors.password}
                                    type={'password'}
                                    validRegister={{...register('password', {required: 'Enter your password', minLength: {value: 8, message: 'At least 8 characters'}})}}
                                />
                            </div>
                        </div>
                        <div className="login-buttons aic d-flex">
                            <MyButton type={'submit'}>Sign in</MyButton>
                        </div>
                    </form>

                </div>
            </div>

            <ToastContainer closeButton={true} />
        </>
    )
}

Login.getInitialProps = wrapper.getInitialPageProps(store => async (data) => {

    const tokenValue1 = useGetCookie('token')
    // @ts-ignore
    const tokenValue2 = data.req?.cookies.token

    const token = tokenValue1 || tokenValue2
    await useUploadStore(store, token)
})

export default Login