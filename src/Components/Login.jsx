import '../CSS/Login.css'
import LoginForm from '../assets/loginform2.jpg'
import { Link } from 'react-router-dom'
const Login = () =>
    {
        return (
            <>
            <div className="login-container">
                <section className="form-section">
    <div className="container">
        <div className="row no-gutters">
            <div className="col-left">
                <img src={LoginForm} className="img-fluid" alt="login form image" />
            </div>
            <div className="col-right">
                <h1 className="header-text">Welcome To Legal Help Office</h1>
                <h4>Sign into your account</h4>
                <form id="loginForm" method="POST">
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
            </div>
        </div>
    </div>
</section>
</div>
            </>
        )
    }

export default Login;
