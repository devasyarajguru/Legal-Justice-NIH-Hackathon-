import './chat.css'
import avatar from './assets/avatar.png';
import emoji from './assets/emoji.png';
import img from './assets/img.png';
import camera from './assets/camera.png';
import mic from './assets/mic.png';
import EmojiPicker from 'emoji-picker-react';
import {useState} from 'react'

const Chat = () =>
{ 
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
                            <p className="sender-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nesciunt placeat quas, sit neque illo ad fuga voluptatibus ea quae? Eveniet quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.
                                
                            </p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message own">
                        <div className="chat-texts">
                            <img src="https://picsum.photos/200/300" className='sender-image'/>
                            <p className="own-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nesciunt placeat quas, sit neque illo ad fuga voluptatibus ea quae? Eveniet quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.</p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message">
                    <img src={avatar} alt='avatar' className="user-avatar"/>
                        <div className="chat-texts">
                            <p className="sender-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nesciunt placeat quas, sit neque illo ad fuga voluptatibus ea quae? Eveniet quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.</p>
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
                            <p className="sender-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nesciunt placeat quas, sit neque illo ad fuga voluptatibus ea quae? Eveniet quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.</p>
                            <span>1 min ago</span>
                        </div>
                </div>
                <div className="chat-message own">
                        <div className="chat-texts">
                            <p className="own-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nesciunt placeat quas, sit neque illo ad fuga voluptatibus ea quae? Eveniet quibusdam facilis, omnis placeat deserunt odit! Obcaecati, quisquam ipsa.</p>
                            <span>1 min ago</span>
                        </div>
                </div>
            </div>
            {/* Center class ends */}

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