import './chat.css'
import avatar from './assets/avatar.png';
import emoji from './assets/emoji.png';
import img from './assets/img.png';
import camera from './assets/camera.png';
import mic from './assets/mic.png';
import EmojiPicker from 'emoji-picker-react';
import {useRef, useState , useEffect} from 'react'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { chatStore } from '../lib/chatStore';

const Chat = () =>
{ 
    // Getting the chatId from chatStore
    const {chatId} = chatStore();

    // Chat State
    const [chat,setChat] = useState([])

    // Emoji state
    const [open, setOpen] = useState(false)

    // Input text state
    const [text,setText] = useState("")

    // Handling emoji 
    const handleEmoji = e =>
    {
        setText(prev => prev + e.emoji)
        setOpen(false)
    }

    const endRef = useRef(null) 

    useEffect(() =>
    {
        endRef.current.scrollIntoView({behaviour:"smooth"}) // scrolling to the end of the chat
    },[])

    // Getting the chat from firestore database
     useEffect(() =>
    {
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
                <div className="chat-message">
                    <img src={avatar} alt='avatar'  className="user-avatar"/>
                        <div className="chat-texts">
                            <p className="sender-text">quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.
                                
                            </p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message own">
                        <div className="chat-texts">
                            <img src="https://picsum.photos/200/300" className='sender-image'/>
                            <p className="own-text">Hello</p>
                            <p className="own-text">Hello ghdskj dskbsjsfs</p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message">
                    <img src={avatar} alt='avatar' className="user-avatar"/>
                        <div className="chat-texts">
                            <p className="sender-text">Heyy</p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message own">
                        <div className="chat-texts">
                            <p className="own-text">How are You??</p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message">
                    <img src={avatar} alt='avatar' className="user-avatar"/>
                        <div className="chat-texts">
                        <img src="https://picsum.photos/200/300" className='sender-image'/>
                            <p className="sender-text">I am Good</p>
                            <p className="sender-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, molestias iusto </p>
                            <p className="sender-text">Lorem ipsum dolor sit amee </p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message own">
                        <div className="chat-texts">
                            <p className="own-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nesciunt placeat quas, sit neque illo ad fuga voluptatibus ea quae? Eveniet quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.</p>
                            <span>1 min ago</span>
                        </div>
                </div>

                <div className="chat-message">
                    <img src={avatar} alt='avatar' className="user-avatar"/>
                        <div className="chat-texts">
                            <p className="sender-text">I am Good</p>
                            <p className="sender-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, molestias iusto </p>
                            <p className="sender-text">Lorem ipsum dolor sit amee Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam unde qui at cupiditate ut eos accusamus magnam minus nisi cumque! Totam quidem ratione fugit iure repudiandae eos officia rerum perferendis. </p>
                            <span>1 min ago</span>
                        </div>
                </div>

                <div className="chat-message own">
                        <div className="chat-texts">
                            <p className="own-text">GoodGoodGoodGoodGood</p>
                            <span>1 min ago</span>
                        </div>
                </div>
            </div>
            {/* Center class ends */}

            <div ref={endRef}></div>

            {/* bottom class starts */}
            <div className="bottom">
                {/* icons  */}
                <div className="bottom-icons">
                        <img src={img} alt='image-icon'/>
                        <img src={camera} alt='camera-icon'/>
                        <img src={mic} alt='mic-icon'/>
                </div>
                {/* icons  */}

                    <input type='text' placeholder='Type a message...' onChange={e=>setText(e.target.value)} value={text}/> 

                    {/* emoji class starts */}
                    <div className="emoji">
                        <img src={emoji} alt='emoji' onClick={() => setOpen((prev) => !prev)} />
                        <div className="picker">
                            <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                        </div>
                    </div>
                    {/* emoji class ends */}

                <button className="sendButton">Send</button>
            </div>
            {/* bottom class ends */}
    

        </div>
        // chat main container ends

    )
}

export default Chat;