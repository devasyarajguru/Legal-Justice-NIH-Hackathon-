import { useState } from "react";
import avatar from "../../../../assets/avatar.png"
import { db } from "../../../lib/firebase";
import "./NewUser.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";

// 2:18:46 
const NewUser = () =>
{
    const [user,setUser] = useState(null) // storing the user data when a search result is found

    const {currentUser} = useUserStore() // current user from UserStore

    // Handling the searched users
    const handleSearch = async e =>
        {
            e.preventDefault()

            const formData = new FormData(e.target)
            const username = formData.get("username")

           try
           {
            // users collectin reference
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username)); // creating a firestore query to find a user whose username matches the one provided in the form

            const querySnapShot = await getDocs(q) // executing the query and fetches matching documents from Firestore

            if(!querySnapShot.empty)
            {
                setUser(querySnapShot.docs[0].data()) // querySnapshot.docs is an array of document snapshots , since docs[0] for first value extracted by data()
            }
           }

           catch(err)
           {
            console.log("Error while searching:" , err)
           }
        }

        // function add user while searching username
        const handleAdd =  async (e) =>
        {
            e.preventDefault()
            const chatRef = collection(db, "chats"); // Assigning Collection chats
            const userChatsRef = collection(db,"userchats"); // Assigning Collection userchats

            try
            {
                const newchatRef = doc(chatRef) // Refering to the "chats" documnet
                await setDoc(newchatRef,  // Setting the values in doc
                    {
                        createdAt: serverTimestamp(), // to include a server-generated timestamp in the written data
                        messages:[]
                    }  
                )   

                // Updating userchats collection
                await updateDoc(doc(userChatsRef , user.id) , 
                {
                chats: arrayUnion({
                    chatId:newchatRef.id,
                    lastMessage:"",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })
                })

                await updateDoc(doc(userChatsRef , currentUser.id) , 
                {
                chats: arrayUnion({
                    chatId:newchatRef.id,
                    lastMessage:"",
                    receiverId: user.id,
                    updatedAt: Date.now()
                })
                })

            }

            catch(err)
            {
                console.log("Error" ,err)
            }
        }

    return(
        <>
            <div className="addUser">
                <form onSubmit={handleSearch}>
                    <input type="text" placeholder="username" name="username"/>
                    <button>Search</button>
                </form>
                {user && 
                <div className="new-user">
                    <div className="new-detail">
                        <img src={user.avatar || avatar} alt="user-avatar"/>
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
                }
                
            </div>
        </>
    )
}

export default NewUser;

