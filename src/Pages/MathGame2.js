// import React, { useState, useEffect } from 'react';

// import { Header } from '../Utilities/Header'
// import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
// import { useAuth } from "../contexts/AuthContext"


// const MathGame2 = () => {

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")

//   const [targetNumber, setTargetNumber] = useState(0);
//   const [options, setOptions] = useState([]);
//   const [selectedNumbers, setSelectedNumbers] = useState([]);
//   const [levelsCleared, setLevelsCleared] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const { submitScore } = useAuth()


//   const generateRandomNumber = () => {
//     return Math.floor(Math.random() * 10) + 1; // Adjust the range as needed
//   };

//   const generateOptions = () => {
//     const firstNumber = generateRandomNumber();
//     const secondNumber = generateRandomNumber();
//     const sum = firstNumber + secondNumber;

//     setTargetNumber(sum);
//     setOptions([firstNumber, secondNumber, generateRandomNumber(), generateRandomNumber()]);
//   };

//   const handleOptionClick = (number) => {
//     if (selectedNumbers.length < 2) {
//       setSelectedNumbers([...selectedNumbers, number]);

//       if (selectedNumbers.length === 1) {
//         const sum = selectedNumbers[0] + number;
//         if (sum === targetNumber) {
//           handleLevelCleared();
//         }
//       }
//     }
//   };

//   const handleLevelCleared = () => {
//     setSelectedNumbers([]);
//     setLevelsCleared(levelsCleared + 1);
//     generateOptions();
//   };

//   const handleMistake = () => {
//     // Send data to the API endpoint
//     const timeTaken = (Date.now() - startTime) / 1000;
    
//     console.log("time: " + JSON.stringify({ level: levelsCleared, timetaken: timeTaken }));

//     setSuccess("")
//     setError("")
//     const res = await submitScore(levelsCleared, timeTaken);
//     if (res && res.error) setError(res.error)
//     else if(res && res.message)setSuccess(res.message)

//     // Reset the game
//     setStartTime(Date.now());
//     setLevelsCleared(0);
//     setSelectedNumbers([]);
//     generateOptions();
//   };
  
    


//   const startGame = () => {
//     setStartTime(Date.now());
//     generateOptions();
//   };


//   // useEffect(() => {
//   //   if (selectedNumbers.length === 2) {
//   //     const sum = selectedNumbers.reduce((acc, num) => acc + num, 0);
//   //     if (sum === targetNumber) {
//   //       setSelectedNumbers([]);

//   //       setLevelsCleared(levelsCleared + 1);
//   //       generateOptions();
//   //     } else {
//   //       handleMistake();
//   //     }
//   //   }
//   // }, [options, selectedNumbers, targetNumber, levelsCleared]);

//   // useEffect(() => {
//   //   setStartTime(Date.now());
//   //   generateOptions();

//   //   // Cleanup function to reset options when the component is unmounted or a new level is about to be rendered
//   //   return () => setOptions([]);
//   // }, [levelsCleared]);



//   return (
//     <>
//       <Header />
//       <Container className="d-flex align-items-center justify-content-center">
//         <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>
//           <h2 className="text-center mb-4">Number Ninja</h2>
//           {error && <Alert variant="danger">{error}</Alert>}
//           {success && <Alert variant="success">{success}</Alert>}

//           <div>
//             {/* <h1>Math Game</h1> */}
//             <div>
//               <p>Target Number: {targetNumber}</p>
//               <p>Selected Numbers: {selectedNumbers.join(', ')}</p>
//               <p>Levels Cleared: {levelsCleared}</p>
//             </div>
//             <div>
//               {options && options}
//               {options.map((number) => (
//                 <button key={number} onClick={() => handleOptionClick(number)}>
//                   {console.log("num " + number)}
//                   {number}
//                 </button>
//               ))}
//             </div>
//           </div>


//         </div>
//       </Container >
//     </>
//   );
// };

// export default MathGame2;
