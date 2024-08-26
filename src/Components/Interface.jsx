import '../CSS/Interface.css'
import Chat from './chat/Chat';
import Detail from './detail/Detail';
import List from './list/List';
import Login from '../Components/Login'

const Interface = () =>
    {
        const user = false
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
                    : (<Login/>)
                }
               
            </div>
            </>
        )
    }

export default Interface;
