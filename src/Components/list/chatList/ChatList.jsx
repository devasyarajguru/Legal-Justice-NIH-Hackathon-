import './chatList.css'
import searchImg from './assets/search.png';
import plusImg from './assets/plus.png';
import minusImg from './assets/minus.png';
import avatar from '../userinfo/assets/avatar.png';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../lib/userStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';


const ChatList = () =>
    {
        const [chats, setChats] = useState([])
        const [addMode , setaddMode] = useState(false);
        const [searchItem, setSearchItem] = useState("");

        const {currentUser} = useUserStore();

        // Getting the chat list of the current user
        useEffect(() =>
        {
            if(currentUser && currentUser.id)
            {
                const unSub = onSnapshot(doc(db, "userchats", currentUser.id), (doc) => {
                    if(doc.exists())
                    {
                        setChats(doc.data());
                    }

                    else
                    {
                        console.log("No such Document!")
                        setChats({});
                    }
                    
                } , (error) =>
                {
                    console.log("Error while fetching details" , error)
                });
            
            return () =>
            {
                unSub()
            }

        }

        },[currentUser.id])

        console.log(chats)

        // Example list of chat items with names
    const chatItems = [
        { id: 1, name: 'Devasya Rajguru', message: 'Hello My name is Devasya. I have reached out to you for some work' },
        { id: 2, name: 'John Doe', message: 'Hi, I need your help with a project.' },
        { id: 3, name: 'Jane Smith', message: 'Can we discuss the report?' },
        { id: 4, name: 'Gunj Trivedi', message: 'I am Backend developer' },
        { id: 5, name: 'Kush Patel', message: 'Can we discuss the report?' },
        { id: 6, name: 'Jainil', message: 'Can we discuss the report?' },
        { id: 7, name: 'Khushi', message: 'Can we discuss the report?' },
        { id: 8, name: 'Krish', message: 'Can we discuss the report?' },
    ];

    // Function to Filter out names
    const filterChats = chatItems.filter(item =>
        item.name.toLowerCase().includes(searchItem.toLowerCase()) // checks if the name is there in object and in the searched bar value
    )

        return (
            // chatList main container starts
            <div className="chatList">
                    {/* search class starts */}
                <div className="search">
                    <div className="searchBar">
                        <img src={searchImg} alt='search-Image'/>
                        <input 
                        type='text' 
                        placeholder='Search'
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}/> {/* Values changing for setSearchItem on the onChange */}
                    </div>
                    <img src={addMode ? minusImg: plusImg} alt='plusImg' className='add-btn' onClick={() => setaddMode((prev) => !prev)}/>
                </div>
                    {/* search class ends */}

                {/* Chat item starts*/} 

                {/* Displaying names of users also with filer values if search through searchBar */}
                {filterChats.map(item => (
                    <div className="item" key={item.id}>
                        <img src={avatar} alt='user' />
                        <div className="texts">
                            <span>{item.name}</span>
                            <p className='texts-p'>{item.message}</p>
                        </div>
                    </div>
                ))}

                {/* Chat item ends*/}
            
                
            </div>
            // chatList main container ends

        )
    }
    
    export default ChatList;