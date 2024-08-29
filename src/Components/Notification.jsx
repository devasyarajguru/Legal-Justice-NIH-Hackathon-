import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () =>
{
    return (
        <>
            <ToastContainer 
            position="top-center"
            autoClose={2000}
            />
        </>
    )
}

export default Notification;