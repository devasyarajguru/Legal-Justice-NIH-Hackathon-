// import React from 'react';
// import './ProgressBar.css'; // Import the CSS file for styling

// const ProgressBar = ({ progress }) => {
//     const radius = 30; // Radius of the circle
//     const strokeWidth = 5.5; // Width of the stroke
//     const normalizedRadius = radius - strokeWidth * 0.5; // Adjusted radius for stroke
//     const circumference = normalizedRadius * 2 * Math.PI; // Circumference of the circle
//     const strokeDashoffset = circumference - (progress / 100) * circumference; // Calculate the offset based on progress

//     return (
//         <div className="progress-bar-container">
//             <svg height={radius * 2} width={radius * 2}>
//                 <circle
//                     stroke="#EAEAEA"
//                     strokeWidth={strokeWidth}
//                     fill="none"
//                     r={normalizedRadius}
//                     cx={radius}
//                     cy={radius}
//                 />
//                 <circle
//                     id="progress-circle"
//                     stroke="#4CAF50" // Color of the progress
//                     strokeWidth={strokeWidth}
//                     fill="none"
//                     r={normalizedRadius}
//                     cx={radius}
//                     cy={radius}
//                     strokeDasharray={circumference}
//                     strokeDashoffset={strokeDashoffset}
//                 />
//             </svg>
//             <div className="progress-text">{progress}%</div>
//         </div>
//     );
// };

// export default ProgressBar; 