const Interface = () =>
    {
        return (
            <>
                <div className="app-container">
        <section className="chat-list">
            {/* <!-- List of chats here --> */}
            <span className="chats">Chats</span>

            {/* <!--Query Buttons--> */}
            <div className="query-btn">
                <button><a href="../files/query.html">Raise a query</a></button>
                <button><a href="./table.html">View a query</a></button>
            </div>

            {/* <!--Google Translate Element--> */}
            <div id="google_translate_element"></div>
            <script type="text/javascript">
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({ pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element');
                }
            </script>

            {/* <!--Google Translate API--> */}
            <script type="text/javascript"
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
            {/* <!--Google Translate Element ends--> */}

            <div className="search-bar">
                <input type="text" placeholder="Search">
            </div>
            <div className="chat-screen" id="chatScreen">
            </div>
        </section>
        {/* <!--Section to display Chats--> */}
        <section className="chat-window">
            <header className="chat-header">
                <div className="user-info">
                    <span className="user-name" id="userName"></span>
                    {/* <!-- <span className="user-status">Active</span> --> */}
                </div>
            </header>
            <div className="chat-conversation" id="chatConversation">
                {/* <!-- Conversation bubbles here --> */}

            </div>
            <div className="prompt-box" id="promptBox"></div>

            {/* <!--Input Chat--> */}
            <footer className="chat-input">
                <div className="input-container">
                    <i className="attachment-icon">📎</i>
                    <input type="text" id="messageInput" placeholder="Type here">
                    <button className="send-button" onclick="sendMessage()">Send</button>
                </div>
            </footer>

        </section>
        {/* <!--Info Panel--> */}
        <aside className="info-panel">
            <div className="profile-image">
                <img src="../images/male.png" alt="Profile Image" className="profile-image right">
            </div>
            <h1 className="profile-name" id="profileName"></h1>
            <div className="icon-container">
                {/* <!-- Icons go here --> */}
                <div className="icon"><a href="" id="phoneCall"><img src="../images/phone-call.svg" alt="Phone" style="width: 34px;
                height: 34px;"></div></a>
                <div className="icon"><a href="" id="mailTo"><img src="../images/envelope.svg" alt="Email"
                            style="width:34px; height:34px;" id="envelope-svg"></div></a>
                <div className="icon"><a href="" id="skypeTo"><img src="../images/video-camera-alt.svg" alt="Video"
                            style="width: 34px; height:34px;" id="videoCamera-svg"></div></a>
            </div>
            <div className="shared-files">
                <h2>Shared Files</h2>
                <div className="file">
                    <div className="file-icon"></div>
                    <div className="file-name">resume.pdf</div>
                    <div className="file-size">2.2 Mb</div>
                </div>
                {/* <!-- More files go here --> */}
            </div>
        </aside>
    </div>
            </>
        )
    }

export default Interface;
