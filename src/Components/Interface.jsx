import '../CSS/Interface.css'
import Chat from './chat/Chat';
import Detail from './detail/Detail';
import List from './list/List';
import Login from '../Components/Login'
import Notification from '../Components/Notification'

const Interface = () =>
    {
        const user = true
        return (
            <>
            <div className="main-interface">  
                {
                    user ? 
                (
                    <>
                    <List />
                    <Chat />
                    <Detail />
                    </>
                ) 
                    : (
                        <>
                        <div className='login-wrapper'>
                            <Login/>
                        </div>
                    </>
                )
                }
                <Notification />
            </div>
            </>
        )
    }

export default Interface;
