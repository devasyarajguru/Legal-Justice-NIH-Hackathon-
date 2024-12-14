import './chat.css'
import avatar from './assets/avatar.png';
import emoji from './assets/emoji.png';
import imageIcon from './assets/img.png';
import camera from './assets/camera.png';
import mic from './assets/mic.png';
import EmojiPicker from 'emoji-picker-react';
import {useRef, useState , useEffect, useCallback} from 'react'
import { doc, onSnapshot, updateDoc ,arrayUnion , getDoc, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { chatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
import AlertDialog from './AlertDialog'; // Import the AlertDialog component
import { toast } from 'react-toastify';
import Notification from '../Notification'

// Testing commits
// Testing commit
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

    // Typing indication
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const typingTimeout = useRef(null); // Store the ID of timeout


    const [img,setImg] = useState(
        {
            file:null,
            url:"",
        }
    )

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
            console.log("Chat Data:" , res.data())
        }
    );

    return () =>
    {
        unSub();
    };
    },[chatId])


    // Listen for typing status
    useEffect(() => {
        if (!chatId) return;

        const chatRef = doc(db, "chats", chatId);
        const unsubscribe = onSnapshot(chatRef, (doc) => {
            const typingStatus = doc.data()?.typingStatus || {}; // bring the typingStatus data to check for status
            const otherUserId = user.id; // Assigning other user's id
            
            // Check if the other user is typing
            setOtherUserTyping(
                typingStatus[otherUserId] === true && 
                typingStatus[otherUserId] !== currentUser.id
            );
        });

        return () => unsubscribe();
    }, [chatId, user.id, currentUser.id]);

     // Cleanup on component unmount
     useEffect(() => {
        return () => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }
            updateTypingStatus(false);
        };
    }, []);

    // Handling Send button
    const handleSend = async () =>
    {
        console.log("Handle Send function triggered!"); 

        // if the chatId, user or currentUser is not found, return
        if (!chatId || !user || !currentUser?.id || text.trim() === "") {
            console.log("Missing chatId, user, or currentUser.");
            return;
        }

        if(text === "") return;

        let imgUrl = null;

        // updating the chat in firestore
        try{     
            if (img?.file)
            {
                console.log("Image object:", img); 
                console.log("Image file detected, uploading..." );

                imgUrl = await upload(img.file)
                console.log("Uploaded Image URL:",imgUrl)
            }

            else {
                console.log("No image file detected.");
            }
            

             // Update chat in Firestore
            await updateDoc(doc(db,"chats" ,chatId) ,
            {
            // adding the message to the chat
            messages: arrayUnion({
                senderId: currentUser.id, // sender id
                text, // message text
                createdAt:new Date(), // created at time
                ...(imgUrl && {img: imgUrl})
            }),

            [`typingStatus.${currentUser.id}`]: false
        });


        setText("") // clear input after sending the message
        setIsTyping(false); // Reset local typing state
        

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
                        updatedAt: Timestamp.now(), // updating the updatedAt time
                        unreadCount: (userChatsData.chats[chatIndex].unreadCount || 0) + 1,
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
                });

                console.log(
                    `User chat updated for user ID ${id} with chat ID ${chatId}`
                );

                }

            }

            else {
                console.log(`User chat for ID ${id} not found.`);
            }
        }
    }
        catch(err)
        {
            console.error("Error sending messages:", err);
        }

        setImg({
            file:null,
            url:""
        });

        console.log("Image state reset.");
    }

    // Handling emoji 
    const handleEmoji = e =>
    {
        setText(prev => prev + e.emoji) // setting the text state with the emoji
        setOpen(false) // closing the emoji picker
    }

    const handleImg = (e) =>
        {
            console.log("Handle Image function triggered!")
            // if the file is selected , set the avatar state to the file and the url to the file
            if(e.target.files[0]) // first file in the array
            {
                console.log("Selected file:", e.target.files[0])
                setImg(
                    {
                        file: e.target.files[0], // file is the selected file
                        url:URL.createObjectURL(e.target.files[0]) // URL.createObjectURL is used to create a URL for the selected file , to display the image
                    }
                )
            }

            else {
                console.log("No file selected."); 
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

    // When user starts typing
    const updateTypingStatus = async(isTyping) =>
    {
        if(!currentUser?.id || !chatId) return; // if no current chatId or currentUser return nothing

        try{
            // update the typing status in firestore database
            await updateDoc(doc(db, "chats" , chatId), {
                [`typingStatus.${currentUser.id}`]: isTyping
            });
        }

        catch (error)
        {
            console.error("Error updating typing status:", error)
        }
    }

    // Handle typing status
    const handleTyping = (e) => {
        setText(e.target.value); // Update the text input

        // This indicates at least user has typed one character
        const typing = e.target.value.length > 0;

        // If user is typing or has stopped typing
        if (typing !== isTyping) {
            setIsTyping(typing); // updates the local state
            updateTypingStatus(typing); // This function updates typing status in Firestore
        }

        // If user is typing, schedule the stop typing timeout
        if (typing) {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current); // This prevents multiple timeouts from running simultaneously
            }
            typingTimeout.current = setTimeout(() => {
                updateTypingStatus(false); // user is no longer typing
                setIsTyping(false); // stop the typing animation/UI
            }, 1500);
        }
    };

    // Add this function inside your Chat component or in a separate utils file
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        
        const date = timestamp.toDate(); // Convert Firestore timestamp to Date object
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        }).toLowerCase(); // Convert "PM" to "pm" to match WhatsApp style
    };

    return (
        <>
        <Notification />
        {/* // chat main container starts */}
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
                {chat?.messages?.map((message) => {
                    // console.log("Rendering Message:" , message)
                    return (
                        // Chat message starts
                        <div className={`chat-message ${message.senderId === currentUser.id ? "own" : ""}`} key={message.createdAt}>

                            {/* Chat text starts */}
                            <div className="chat-texts">
                                {message.img && (
                                    <div className="image-container">
                                        <img src={message.img} className='sender-image' alt='User uploaded image' />
                                        <span className='three-dots' onClick={() => handleClickOpen(message)}>...</span>
                                        <span className="message-time">{formatMessageTime(message.createdAt)}</span>
                                    </div>
                                    
                                )}
                                
                                {message.text && (
                                    <div className="text-container">
                                        {message.senderId === currentUser.id ? (
                                            <>
                                                <span className='three-dots own' onClick={() => handleClickOpen(message)}>...</span>
                                                <div className="text-time-container own">
                                                    <p className="own-text">{message.text}</p>
                                                    <span className="message-time">{formatMessageTime(message.createdAt)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-time-container">
                                                    <p className="sender-text">{message.text}</p>
                                                    <span className="message-time">{formatMessageTime(message.createdAt)}</span>
                                                </div>
                                                <span className='three-dots sender' onClick={() => handleClickOpen(message)}>...</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                
                            </div>
                            {/* Chat text ends */}

                        </div>
                        // Chat message ends

                    );
                })}
                
                {/* Add typing indicator after the last message */}
                {otherUserTyping && (
                    <div className="chat-message">
                        <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    </div>
                )}

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

            {/* bottom class starts */}
            <div className="bottom">
                {/* icons  */}
                <div className="bottom-icons">
                    <label htmlFor='file'>
                        <img src={imageIcon} alt='image-icon'/>
                    </label>
                        <input 
                        type='file' 
                        id="file" 
                        style={{display:"none"}} 
                        onChange={handleImg} 
                        />
                        <img src={camera} alt='camera-icon'/>
                        <img src={mic} alt='mic-icon'/>
                </div>
                {/* icons  */}

                    <input 
                        type='text' 
                        placeholder='Type a message...' 
                        onChange={(e)=>
                        {
                            setText(e.target.value) // Update the text state
                            handleTyping(e); // Check and update typing status
                        } }
                        onKeyDown={handleKeyPress} 
                        value={text}/> 

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
        {/* // chat main container ends */}
        </>
    )
}

export default Chat;    