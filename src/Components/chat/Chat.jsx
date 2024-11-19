import './chat.css'
import avatar from './assets/avatar.png';
import emoji from './assets/emoji.png';
import img from './assets/img.png';
import camera from './assets/camera.png';
import mic from './assets/mic.png';
import EmojiPicker from 'emoji-picker-react';
import {useRef, useState , useEffect} from 'react'
import { doc, onSnapshot, updateDoc ,arrayUnion , getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { chatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';

// 2:46:22
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

    const [uploadProgress,setUploadProgress] = useState(0)

    const endRef = useRef(null) // endRef for scrolling to the end of the chat


    useEffect(() =>
    {
        endRef.current.scrollIntoView({behaviour:"smooth"}) // scrolling to the end of the chat
    },[chat?.messages])

    // Getting the chat from firestore database
     useEffect(() =>
    {
        console.log("ChatId: ",chatId); 
        if (!chatId) return;
        // getting the chat from firestore database
        const unSub = onSnapshot(doc(db,"chats",chatId),
        (res) =>
        {
            console.log("Chat Data: ",res.data());
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
        if (!chatId || !user || !currentUser?.id) {
            return;
        }
    
        // Use the correct user ID property
        const userId = user.id || user.uid; // Sometimes Firebase uses 'uid' instead of 'id'
    
        if (!userId) {
            console.error("No user ID found in user object:", user);
            return;
        }
    
        if (!currentUser?.id) {
            console.error("Missing currentUser ID");
            return;
        }

        // if the text is empty, return
        if(text.trim() === "" ) return;

        // updating the chat in firestore
        try{
        // let imgUrl = null;
        // if(sendimg.file)
        //     {
        //         console.log("Starting image upload...");
        //         imgUrl = await upload(sendimg.file)
        //         console.log("Image uploaded successfully:", imgUrl);
        //     }            

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

        // clearing the image state
        // setSendimg({
        //     file:null,
        //     url:""
        // }) 

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
            console.error("Upload error of Image: ", err);
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
                    console.log("Starting image upload...");
                    setUploadProgress(0);
                    
                    const imgUrl = await upload(file,(progress) =>
                    {
                        console.log("Upload progress: ",progress);
                        setUploadProgress(progress);
                    }); // Upload directly when file is selected
                    console.log("Image URL:", imgUrl);
                    setUploadProgress(0);
        
                    // Send message with image immediately
                    await updateDoc(doc(db, "chats", chatId), {
                        messages: arrayUnion({
                            senderId: currentUser.id,
                            img: imgUrl,
                            createdAt: new Date()
                        })
                    });
                    setUploadProgress(0)
                } catch (err) {
                    console.error("Error uploading image:", err);
                    setUploadProgress(0);
                }

                // ----------------------------------------------------------------------
                // setSendimg(
                //     {
                //         file: e.target.files[0], // file is the selected file
                //         url:URL.createObjectURL(e.target.files[0]) // URL.createObjectURL is used to create a URL for the selected file , to display the image
                //     }
                // )

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

    console.log("Upload Progress: " , uploadProgress)
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
                {chat?.messages?.map((message) =>
                (  
                    <div className={`chat-message ${message.senderId === currentUser.id ? "own" : "chat-message"}`} key={message.createdAt}>
                        <div className="chat-texts">
                            {message.img && 
                            (
                            <img src={message.img} className='sender-image' alt='message-image'/>)}
                            {message.text && <p className={`${message.senderId === currentUser.id ? "own-text": "sender-text"}`}>{message.text}</p>}
                            
                            {/* <span>{message}</span> */}
                        </div>
                </div>
                ))}
            {/* endRef for scrolling to the end of the chat */}
                    <div ref={endRef}></div>    
            </div>
            {/* Center class ends */}   

           {/* {sendimg?.url && 
           (
           <div className="chat-message own">
                <div className="chat-texts">
                    <img src={sendimg.url} alt='image-icon' className="sender-image"/>
                </div>
            </div>
            )} */}

            {uploadProgress > 0 && uploadProgress < 100 &&
            (
                // <div class="loader8">
                // </div>
                <div className="upload-progress-container">
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <span>{Math.round(uploadProgress)}%</span>
                </div>
            </div>
            )}

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