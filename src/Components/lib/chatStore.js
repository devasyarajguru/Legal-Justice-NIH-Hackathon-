import { create } from "zustand";
import { useUserStore } from "./userStore";

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

        console.log("ChatStore changeChat called with:", {
            chatId,  
            user,
            userId: user?.id
        });

        const currentUser = useUserStore.getState().currentUser // getting the current user from the userStore

        // Creating a user object with the id of receiver , added multiple conditions to handle different firebase user ids
        const userWithId = {
            ...user,
            id: user.id || user.uid || user.receiverId
        };

        // check if currentUser is blocked by the reciever
        if (userWithId.blocked?.includes(currentUser.id))
        {
            return set({
                chatId,
                user:null,
                isCurrentUserBlocked:true,
                isRecieverBlocked:false,
            })
        }

        // check if reciever is blocked by the currentUser

        else if (currentUser.blocked?.includes(userWithId.id))
            {
                return set({
                    chatId,
                    user:userWithId,
                    isCurrentUserBlocked:false,
                    isRecieverBlocked:true,
                })
            } 

        else{
            return set({
                chatId,
                user:userWithId,
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