import '../CSS/Spinner.css'
const Spinner = () => {
    return(
        <div className="spinner-container">
        <div className="spinner-icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon scales"
            >
                <path d="M12 3L4 9h16L12 3z" />
                <path d="M8 21h8M12 3v18M16 13a4 4 0 0 1-8 0" />
            </svg>
        </div>
    </div>
    )
}

export default Spinner;