import '../CSS/Home.css'
// import SlideInnerSvg from '../assets/slide-inner.svg';
import MainHouseSvg from '../assets/main-house.svg';

const Home = () =>
    {
        return (
            <>
    {/* <!--home-container--> */}
    <div className="home-container">
        {/* <!--Left Side Starts--> */}
        <div className="home-left-side">
        <p>
          Empowering Legal Awarene<span style={{"color":"white"}}>ss </span>and Compliance in India
        </p>
        </div>
        {/* <!--Left Side Ends--> */}

        {/* <!--Right Side Starts--> */}
        <div className='home-right-side'>
        <div className="grey-div first">
        </div>
            <img src={MainHouseSvg} className="main-house-svg" alt="my image"/>
        <div className="grey-div second">
        </div>
        </div>
        {/* <!--Right Side Ends--> */}
    </div>
    {/* <!--home-container--> */}

            </>
        )
    }

export default Home;
