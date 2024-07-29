import '../CSS/Interface.css'
import Chat from './chat/Chat';
import Detail from './detail/Detail';
import List from './list/List';

const Interface = () =>
    {
        return (
            <>
            <div className="main-interface">
                <List />
                <Chat />
                <Detail />
            </div>
            </>
        )
    }

export default Interface;
