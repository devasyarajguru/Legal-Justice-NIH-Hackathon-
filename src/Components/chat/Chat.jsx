import './chat.css'
import avatar from './assets/avatar.png';

const Chat = () =>
{
    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={avatar} alt='user'/>
                    <div className="texts">
                        <span>Devasya Rajguru</span>
                        <p>Bio goes here</p>
                    </div>
                </div>
                <div className="icons">
                    
                </div>
            </div>
            <div className="center"></div>
            <div className="bottom"></div>

        </div>
    )
}

export default Chat;