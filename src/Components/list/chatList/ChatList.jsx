import './chatList.css'
import searchImg from './assets/search.png';
import plusImg from './assets/plus.png';
import minusImg from './assets/minus.png';
import avatar from '../userinfo/assets/avatar.png';

import { useState } from 'react';


const ChatList = () =>
    {
        
        const [addMode , setaddMode] = useState(false);
        return (
            // chatList main container starts
            <div className="chatList">
                    {/* search class starts */}
                <div className="search">
                    <div className="searchBar">
                        <img src={searchImg} alt='search-Image'/>
                        <input type='text' placeholder='Search'/>
                    </div>
                    <img src={addMode ? minusImg: plusImg} alt='plusImg' className='add-btn' onClick={() => setaddMode((prev) => !prev)}/>
                </div>
                    {/* search class ends */}

                {/* Chat item starts*/}
          
                <div className="item">
                    <img src={avatar} alt='user'/>
                    <div className="texts">
                        <span>Devasya Rajguru</span>
                        <p>Hello</p>
                    </div>
                </div>
                <div className="item">
                    <img src={avatar} alt='user'/>
                    <div className="texts">
                        <span>Devasya Rajguru</span>
                        <p>Hello</p>
                    </div>
                </div>
                <div className="item">
                    <img src={avatar} alt='user'/>
                    <div className="texts">
                        <span>Devasya Rajguru</span>
                        <p>Hello</p>
                    </div>
                </div>
                <div className="item">
                    <img src={avatar} alt='user'/>
                    <div className="texts">
                        <span>Devasya Rajguru</span>
                        <p>Hello</p>
                    </div>
                </div>
                
            </div>
            // chatList main container ends

        )
    }
    
    export default ChatList;