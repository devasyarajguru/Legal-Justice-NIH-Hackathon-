{/* Create Avatar or Upload Photo */}
import { useState } from 'react';
import '../CSS/SignUp.css'
import myAvatar from "../assets/avatar.png"
import { toast } from 'react-toastify';
import Notification from '../Components/Notification'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {auth,db} from './lib/firebase'
import { doc, setDoc } from "firebase/firestore"; 
import upload from './lib/upload';
import { useNavigate } from 'react-router-dom';



const SignUp = () =>
    {
        const navigate = useNavigate();

        // Loading symbol when submitted
        const [loading,setLoading] = useState(false)

        // Setting Avatar state with file selection and URl to display
        const[avatar,setAvatar] = useState(
            {
            file:null,
            url:""
            }
        );

        // Handling avatar to set file selection and URL to display
        const handleAvatar = (e) =>
        {
            // if the file is selected , set the avatar state to the file and the url to the file
            if(e.target.files[0]) // first file in the array
            {
                setAvatar(
                    {
                        file: e.target.files[0], // file is the selected file
                        url:URL.createObjectURL(e.target.files[0]) // URL.createObjectURL is used to create a URL for the selected file , to display the image
                    }
                )

            }
        }

        
        // Handling form Data
        const [formData,setFormData] = useState({
            username:"",
            email:"",
            password:"",
        });

         // Handling the change values in form

         const handleChange = e =>
            {
                setFormData(
                    {...formData,
                        [e.target.name]:e.target.value  // spread operator 
                    }
                )
            }


        // Storing errors
        const [errors,setErrors] = useState({});


        // Validating the form
        const validateForm = () =>
        {
            const newErrors = {};

            if(!formData.username.trim())
            {
                newErrors.username = "Username is required"   
            }

            else if (formData.username.length > 20) {
            newErrors.username = "Username cannot exceed 20 characters";
            }

            if (!formData.email.trim()) {
                newErrors.email = "Email is required"; 
            }

            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Email is not valid";
            }

            if (!formData.password.trim()) {
                newErrors.password = "Password is required";
            }

            else if (formData.password.length < 8) {
                newErrors.password = "Password must be at least 8 characters long";
            }

            else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one uppercase letter";
            }

            else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one lowercase letter";
            }

            else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one number";
            }    

            setErrors(newErrors); // setting the errors to the new errors
            return Object.keys(newErrors).length === 0; // checking if the new errors are empty or not , if empty then return true

        }


        // Handling the form after submission
            const handleSubmit = async (e) =>
                {
                    e.preventDefault(e.target)

                    const formData = new FormData(e.target);  // FormData constructor which gathers the key/value pairs from the form for eg. username , email and password

                    const {username , email, password} = Object.fromEntries(formData);   // It is a method that transforms a list of key-value pairs into an Object. In Object keys are the form field names and the values are form field values

                    if(!validateForm()) // checking if the form is valid or not
                        {
                            // if the form is not valid then show the error message
                            toast.error("Please check all the required fields");
                            return;
                        }

                    try 
                    {
                        setLoading(true);
                        const res = await createUserWithEmailAndPassword(auth,email,password) // Creating a new user with email and password

                        // if the avatar is selected and the file is selected then upload the image to the firebase
                        let imgURL = ''; // Will store Firebase Storage URL
                        if (avatar && avatar.file)
                        {
                            try
                            {
                                imgURL = await upload(avatar.file) // uploading image to the firebase. The image is which we have choosen for avatar image
                            }
                            catch(uploadError)
                            {
                                // if there is an error in uploading the image then show the error message
                                console.log("Error uploading image: ",uploadError);
                                toast.error("Error uploading image: " + uploadError.message);
                                setLoading(false);
                                return;

                            }
                            
                        }      

                        else
                        {
                            imgURL = myAvatar; // Use default avatar if no image is selected
                        }

                        // setting the user data to the firestore database collection "users"
                        await setDoc(doc(db, "users", res.user.uid), {
                            username,
                            email,
                            avatar:imgURL, // Store permanent URL in Firestore database
                            password,
                            blocked:[]
                        });

                        // setting the user chats to the firestore database collection "userchats"

                        // setting the chats to the firestore database collection "userchats"
                        await setDoc(doc(db, "userchats", res.user.uid), {
                            chats:[] // empty array to store the chats in the chatlist
                        });

                        toast.success("Signup successful");
                        navigate("/interface" , {replace:true}) // navigating to the interface page

                    }
                    catch(error)
                    {
                        console.log("Firestore error: ",error);
                        toast.error("Error while adding user: " + error.message)
                        setLoading(false);

                    }
            }    


        return (
            <>
            <Notification />
            {/* Sign Up body */}
        <div className="sign-up-body">
            {/* Main Container starts */}
            <div className="main-signup-container">
                {/* Form starts */}
                <form id="form" className="form" onSubmit={handleSubmit}>
                    <h2>Register With Us</h2>
                    <div className="form-control">
                        <div className='file-handling'>
                        <label htmlFor="file" id='myfile'>
                            <span>Upload an image</span></label>
                            <input type="file" id="file" name="file" style={{display:"none"}} onChange={handleAvatar}/>
                            {/* avatar.url is the url of the image that we have selected for avatar , if not selected then it will be myAvatar */}
                            <img src={avatar.url || myAvatar}  alt='avatar-dp' />
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Enter Username" 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error-input' : ''}/>
                     {errors.username && <small className="error-message">{errors.username}</small>}   
                    </div>
    
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="text" 
                            id="email" 
                            name="email" 
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error-input' : ''}/>
                        {errors.email && <small className="error-message">{errors.email}</small>}
                    </div>
    
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error-input' : ''}/>
                       {errors.password && <small className="error-message">{errors.password}</small>}
                    </div>
                    {/* {successMessage && <div className="success-message">{successMessage}</div>} */}
                    <button disabled={loading}>{loading ? "Loading..." : "Submit"}</button>
                </form>
                {/* Form ends */}

            </div>
            {/* Main Container ends */}

        </div>
            {/* Sign Up body */}

            </>
        )
    }

export default SignUp;
