import '../CSS/Home.css'
// import SlideInnerSvg from '../assets/slide-inner.svg';
import MainHouseSvg from '../assets/main-house.svg';

const Home = () =>
    {
        return (
            <>
    {/* <!--home-container Starts--> */}
    <div className="home-container">
        {/* <!--Left Side Starts--> */}
        <div className="home-left-side">
        <p>
          Empowering Legal Awareness and Compliance in India
        </p>
        </div>
        {/* <!--Left Side Ends--> */}

        {/* <!--Right Side Starts--> */}
        <div className='home-right-side'>
        <div className="grey-div first">
        </div>
            <img src={MainHouseSvg} className="main-house-svg" alt="my image" />
        <div className="grey-div second">
        </div>
        </div>
        {/* <!--Right Side Ends--> */}
    </div>
    {/* <!--home-container Ends--> */}

    {/* Note: In the previous code there was separate right side div after home container */}

            </>
        )
    }

export default Home;
