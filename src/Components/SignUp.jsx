{/* Create Avatar or Upload Photo */}
import { useState } from 'react';
import '../CSS/SignUp.css'
import myAvatar from "../assets/avatar.png"
import { toast } from 'react-toastify';
import Notification from '../Components/Notification'


const SignUp = () =>
    {
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

        
        // Handling form Data
        const [formData,setFormData] = useState({
            username:"",
            email:"",
            password:"",
        });


        // Storing errors
        const [errors,setErrors] = useState({});


        // Validating the form
        const validateForm = () =>
        {
            const newErrors = {};

            if(!formData.username.trim())
            {
                newErrors.username = "Username is required"   // Object newErros creates key of username
            }

            else if (formData.username.length > 20) {
            newErrors.username = "Username cannot exceed 20 characters";
            }

            if (!formData.email.trim()) {
                newErrors.email = "Email is required"; // Object newErros creates key of email
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

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;

        }


         // Handling the change values in form

         const handleChange = e =>
            {
                setFormData(
                    {...formData,
                        [e.target.name]:e.target.value  // spread operator 
                    }
                )
            }


        // Handling the form after submission
        const handleSubmit = (e) =>
            {
                e.preventDefault(e.target)

                const formData = new FormData(e.target);  // FormData constructor which gathers the key/value pairs from the form for eg. username , email and password

               
                const {username , email, password} = Object.fromEntries(formData);   // It is a method that transforms a list of key-value pairs into an Object. In Object keys are the form field names and the values are form field values

                console.log(username,email, password)

                if(validateForm())
                {
                    toast.success("Form Submitted successfully!")
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
                    <button>Submit</button>
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
