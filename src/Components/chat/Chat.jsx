import './chat.css'
import avatar from './assets/avatar.png';
import emoji from './assets/emoji.png';
import img from './assets/img.png';
import camera from './assets/camera.png';
import mic from './assets/mic.png';

const Chat = () =>
{
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

            <div className="center"></div>
            {/* bottom class starts */}
            <div className="bottom">
                <input type='text' placeholder='Type a message...'/>
                <div className="emoji">
                    <div className="bottom-icons">
                        <img src={img} alt=''/>
                        <img src={camera} alt=''/>
                        <img src={mic} alt=''/>
                    </div>
                    <img src={emoji} />
                </div>
                <button className="sendButton">Send</button>
            </div>
            {/* bottom class ends */}

        </div>
        // chat main container ends

    )
}

export default Chat;