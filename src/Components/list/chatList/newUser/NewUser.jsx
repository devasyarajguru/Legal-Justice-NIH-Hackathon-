import { useState } from "react";
import avatar from "../../../../assets/avatar.png"
import { db } from "../../../lib/firebase";
import "./NewUser.css"
import { collection, getDocs, query, where } from "firebase/firestore";

// 2:18:46 
const NewUser = () =>
{
    const [user,setUser] = useState(null) // storing the user data when a search result is found


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

        // Function to add username to the usernames collection
        // const addUsername = async (userId , username ,avatarURL) =>
        // {
        //     try
        //     {
        //         const userDocRef = doc(collection(db , "usernames") , userId);

        //         await setDoc(userDocRef , {
        //             userId:userId,
        //             username:username,
        //             avatar:avatarURL
        //         });
        //         console.log("Username added")
        //     }

        //     catch(error)
        //     {
        //         console.error("Error adding username",error);
        //     }
        // }
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
                    <button>Add User</button>
                </div>
                }
                
            </div>
        </>
    )
}

export default NewUser;

