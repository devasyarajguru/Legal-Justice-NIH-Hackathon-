import './chatList.css'
import searchImg from './assets/search.png';
import plusImg from './assets/plus.png';
import minusImg from './assets/minus.png';
import avatar from '../userinfo/assets/avatar.png';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../lib/userStore';
import { doc, onSnapshot , getDoc, setDoc} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import NewUser from './newUser/NewUser'


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

            const createEmptyChats = async () =>
            {   
                try {
                    await setDoc(doc(db , "userchats" , currentUser.id) , {chats: []}); // setting the chats to empty array so that we can store the chats of users in it and onSnapshot can listen to it , otherwise it will not listen to it
                    console.log("New userchats document created for:", currentUser.id);
                }

                catch(error)
                {
                    console.error("Error creating userchats document:" , error);
                }
            }

            // If there is current user and id exist
            if(currentUser?.id)
            {
                // Firestore database document using onSnapshot. --> onSnapshot is a real-time listener that allows you to recieve updates whenever data in firestore changes just like chats of user changes. 

                // Every time the document changes (e.g., a new message is sent), the callback function (res parameter) is triggered with the latest document snapshot.

                const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
                    // If the document exits  
                    try{
                    if(res.exists())
                    {
                        // getting the chats of list of users ,eg. -  5 users 5 chats
                        const items = res.data().chats || []; // empty array if no chats
                        console.log("Raw chat Items from firebase: ", items)
                    
                        /*{
                            "chats": [
                              {
                                "receiverID": "user1",
                              },
                              {
                                "receiverID": "user2",
                              }, */

                    
                        // Map through each chat item and create promises to fetch user data for each receiver
                        const promises = items.map (async (item) =>
                        {
                            // Add null check for receiverID
                            if(!item?.receiverId)
                            {
                                console.log("No receiverID found for item: ", item)
                                return null;
                            }

                            try
                            {

                            const userDocRef = doc(db, "users", item.receiverId);
                            const userDocSnap = await getDoc(userDocRef);

                            if(!userDocSnap.exists())
                            {
                                console.log("No user document found for: ", item.receiverID)
                                return null;
                            }

                            const userData = userDocSnap.data()

                            return {
                                ...item , 
                                user:userData,
                                updatedAt: item.updatedAt || Date.now()
                            };
                        }
                        catch(error)
                        {
                            console.error("Error fetching user document: ",error);
                            return null;
                        }
                        })

                        const chatData = (await Promise.all(promises))
                        .filter(chat => chat !== null)
                        .sort((a,b) => (b?.updatedAt || 0) - (a?.updatedAt || 0))

                        setChats(chatData)
                    }

                    else
                    {
                        console.log("No userchats document found , creating one...")
                        await createEmptyChats();
                        setChats([]);
                    }
                    
                } catch (error) 
                {
                    console.log("Error in snapshot listener" , error);
                    setChats([]);
                }
                });
            
            return () =>
            {
                unSub()
            }

        }

        },[currentUser?.id])


    // Function to Filter out names
    const filterChats = chats.filter(item =>
        item?.user?.username?.toLowerCase().includes(searchItem.toLowerCase())
       /* item && item.user && item.user.name && item.user.name.toLowerCase().includes(searchItem.toLowerCase()) */
        // checks if the name is there in object and in the searched bar value
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
                    <div className="item" key={item.chatId}>
                        <img src={item.user?.avatar||avatar} alt='user' />
                        <div className="texts">
                            <span>{item.user?.username || "Unknown user"}</span> 
                            <p className='texts-p'>{item.lastMessage || "No messages yet"}</p>
                        </div>
                    </div>
                ))}

                {/* Chat item ends*/}
                {addMode && <NewUser />}
            </div>
            // chatList main container ends

        )
    }
    
    export default ChatList;