import '../CSS/Sidebar.css'
import { Link } from 'react-router-dom';
import homeIcon from '../assets/home.png';
import chatIcon from '../assets/chat2.jpg';
import chatbotIcon from '../assets/chatbot.svg';
import awarenessIcon from '../assets/law.png';
import loginIcon from '../assets/login-img.svg';
import Logo from '../assets/logo.svg';
const Sidebar = () =>
    {
        return (
            <>
            {/* Sidebar */}
    <div className="sidebar">
        <div className="justice-side-logo">
        <img src={Logo} alt="Logo"/>
        </div>

        <ul className="link-list">
                <li><Link to="/"><img src={homeIcon} alt="Home" height="35" width="35" /></Link></li>
                    <li><Link to="/interface"><img src={chatIcon} alt="Interface" height="40px" width="40px" id="chat-img" /></Link></li>
                    <li><Link to="/chatbot"><img src={chatbotIcon} alt="Chatbot" height="35px" width="35px" /></Link></li>
                    <li><Link to="/awareness"><img src={awarenessIcon} alt="Awareness" height="35px" width="35px" /></Link></li>
                    <li><Link to="/login"><img src={loginIcon} alt="Login" height="35px" width="35px" /></Link></li>
        </ul>
    </div>
            {/* Sidebar Ends */}
            </>
        )
    }

export default Sidebar;
