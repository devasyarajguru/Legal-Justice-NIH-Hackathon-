import './detail.css'
import avatar from './assets/avatar.png';
import mail from './assets/mail.png'; 
import download from './assets/download.png'; 
import { auth } from '../lib/firebase';
// import call from './assets/call.png'; 
// import video from './assets/video.png'; 


const Detail = () =>
    {
        return (
            // detail class starts
            <div className="detail">
                {/*  user class starts */}
                <div className="detail-user">
                    <img src={avatar} alt="user" className='detail-user-image'/>
                    <h2>Some User</h2>
                    <div className="icons">
                        {/* <img src={mail} alt='mail' className='mail-icon'/> */}
                        {/* <img src={call} alt='more' />
                        <img src={video} alt='video' /> */}
                    </div>
                </div>
                {/*  user class ends */}

                {/* Info class starts */}
                <div className="detail-info">
                    {/* option class starts */}
                    <div className="detail-option">
                        <div className="detail-title">
                            <span className='detail-span'>Shared Files</span>
                        </div>
                        {/* photos class starts */}
                        <div className="photos">
                             {/* photoItem */}
                            <div className="photoItem">
                                {/* Photo Detail */}
                                <div className="photoDetail">
                                    <img src="https://picsum.photos/200/300" alt="image"/>
                                    <span>Photo name</span>
                                </div>
                                {/* Photo Detail */}

                                <img src={download} className='download-icon'/>
                            </div>
                             {/* photoItem */}


                              {/* photoItem */}
                            <div className="photoItem">
                                {/* Photo Detail */}
                                <div className="photoDetail">
                                    <img src="https://picsum.photos/200/300" alt="image"/>
                                    <span>Photo name</span>
                                </div>
                                {/* Photo Detail */}

                                <img src={download} className='download-icon'/>
                            </div>
                             {/* photoItem */}



                              {/* photoItem */}
                            <div className="photoItem">
                                {/* Photo Detail */}
                                <div className="photoDetail">
                                    <img src="https://picsum.photos/200/300" alt="image"/>
                                    <span>Photo name</span>
                                </div>
                                {/* Photo Detail */}

                                <img src={download} className='download-icon'/>
                            </div>
                             {/* photoItem */}


                              {/* photoItem */}
                            <div className="photoItem">
                                {/* Photo Detail */}
                                <div className="photoDetail">
                                    <img src="https://picsum.photos/200/300" alt="image"/>
                                    <span>Photo name</span>
                                </div>
                                {/* Photo Detail */}

                                <img src={download} className='download-icon'/>
                            </div>
                             {/* photoItem */}

                        </div>
                        {/* photos class ends */}

                    </div>
                    {/* option class ends */}
                        <div className='buttonClass'>
                            <button className='block-button'>Block User</button>
                            <button className='logout-btn' onClick={() => auth.signOut()}>Log Out</button>
                        </div>
                </div>
                {/* Info class ends */}

            </div>
            // detail class starts

        )
    }
    
    export default Detail;