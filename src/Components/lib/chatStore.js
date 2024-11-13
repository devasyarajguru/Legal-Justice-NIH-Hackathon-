import { create } from "zustand";
import { useUserStore } from "./userStore";
// import { doc, getDoc } from "firebase/firestore";
// import {db} from "./firebase"

// zustand is a state management library for react to share state across components

// Chat State 
 export const chatStore = create((set) => ( 
{
    chatId:null, // chatId is the id of the chat in firestore
    user:null, // user is the user object of the chat partner
    isCurrentUserBlocked:false, // isCurrentUserBlocked is a boolean flag to indicate whether the current user is blocked by the reciever
    isRecieverBlocked:false, // isRecieverBlocked is a boolean flag to indicate whether the reciever is blocked by the current user
    changeChat:(chatId , user) =>
    {
        const currentUser = useUserStore.getState().currentUser // getting the current user from the userStore

        // check if currentUser is blocked by the reciever
        if (user.blocked.includes(currentUser.id))
        {
            return set({
                chatId,
                user:null,
                isCurrentUserBlocked:true,
                isRecieverBlocked:false,
            })
        }

        // check if reciever is blocked by the currentUser

        else if (currentUser.blocked.includes(user.id))
            {
                return set({
                    chatId,
                    user:user,
                    isCurrentUserBlocked:false,
                    isRecieverBlocked:true,
                })
            } 

        else{
            return set({
                chatId,
                user,
                isCurrentUserBlocked:false,
                isRecieverBlocked:false,
            })   
        }
    } ,

    changeBlock: () =>
        {
            set(state =>({...state, isRecieverBlocked: !state.isRecieverBlocked})) // toggling the isRecieverBlocked flag
        }
}))