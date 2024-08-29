import { toast } from 'react-toastify'
import '../CSS/Login.css'
import LoginForm from '../assets/loginform2.jpg'
import { Link } from 'react-router-dom'
const Login = () =>
    {
        // Handling the Login form after submission
        const handleLogin = e =>
        {
            e.preventDefault()
            toast.success("Success")
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
                                        <input type="email" name="email" placeholder="Email address" id="EmailInput" className="form-control" required />
                                    <div id="EmailError" className="error-message"></div>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" name="password" placeholder="Password" id="passwordInput" className="form-control" required />
                                    <div id="passwordError" className="error-message"></div>
                                    </div>
                                    <div className="form-group">
                                    <button id="loginbtn" className="btn" aria-pressed="true"> <span>Login</span></button>
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
