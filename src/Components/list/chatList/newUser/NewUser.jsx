import { useState, useEffect } from "react";
import avatar from "../../../../assets/avatar.png"
import { db } from "../../../lib/firebase";
import "./NewUser.css"
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";

// 2:18:46 
const NewUser = () =>
{
    const [user,setUser] = useState(null) // storing the user data when a search result is found
    const [searchTerm,setSearchTerm] = useState("") // New State for search term
    const [allUsers,setAllUsers] = useState([]) // New State for all users
    const {currentUser} = useUserStore() // current user from UserStore

    // Fetching all users when component mounts
    useEffect(()=>
    {
        // Fetching all users from firestore
        const fetchUsers = async () =>
        {
            try
            {
                const userRef = collection(db, "users")// Reference to the users collection
                const querySnapshot  = await getDocs(userRef) // Fetching all users
                const users = querySnapshot.docs
                .map(doc =>
                (
                    {...doc.data(),
                        id:doc.id
                    }
                )
                ).filter(user => user.id !== currentUser.id); // Excluding the current user from the list

                setAllUsers(users) // Updating the state with the fetched users
            }
            catch(error)
            {
                console.error("Error fetching users: ",error)
            }
        };

        fetchUsers() // Calling the fetchUsers function
    },[currentUser.id]);

    //filter users based on search term
    // ? - optional chaining operator. If user is null , then it will not throw an error and will return undefined
    const filteredUsers = allUsers.filter(user =>
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) // Here includes() have range of values to check if the search term is present in the username
    )


    // Handling the searched users
    /*const handleSearch = async e =>
        {
            e.preventDefault()

            const formData = new FormData(e.target)
            const username = formData.get("username")


            if(!username.trim())
            {
                alert("Please enter username")
            }
           try
           {
            // users collectin reference
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username)); // creating a firestore query to find a user whose username matches the one provided in the form

            const querySnapShot = await getDocs(q) // executing the query and fetches matching documents from Firestore

            if(!querySnapShot.empty)
            {
                const foundUser = { ...querySnapShot.docs[0].data() , id:querySnapShot.docs[0].id}

                setUser(foundUser) // querySnapshot.docs is an array of document snapshots , since docs[0] for first value extracted by data()

            }

            else
            {
                console.log("No user found")
            }
           }

           catch(err)
           {
            alert("An error occured: " + err.message)
            console.error("Error while searching:" , err)
           }
        }*/



        // function add user while searching username
        const handleAdd =  async () =>
        { 
            try {
                // Add logging to see what's happening
                console.log("Current user:", currentUser);
                console.log("User to add:", user);

                const userChatsDoc = await getDoc(doc(db, "userchats", currentUser.id));
                if (userChatsDoc.exists()) {
                    const existingChats = userChatsDoc.data().chats || [];
                    console.log("Existing chats:", existingChats);
                    
                    const chatExists = existingChats.some(chat => chat.receiverId === user.id);
                    
                    if (chatExists) {
                        alert("Chat already exists with this user!");
                        return;
                    }
                }

                const chatRef = collection(db, "chats"); // Assigning Collection chats
                const userChatsRef = collection(db,"userchats"); // Assigning Collection userchats


                    try
                    {
                        const newchatRef = doc(chatRef); // Refering to the "chats" documnet
                        await setDoc(
                            newchatRef, // Setting the values in "chats" doc
                            {
                                createdAt: serverTimestamp(), // to include a server-generated timestamp in the written data
                                messages: [], // 
                                participants: [currentUser.id , user.id]
                            }
                        );

                        console.log("New Chat Document Reference:", newchatRef);
                
                        console.log("Chat successfully created with participants:", [currentUser.id, user.id]);

                        
                        // Updating userchats collection for current user 
                        await updateDoc(doc(userChatsRef, currentUser.id), {
                            chats: arrayUnion({
                                chatId: newchatRef.id,
                                lastMessage: "",
                                receiverId: user.id,
                                updatedAt: Date.now(),
                            }),
                        });

                        console.log("Userchats updated successfully.");

                        setSearchTerm("") // Clearing the search term after adding the user
                        setUser(null) // Clearing the user after adding the user
                    }
                    
                    catch(err)
                    {
                        console.log("Error" ,JSON.stringify(err))
                        alert("An error occured: " + err.message)
                    }
            }
                
            catch(err)
            {
                console.error("Error:", err);
                alert("An error occurred: " + err.message);
            }

            // After successful update
            console.log("Chat added successfully");
        }
            
    return(
        <>
            <div className="addUser">
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search username..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                {/* Show filtered results directly with Add button */}
                {searchTerm && (
                    <div className="search-results">
                        {filteredUsers.map(filteredUser => (
                            <div key={filteredUser.id} className="new-user">
                                <div className="new-detail">
                                    <img 
                                        src={filteredUser.avatar || avatar} 
                                        alt="user-avatar"
                                        className="selected-avatar"
                                    />
                                    <span>{filteredUser.username}</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        // OnClicking the button , the user is set to the filtered user and the handleAdd function is called
                                        setUser(filteredUser);
                                        handleAdd();
                                    }} 
                                    className="add-button"
                                >
                                    Add User
                                </button>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="no-results">No users found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
        </>
    )
}

export default NewUser;

