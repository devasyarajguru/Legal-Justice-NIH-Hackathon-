import '../CSS/Login.css'
import LoginForm from '../assets/loginform2.jpg'
const Login = () =>
    {
        return (
            <>
                <section className="form-section">
    <div className="container">
        <div className="row no-gutters">
            <div className="col-left">
                <img src={LoginForm} className="img-fluid" alt="login form image" />
            </div>
            <div className="col-right">
                <h1 className="header-text">Welcome To LegalHelpOffice</h1>
                <h4>Sign into your account</h4>
                <form id="loginForm" method="POST">
                    <div className="form-row">
                        <div className="form-group">
                            <input type="email" name="mobile" placeholder="Email address" id="EmailInput" className="form-control" required />
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
                                <button className="signup-button"><a href="../files/signup.html">Sign Up Now </a></button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
            </>
        )
    }

export default Login;
