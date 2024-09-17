import { toast } from 'react-toastify'
import '../CSS/Login.css'
import LoginForm from '../assets/loginform2.jpg'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {auth,db} from './lib/firebase'
import { doc, setDoc } from "firebase/firestore"; 
import { signInWithEmailAndPassword } from 'firebase/auth';

// 1:47:57
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
            if(!loginData.email.trim())
            {
                newErrors.email = "Email is required"
            }

            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email))
            {
                newErrors.email = "Email is not valid"
            }


        }

        // Handling the Login form after submission
        const handleLogin = async (e) =>
        {
            e.preventDefault()
            setLoading(true);

            const { email, password } = loginData;
            
            try
            {
                await signInWithEmailAndPassword(auth,email,password)
            }
            catch(err)
            {
                console.log(err)
                toast.error(err.message)
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
                                    <div id="EmailError" className="error-message"></div>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" name="password" placeholder="Password" id="passwordInput" className="form-control" 
                                        value={loginData.password}
                                        onChange={handleChange} />
                                    <div id="passwordError" className="error-message"></div>
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
