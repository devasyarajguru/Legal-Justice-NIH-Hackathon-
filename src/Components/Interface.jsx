import '../CSS/Interface.css'
import Chat from './chat/Chat';
import Detail from './detail/Detail';
import List from './list/List';
import Login from '../Components/Login'
import Notification from '../Components/Notification'
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './lib/firebase'
import { userStore } from './lib/myStore';


const Interface = () =>
    {
        const {currentUser , isLoading , fetchUserInfo} = userStore()

        useEffect(() =>
        {
            const unSub = onAuthStateChanged(auth,(user)=> // onAuthStateChanged is a Firebase Auth listener that checks the current authentication state (whether a user is logged in or not)
            {
                console.log(user)
            })

            return () =>
            {
                unSub(); // returns this function so that onAuthStateChanged is unsubscribed , when the component unmounts avoiding potential memory leaks from keeping unused listeners active.
            };
        },[])

        if (isLoading) return <div></div>

        return (
            <>
            <div className="main-interface">  
                {
                    user ? 
                (
                    <>
                    <List />
                    <Chat />
                    <Detail />
                    </>
                ) 
                    : (
                        <>
                        <div className='login-wrapper'>
                            <Login/>
                        </div>
                    </>
                )
                }
                <Notification />
            </div>
            </>
        )
    }

export default Interface;
