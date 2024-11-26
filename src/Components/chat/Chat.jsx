import './chat.css'
import avatar from './assets/avatar.png';
import emoji from './assets/emoji.png';
import img from './assets/img.png';
import camera from './assets/camera.png';
import mic from './assets/mic.png';
import EmojiPicker from 'emoji-picker-react';
import {useRef, useState , useEffect} from 'react'
import { doc, onSnapshot, updateDoc ,arrayUnion , getDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { chatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
import AlertDialog from './AlertDialog'; // Import the AlertDialog component

// Testing commits
const Chat = () =>
{ 
    // Getting the current user from userStore
    const {currentUser} = useUserStore();

    // Getting the chatId from chatStore
    const {chatId,user} = chatStore();

    // Chat State
    const [chat,setChat] = useState([])

    // Emoji state
    const [open, setOpen] = useState(false)

    // Input text state
    const [text,setText] = useState("")


    const endRef = useRef(null) // endRef for scrolling to the end of the chat

    const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog visibility
    const [messageToDelete, setMessageToDelete] = useState(null); // State to hold the message to delete
    const [dialogMessage, setDialogMessage] = useState(''); // New state for dialog message

    useEffect(() =>
    {
        endRef.current.scrollIntoView({behaviour:"smooth"}) // scrolling to the end of the chat
    },[chat?.messages])

    // Getting the chat from firestore database
     useEffect(() =>
    {
        if (!chatId) return;
        // getting the chat from firestore database
        const unSub = onSnapshot(doc(db,"chats",chatId),
        (res) =>
        {
            setChat(res.data()); // setting the chat state with the chat data from firestore
        }
    );

    return () =>
    {
        unSub();
    };
    },[chatId])

    // Handling Send button
    const handleSend = async () =>
    {
        // if the chatId, user or currentUser is not found, return
        if (!chatId || !user || !currentUser?.id || text.trim() === "") {
            return;
        }

        // updating the chat in firestore
        try{         
            await updateDoc(doc(db,"chats" ,chatId) ,
        {
            // adding the message to the chat
            messages: arrayUnion({
                senderId: currentUser.id, // sender id
                text, // message text
                createdAt:new Date(), // created at time
                // ...(imgUrl && {img: imgUrl})
            })
        });

        setText("") // clear input after sending the message
        

        // Update last message for both users
        const userIDs = [currentUser.id , user.id];

        for (const id of userIDs)
        {
        // getting the userchats from firestore
        const userChatRef = doc(db,"userchats",id)
        const userChatsSnapshot = await getDoc(userChatRef)

        // if the userchats exists
        if(userChatsSnapshot.exists())
            {
            const userChatsData = userChatsSnapshot.data() // getting the userchats data
            const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId) // finding the chat index
            
            if(chatIndex !== -1)
                {
                    // Created chat object with updated values
                    const updatedChat =
                    {
                        ...userChatsData.chats[chatIndex], // copying the existing chat
                        lastMessage: text, // updating the last message
                        isSeen: id === currentUser.id ? true: false, // updating the isSeen to true because we have sent the message
                        updatedAt: Date.now(), // updating the updatedAt time
                        chatId:chatId, // updating the chatId
                        receiverId: id === currentUser.id ? user.id : currentUser.id // updating the receiverId
                        
                    }

                    // Updated chats array with the updated chat
                    const updatedChats = [...userChatsData.chats]; // Copy all chats
                    updatedChats[chatIndex] = updatedChat // Update the specific chat
                    
                    // Updating the userchats in firestore
            await updateDoc(userChatRef ,   
                {
                    chats: updatedChats, // Updating the chats array with the updated chat
                })
                }
            }
        }
    }
        catch(err)
        {
            console.error("Error sending messages:", err);
        }
    }

    // Handling emoji 
    const handleEmoji = e =>
    {
        setText(prev => prev + e.emoji) // setting the text state with the emoji
        setOpen(false) // closing the emoji picker
    }

    // Handling image
    const handleImage = async(e) =>
        {
            const file = e.target.files[0]
            // if the file is selected , set the avatar state to the file and the url to the file
            if(file) // first file in the array
            {

                try {
                    const imgUrl = await upload(file);

                    // Send message with image immediately
                    await updateDoc(doc(db, "chats", chatId), {
                        messages: arrayUnion({
                            senderId: currentUser.id,
                            img: imgUrl,
                            createdAt: new Date()
                        })
                    });
                } catch (err) {
                    console.error("Error uploading image:", err);
                }
            }
        }


    // Handling key press
    const handleKeyPress = e =>
    {
        if(e.key === "Enter" && !e.shiftKey)
        {
            e.preventDefault();
            handleSend();
        }
    }   

    const handleClickOpen = (message) => {
        setMessageToDelete(message); // Store the actual message object
        if (message.img) {
            setDialogMessage("Are you sure you want to delete this message?"); // Generic message for images
        } else {
            setDialogMessage(`Are you sure you want to delete this message: "${message.text}"?`); // Message for text
        }
        setDialogOpen(true); // Open the dialog
    };

    const handleClose = () => {
        setDialogOpen(false); // Close the dialog
    };

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return; 
        console.log("Function invoked!")
        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayRemove(messageToDelete) // Remove the specific message
            });
            console.log("Message deleted successfully.");
            handleClose(); // Close the dialog after deletion
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        // chat main container starts
        <div className="chat">
            {/* top class starts */}
            <div className="top">
                {/* user class starts */}
                <div className="user">
                    <img src={avatar} alt='user'/>
                    <div className="user-texts">
                        <span>Some User</span>
                        <p>Bio goes here</p>
                    </div>
                </div>
                {/* user class ends */}
            </div>
            {/* top class ends */}  

            {/* Center class starts */}
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div className={`chat-message ${message.senderId === currentUser.id ? "own" : "chat-message"}`} key={message.createdAt}>
                        <div className="chat-texts">
                            {message.img && (
                                <div className="image-container">
                                    <img src={message.img} className='sender-image' alt='message-image' />
                                    <span className='three-dots' onClick={() => handleClickOpen(message)}>...</span>
                                </div>
                            )}
                            {message.text && (
                                <div className="text-container">
                                    {message.senderId === currentUser.id ? (
                                        <>
                                            <span className='three-dots own' onClick={() => handleClickOpen(message)}>...</span>
                                            <p className="own-text">{message.text}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="sender-text">{message.text}</p>
                                            <span className='three-dots sender  ' onClick={() => handleClickOpen(message)}>...</span>
                                        </>
                                    )}   
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {/* endRef for scrolling to the end of the chat */}
                <div ref={endRef}></div>

                {/* Confirmation Dialog */}
                <AlertDialog
                    open={dialogOpen}
                    handleClose={handleClose}
                    handleDelete={handleDeleteMessage}
                    message={dialogMessage}
                />
            </div>
            {/* Center class ends */}   

            {/* bottom class starts */}
            <div className="bottom">
                {/* icons  */}
                <div className="bottom-icons">
                    <label htmlFor='file'>
                        <img src={img} alt='image-icon'/>
                    </label>
                        <input type='file' id="file" style={{display:"none"}} onChange={handleImage}/>
                        <img src={camera} alt='camera-icon'/>
                        <img src={mic} alt='mic-icon'/>
                </div>
                {/* icons  */}

                    <input type='text' placeholder='Type a message...' onChange={e=>setText(e.target.value)} onKeyDown={handleKeyPress} value={text}/> 

                    {/* emoji class starts */}
                    <div className="emoji">
                        <img src={emoji} alt='emoji' onClick={() => setOpen((prev) => !prev)} />
                        <div className="picker">
                            <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                        </div>
                    </div>
                    {/* emoji class ends */}

                <button className="sendButton" onClick={handleSend}>Send</button>
            </div>
            {/* bottom class ends */}
    

        </div>
        // chat main container ends

    )
}

export default Chat;