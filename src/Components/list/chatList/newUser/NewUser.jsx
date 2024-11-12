import { useState, useEffect } from "react";
import avatar from "../../../../assets/avatar.png"
import { db } from "../../../lib/firebase";
import "./NewUser.css"
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";

// 2:18:46 
const NewUser = () =>
{
    // const [user,setUser] = useState(null) // storing the user data when a search result is found
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
                    {...doc.data(), // ...doc.data() is used to spread the user data into a new object
                        id:doc.id // doc.id is the id of the user
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

        // function add user while searching username
        const handleAdd = async (userToAdd) => { 
            // Checks if we have both users' data before proceeding 
            if (!userToAdd || !currentUser) {
                console.error("Missing user data:", { userToAdd, currentUser });
                alert("Cannot add user: Missing required data");
                return;
            }

            try {
                // Add detailed logging
                console.log("Starting user addition process...");
                console.log("Current user:", currentUser);
                console.log("User to add:", userToAdd);

                // Check if userchats document exists for current user
                const userChatsRef = doc(db, "userchats", currentUser.id);
                const userChatsDoc = await getDoc(userChatsRef);

                if (!userChatsDoc.exists()) {
                    // Create initial userchats document if it doesn't exist
                    console.log("Creating new userchats document");
                    await setDoc(userChatsRef, { chats: [] });
                }

                // Check for existing chat
                const existingChats = userChatsDoc.exists() ? userChatsDoc.data().chats || [] : [];
                console.log("Existing chats:", existingChats);
                 
                // Checks if the chat already exists with the userToAdd
                // some() is used to check if any of the elements in the array satisfies the condition
                if (existingChats.some(chat => chat.receiverId === userToAdd.id)) {
                    console.log("Chat already exists");
                    alert("Chat already exists with this user!");
                    return;
                }

                // Create new chat document
                const chatRef = doc(collection(db, "chats"));
                console.log("Creating new chat with ID:", chatRef.id);

                // Setting the chat document with the required data
                await setDoc(chatRef, {
                    createdAt: serverTimestamp(),
                    messages: [],
                    participants: [currentUser.id, userToAdd.id]
                });

                // Update both users' userchats
                const chatData = {
                    chatId: chatRef.id,
                    lastMessage: "",
                    receiverId: userToAdd.id,
                    updatedAt: Date.now(),
                };

                // Update current user's chats
                await updateDoc(userChatsRef, {
                    chats: arrayUnion(chatData) // arrayUnion is used to add the chatData to the chats array in the current user's userchats document , without overwriting the existing chats
                });

                // Update receiver's userchats
                const receiverChatsRef = doc(db, "userchats", userToAdd.id);
                const receiverData = {
                    ...chatData,
                    receiverId: currentUser.id // In this receiver's userchats document, the receiverId is the current user's id that means the current user is the receiver and partner of the userToAdd.
                };

                // Checking if the receiver's userchats document exists
                const receiverDoc = await getDoc(receiverChatsRef);
                // If the receiver's userchats document does not exist, then we create a new one with the receiverData
                if (!receiverDoc.exists()) {
                    await setDoc(receiverChatsRef, { chats: [receiverData] });
                } 
                // If the receiver's userchats document exists, then we update it with the receiverData
                else {
                    await updateDoc(receiverChatsRef, {
                        chats: arrayUnion(receiverData) // arrayUnion is used to add the receiverData to the chats array in the receiver's userchats document , without overwriting the existing chats
                    });
                }

                console.log("Chat added successfully");
                setSearchTerm(""); // Clearing the search term

                // catch block for error handling
            } catch (err) {
                console.error("Detailed error:", {
                    error: err,
                    errorMessage: err.message,
                    errorCode: err.code,
                    errorStack: err.stack
                });
                alert(`Error adding user: ${err.message}. Please try again.`);
            }
        };
            
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
                                    onClick={() => handleAdd(filteredUser)}
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

