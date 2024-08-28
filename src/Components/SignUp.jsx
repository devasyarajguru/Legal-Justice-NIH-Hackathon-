{/* Create Avatar or Upload Photo */}
import { useState } from 'react';
import '../CSS/SignUp.css'
import myAvatar from "../assets/avatar.png"

const SignUp = () =>
    {
        const[avatar,setAvatar] = useState(
            {
            file:null,
            url:""
            }
        );

        const handleAvatar = (e) =>
        {
            if(e.target.files[0])
            {
                setAvatar(
                    {
                        file: e.target.files[0],
                        url:URL.createObjectURL(e.target.files[0])
                    }
                )

            }
        }


        return (
            <>
        <div className="sign-up-body">
            <div className="main-signup-container">
                <form id="form" className="form">
                    <h2>Register With Us</h2>
                    <div className="form-control">
                        <div className='file-handling'>
                        <label htmlFor="file" id='myfile'>
                            <span>Upload an image</span></label>
                            <input type="file" id="file" name="file" style={{display:"none"}} onChange={handleAvatar}/>
                            <img src={avatar.url || myAvatar}  alt='avatar-dp' />
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder="Enter Username" name="username"/>
                        <small>Error Message</small>
                    </div>
    
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Enter email"/>
                        <small>Error Message</small>
                    </div>
    
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter password"/>
                        <small>Error Message</small>
                    </div>
                    <button>Submit</button>
                </form>
            </div>
        </div>
            </>
        )
    }

export default SignUp;
