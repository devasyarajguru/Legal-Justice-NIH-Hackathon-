import '../CSS/Sidebar.css'
import { Link } from 'react-router-dom';
import homeIcon from '../assets/home.png';
import chatIcon from '../assets/chat2.jpg';
import chatbotIcon from '../assets/chatbot.svg';
import awarenessIcon from '../assets/law.png';
import loginIcon from '../assets/login-img.svg';
const Sidebar = () =>
    {
        return (
            <>
            {/* Sidebar */}
    <div className="sidebar">
        <div className="justice-side-logo">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="white"/>
                <path d="M53.3273 21.0687V14.2222H10.667V21.0687H12.7577V16.3372H17.0854V44.0124L12.3066 40.7081L11.1245 42.4502L32.0003 56.8889L52.8761 42.4502L51.6941 40.7081L46.9152 44.0124V16.3372H51.2429V21.0687H53.3337H53.3273ZM30.9518 53.6039L26.1094 50.2546V16.3372H30.9518V53.6039ZM33.0425 16.3372H37.8849V50.2546L33.0425 53.6039V16.3372ZM19.1698 16.3372H24.0122V48.8081L19.1698 45.4588V16.3372ZM44.8181 45.4588L39.9757 48.8081V16.3372H44.8181V45.4588Z" fill="#4F5DFC"/>
                </svg>  
        </div>

        <ul className="link-list">
        <li><Link to="/"><img src={homeIcon} alt="Home" height="35" width="35" /></Link></li>
                    <li><Link to="/interface"><img src={chatIcon} alt="Interface" height="40" width="40" id="chat-img" /></Link></li>
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
