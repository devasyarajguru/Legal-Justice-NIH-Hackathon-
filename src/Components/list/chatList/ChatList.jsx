import './chatList.css'
import searchImg from './assets/search.png';
import plusImg from './assets/plus.png';
import minusImg from './assets/minus.png';
import avatar from '../userinfo/assets/avatar.png';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../lib/userStore';
import { doc, onSnapshot , getDoc, setDoc , Timestamp, updateDoc} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import NewUser from './newUser/NewUser'
import { chatStore } from '../../lib/chatStore';
import AlertDialog from "../../AlertDialog";
import { toast } from 'react-toastify';


// 2:14:20
// Testing commits
const ChatList = () =>
    {
        const [chats, setChats] = useState([])  // chats from firestore database variable
        const [addMode , setaddMode] = useState(false); // + - adding mode variable
        const [searchItem, setSearchItem] = useState(""); // searching user names variable

        const {currentUser} = useUserStore(); // getting the current user from userStore

        const {changeChat} = chatStore(); // getting the changeBlock function from chatStore

        const [selectedChat,setSelectedChat] = useState(null); // selected chat variable

        const [dialogOpen, setDialogOpen] = useState(false);
        const [chatToDelete, setChatToDelete] = useState(null);
        const [dialogMessage, setDialogMessage] = useState('');

        // Getting the chat list of the current user
        useEffect(() =>
        {
            const createEmptyChats = async () =>
            {   
                try {
                    await setDoc(doc(db , "userchats" , currentUser.id) , {chats: []}); // setting the chats to empty array so that we can store the chats of users in it and onSnapshot can listen to it , otherwise it will not listen to it
                    console.log("New userchats document created for:", currentUser.id);
                }

                catch(error)
                {
                    console.error("Error creating userchats document:" , error);
                }
            }

            // If there is current user and id exist
            if(currentUser?.id)
            {
                // Firestore database document using onSnapshot. --> onSnapshot is a real-time listener that allows you to recieve updates whenever data in firestore changes just like chats of user changes. 

                // Every time the document changes (e.g., a new message is sent), the callback function (res parameter) is triggered with the latest document snapshot.

                const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
                    // If the document exits  
                    try{
                    if(res.exists())
                    {
                        // getting the chats of list of users ,eg. -  5 users 5 chats
                        const items = res.data().chats || []; // empty array if no chats
                        console.log("Raw chat Items from firebase: ", items)
                    
                        /*{
                            "chats": [
                              {
                                "receiverID": "user1",
                              },
                              {
                                "receiverID": "user2",
                              }, */

                    
                        // Map through each chat item and create promises to fetch user data for each receiver
                        const promises = items.map (async (item) =>
                        {
                            // Add null check for receiverID
                            if(!item?.receiverId)
                            {
                                console.log("No receiverID found for item: ", item)
                                return null;
                            }

                            try
                            {

                            const userDocRef = doc(db, "users", item.receiverId);
                            const userDocSnap = await getDoc(userDocRef);

                            if(!userDocSnap.exists())
                            {
                                console.log("No user document found for: ", item.receiverID)
                                return null;
                            }

                            const userData = userDocSnap.data()

                            // Ensure updatedAt is properly set
                            const updatedAt = item.updatedAt instanceof Timestamp
                            ? item.updatedAt.toMillis()
                            : new Date(item.updatedAt).getTime();

                            return {
                                ...item , 
                                user:userData,
                                updatedAt: updatedAt || Date.now(),
                                unreadCount: item.unreadCount || 0
                            };
                        }
                        catch(error)
                        {
                            console.error("Error fetching user document: ",error);
                            return null;
                        }
                        })

                        const chatData = (await Promise.all(promises))
                        .filter(chat => chat !== null)
                        .sort((a,b) => (b?.updatedAt || 0) - (a?.updatedAt || 0))

                        setChats(chatData)
                    }

                    else
                    {
                        console.log("No userchats document found , creating one...")
                        await createEmptyChats();
                        setChats([]);
                    }
                    
                } catch (error) 
                {
                    console.log("Error in snapshot listener" , error);
                    setChats([]);
                }
                });
            
            return () =>
            {
                unSub()
            }

        }

        },[currentUser?.id])


        // Function to handle the selection of the chat
        const handleSelect = async(item) => {
            setSelectedChat(item.chatId);
            
            if(!item?.chatId || !item?.user) {
                console.error("Missing chat data in HandleSelect:", item);
                return;
            }
            
            const userWithId = {
                ...item.user,
                id: item.receiverId
            };
            changeChat(item.chatId, userWithId);
    
            // Always update the active chat status when selecting a chat
            const userChatRef = doc(db, "userchats", currentUser.id);
            const userChatsSnapshot = await getDoc(userChatRef);
    
            if (userChatsSnapshot.exists()) {
                const userChatsData = userChatsSnapshot.data();
                const chatIndex = userChatsData.chats.findIndex(c => c.chatId === item.chatId);
    
                if (chatIndex !== -1) {
                    const updatedChats = [...userChatsData.chats];
                    
                    // Update the selected chat
                    updatedChats[chatIndex] = {
                        ...updatedChats[chatIndex],
                        unreadCount: 0,
                        isSeen: true,
                        activeChatId: item.chatId
                    };
    
                    // Clear activeChatId from all other chats
                    updatedChats.forEach((chat, index) => {
                        if (index !== chatIndex) {
                            updatedChats[index] = {
                                ...chat,
                                activeChatId: null
                            };
                        }
                    });
    
                    await updateDoc(userChatRef, {
                        chats: updatedChats
                    });
                }
            }
        };

        const handleClickOpen = (e, item) => {
            e.stopPropagation(); // Prevent chat selection when clicking dots
            setChatToDelete(item);
            setDialogMessage(`Are you sure you want to delete chat with ${item.user?.username}?`);
            setDialogOpen(true);
        };
    
        const handleClose = () => {
            setDialogOpen(false);
            setChatToDelete(null);
        };
    
        const handleDeleteChat = async () => {
            if (!chatToDelete) return;
            
            try {
                const userChatRef = doc(db, "userchats", currentUser.id);
                const userChatsSnapshot = await getDoc(userChatRef);
    
                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const updatedChats = userChatsData.chats.filter(
                        chat => chat.chatId !== chatToDelete.chatId
                    );
    
                    await updateDoc(userChatRef, {
                        chats: updatedChats
                    });
    
                    toast.success("Chat deleted successfully");
                    handleClose();
                }
            } catch (error) {
                console.error("Error deleting chat:", error);
                toast.error("Failed to delete chat");
            }
        };

    // Function to Filter out names
    const filterChats = chats.filter(item =>
        item?.user?.username?.toLowerCase().includes(searchItem.toLowerCase())
        // checks if the name is there in object and in the searched bar value
    )

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return "";
      
        try {
          const date = new Date(
            typeof timestamp === "number" ? timestamp : timestamp.toMillis()
          );
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
          });
        } catch (error) {
          console.error("Error formatting time:", error);
          return "";
        }
      };

        return (
            // chatList main container starts
            <div className="chatList">
                    {/* search class starts */}
                <div className="search">
                    <div className="searchBar">
                        <img src={searchImg} alt='search-Image'/>
                        <input 
                        type='text' 
                        placeholder='Search'
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}/> {/* Values changing for setSearchItem on the onChange */}
                    </div>
                    <img src={addMode ? minusImg: plusImg} alt='plusImg' className='add-btn' onClick={() => setaddMode((prev) => !prev)}/>
                </div>
                    {/* search class ends */}

                {/* Chat item starts*/} 

                {/* Displaying names of users also with filer values if search through searchBar */}
                {filterChats.map(item => (
                    <div 
                    className={`item ${!item.isSeen ? "unread" : ""} ${selectedChat === item.chatId ? "selected" : ""}`} 
                    key={item.chatId} 
                    onClick={() => handleSelect(item)}
                >
                    <img src={item.user?.avatar || avatar} alt='user' />
                    <div className="texts">
                        <div className="name-time">
                            <span className="name">{item.user?.username || "Unknown user"}</span>
                            <span 
                        className='three-dots' 
                        onClick={(e) => handleClickOpen(e, item)}
                    >
                        ...
                    </span>
                            <span className="time">
                                {item.updatedAt ? formatMessageTime(item.updatedAt) : ""}
                            </span>
                        </div>
                        <p className='texts-p'>{item.lastMessage || "No messages yet"}</p>

                        {item.unreadCount > 0 &&
                        (
                            <div className="unread-count">
                                {item.unreadCount}
                            </div>
                        )}
                        
                    </div>
                </div>
                ))}

                {/* Chat item ends*/}
                {addMode && <NewUser />}
                <AlertDialog
                open={dialogOpen}
                handleClose={handleClose}
                handleDelete={handleDeleteChat}
                message={dialogMessage}
            />
            </div>
            
            // chatList main container ends

        )
    }
    
    export default ChatList;