import './userInfo.css'
import avatar from './assets/avatar.png';
import video from './assets/video.png';
import edit from './assets/edit.png';
import more from './assets/more.png';
import { useUserStore } from '../../lib/userStore';

const UserInfo = () =>
    {
        const {currentUser} = useUserStore();

        return (
            // UserInfo Starts
        <div className="userInfo">
                {/* user class starts */}
            <div className="user-chatList">
                <img src={currentUser.avatar || avatar} alt="user" className='user-img' />
                <h2>{currentUser.username}</h2>
            </div>
                {/* user class ends */}

                {/* icons class starts */}
            <div className="icons">
                <img src={more} alt='more' />
                <img src={video} alt='video' />
                <img src={edit} alt='edit' />
            </div>
                {/* icons class ends */}
        </div>
            // UserInfo Ends

        )
    }
    
    export default UserInfo;