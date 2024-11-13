import '../CSS/Interface.css'
import Chat from './chat/Chat';
import Detail from './detail/Detail';
import List from './list/List';
import Login from '../Components/Login'
import Spinner from '../Components/Spinner'
import Notification from '../Components/Notification'
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './lib/firebase'
import {useUserStore} from './lib/userStore';
import { chatStore } from './lib/chatStore';

// 2:05:49
const Interface = () =>
    {
        const {chatId} = chatStore();

        const {currentUser , isLoading , fetchUserInfo} = useUserStore() // useUserStore is a custom hook that provides the current user, loading state, and a function to fetch user information from the database.

        useEffect(() =>
        {
            const unSub = onAuthStateChanged(auth,(user)=> // onAuthStateChanged is a Firebase Auth listener that checks the current authentication state (whether a user is logged in or not)
            {
                fetchUserInfo(user ? user.uid: null); // It fetches user information from the database using the user's unique identifier (uid) when the user is authenticated , if the user is not authenticated, it sets the uid to null.
            })
            // cleanup function , this function is called when the component unmounts(not rendered)
            return () =>
            {   
                unSub(); // returns this function so that onAuthStateChanged is unsubscribed , when the component unmounts avoiding potential memory leaks from keeping unused listeners active.
            };
        },[fetchUserInfo]) // useEffect hook is used to fetch user information when the component mounts or when the fetchUserInfo function changes.

        if (isLoading) return <Spinner /> // if the user is loading , show the spinner component

        return (
            <>
                {/* main interface */}
            <div className="main-interface">  
                {/* if the user is authenticated , show the list, chat, and detail components */}
                {
                    currentUser ? 
                (
                    <>
                    <List />
                   {chatId && <Chat />}
                   {chatId && <Detail />}
                    </>
                ) 
                // if the user is not authenticated , show the login component
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
