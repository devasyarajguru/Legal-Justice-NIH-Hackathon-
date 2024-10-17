import './chatList.css'
import searchImg from './assets/search.png';
import plusImg from './assets/plus.png';
import minusImg from './assets/minus.png';
import avatar from '../userinfo/assets/avatar.png';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../lib/userStore';
import { doc, onSnapshot , getDoc} from 'firebase/firestore';
import { db } from '../../lib/firebase';


// 2:14:20
const ChatList = () =>
    {
        const [chats, setChats] = useState([])  // chats from firestore database variable
        const [addMode , setaddMode] = useState(false); // + - adding mode variable
        const [searchItem, setSearchItem] = useState(""); // searching user names variable

        const {currentUser} = useUserStore(); // getting the current user from userStore

        // Getting the chat list of the current user
        useEffect(() =>
        {
            // If there is current user and id exist
            if(currentUser && currentUser.id)
            {
                // Firestore database document using onSnapshot. --> onSnapshot is a real-time listener that allows you to recieve updates whenever data in firestore changes just like chats of user changes. 

                // Every time the document changes (e.g., a new message is sent), the callback function (res parameter) is triggered with the latest document snapshot.

                const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
                    // If the document exits
                    if(res.exists())
                    {
                        const items = res.data().chats; // getting the chats of list of users ,eg. -  5 users 5 chats
                    
                        /*{
                            "chats": [
                              {
                                "receiverID": "user1",
                                "lastMessage": "Hello!",
                                "timestamp": "2024-10-15T12:00:00"
                              },
                              {
                                "receiverID": "user2",
                                "lastMessage": "How are you?",
                                "timestamp": "2024-10-15T14:30:00"
                              }, */

                        // use of promise to fetch data of each chat conversations of authenticated users by receiver id 
                        const promises = items.map (async (item) =>
                        {
                            const userDocRef = doc(db, "users", item.receiverID);
                            const userDocSnap = await getDoc(userDocRef);

                            const user = userDocSnap.data()

                            return {...item , user}
                        })

                        const chatData = await Promise.all(promises)  // would be necessary to ensure that it wait for all the async getDoc calls to complete.

                        setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
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


    // Function to Filter out names
    const filterChats = chats.filter(item =>
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
                    <div className="item" key={item.chatid}>
                        <img src={avatar} alt='user' />
                        <div className="texts">
                            <span>{item.name}</span>
                            <p className='texts-p'>{item.lastMessage}</p>
                        </div>
                    </div>
                ))}

                {/* Chat item ends*/}
                
            </div>
            // chatList main container ends

        )
    }
    
    export default ChatList;