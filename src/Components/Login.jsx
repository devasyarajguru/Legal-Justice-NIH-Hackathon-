import { toast } from 'react-toastify'
import '../CSS/Login.css'
import LoginForm from '../assets/loginform2.jpg'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {auth} from './lib/firebase'
// import { doc, setDoc } from "firebase/firestore"; 
import { signInWithEmailAndPassword } from 'firebase/auth';

// 1:56:21
const Login = () =>
    {
        // Handling the form Data
        const[loginData,setLoginData] = useState({
            email:'',
            password:''
        })

        // Setting the loading state
        const[loading,setLoading] = useState(false)

        // Storing errors
        const[errors,setErrors] = useState({})
        
        // Validating the form

        {/* -----------INCOMPLETE -------------- */}
        
        const validateForm = () =>
        {
            const newErrors = {};
            // Email validation
            if(!loginData.email.trim())
            {
                newErrors.email = "Email is required"
            }

            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email))
            {
                newErrors.email = "Email is not valid";
            }

            // Password validation
            if(!loginData.password.trim())
            {
                newErrors.password = "Password is required";
            }

            else if (loginData.password.length < 6)
            {
                newErrors.password = "Password must be at least 6 characters";
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0; // Return the function with 0 error in the newErrors object by checking their key's length

        }

        // Handling the Login form after submission
        const handleLogin = async (e) =>
        {
            e.preventDefault();

            // Validate form before proceeding
            if(!validateForm()) return;
            setLoading(true);

            const { email, password } = loginData;

            try
            {
                const userCredential =  await signInWithEmailAndPassword(auth,email,password)
                const user = userCredential.user // Extract the user object
                console.log("Logged in user: " , user.email)
                toast.success(`Welcome back!`)
            }
            catch(err)
            {
                console.log("Login error:",err.code , err.message);


                if (err.code === 'auth/user-not-found') {
                    toast.error("User not found. Please check your credentials or sign up.");
                } else if (err.code === 'auth/wrong-password') {
                    toast.error("Incorrect password. Please try again.");
                } else if (err.code === 'auth/invalid-credential') {
                    toast.error("Invalid credentials. Please try again.");
                } else {
                    toast.error("An error occurred. Please try again later.");
                }
            }

            finally
            {
                setLoading(false)
            }
        }

        // Handling the change values in form
        const handleChange = e =>
        {
            setLoginData({...loginData,
                [e.target.name]:e.target.value
            })
        }

        return (
            <>
            {/* Login container starts */}
            <div className="login-container">
                {/* Form section starts*/}
                <section className="form-section">
                    {/* Container starts */}
                    <div className="container">
                        <div className="row no-gutters">
                            <div className="col-left">
                                <img src={LoginForm} className="img-fluid" alt="login form image" />
                            </div>
                        <div className="col-right">
                            <h1 className="header-text">Welcome To Legal Help Office</h1>
                            <h4>Sign into your account</h4>

                            {/* Form starts */}
                            <form id="loginForm" onSubmit={handleLogin}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Email address" 
                                        id="EmailInput" 
                                        className="form-control" 
                                        value={loginData.email}
                                        onChange={handleChange} />
                                        {errors && <div id="EmailError" className="error-message">{errors.email}</div>}
                                    </div>
                                    <div className="form-group">
                                        <input type="password" name="password" placeholder="Password" id="passwordInput" className="form-control" 
                                        value={loginData.password}
                                        onChange={handleChange} />
                                  {errors &&  <div id="passwordError" className="error-message">{errors.password}</div>}
                                    </div>
                                    <div className="form-group">
                                    <button id="loginbtn" className="btn" aria-pressed="true" disabled={loading}> <span>{loading ? "Loading..." : "Login"}</span></button>
                                    <div className="signup-container">
                                        <p className="message">Don't have an account?</p>
                                        <Link to="/signup"><button className="signup-button">Sign Up Now</button></Link>
                                    </div>
                                    </div>
                                </div>
                            </form>
                            {/* Form ends */}

                        </div>
                        </div>
                    </div>
                    {/* Container ends */}

                </section>
                {/* Form section ends*/}

            </div>
            {/* Login container ends */}
            </>
        )
    }

export default Login;
