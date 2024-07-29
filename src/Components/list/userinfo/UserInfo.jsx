import './userInfo.css'
import avatar from './assets/avatar.png';
import video from './assets/video.png';
import edit from './assets/edit.png';
import more from './assets/more.png';

const UserInfo = () =>
    {
        return (
            // UserInfo Starts
        <div className="userInfo">
                {/* user class starts */}
            <div className="user">
                <img src={avatar} alt="user" className='user-img' />
                <h2>Devasya Rajguru</h2>
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