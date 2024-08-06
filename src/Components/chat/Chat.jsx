import './chat.css'
import avatar from './assets/avatar.png';

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
            <div className="bottom"></div>
        </div>
        // chat main container ends

    )
}

export default Chat;