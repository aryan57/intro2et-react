import React, { useState, useEffect } from 'react';

import { Header } from '../Utilities/Header'
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"


const MathGame = () => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [levelsCleared, setLevelsCleared] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const { submitScore } = useAuth()


  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1; // Adjust the range as needed
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const generateOptions = () => {
    setOptions([]);
    const firstNumber = generateRandomNumber();
    const secondNumber = generateRandomNumber();
    const sum = firstNumber + secondNumber;

    setTargetNumber(sum);
    const originalArray = [firstNumber, secondNumber, generateRandomNumber(), generateRandomNumber()]
    setOptions(shuffleArray([...originalArray]));
  };

  async function handleOptionClick(number) {

    if (selectedNumbers.length < 2) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  useEffect(() => {
    if (selectedNumbers.length === 2) {
      const sum = selectedNumbers.reduce((acc, num) => acc + num, 0);
      if (sum === targetNumber) {
        setSelectedNumbers([]);

        setLevelsCleared(levelsCleared + 1);
        generateOptions();
      } else {
        handleMistake();
      }
    }
  }, [selectedNumbers]);



  async function handleMistake() {
    // Send data to the API endpoint
    const timeTaken = (Date.now() - startTime) / 1000;

    console.log("time: " + JSON.stringify({ level: levelsCleared, timetaken: timeTaken }));

    setSuccess("")
    setError("")
    const res = await submitScore(levelsCleared, timeTaken);
    if (res && res.error) setError(res.error)
    else if (res && res.message) setSuccess(res.message)

    // Reset the game
    setStartTime(Date.now());
    setLevelsCleared(0);
    setSelectedNumbers([]);

    generateOptions();
  };

  useEffect(() => {
    setStartTime(Date.now());
    generateOptions();
  }, []);


  return (
    <>
      <Header />
      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>
          <h2 className="text-center mb-4">Number Ninja</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <div>
            {/* <h1>Math Game</h1> */}
            <div>
              <p>Target Number: {targetNumber}</p>
              <p>Selected Numbers: {selectedNumbers.join(', ')}</p>
              <p>Levels Cleared: {levelsCleared}</p>
            </div>
            <div>
              {options.map((number, index) => (
                <button key={index} onClick={() => handleOptionClick(number)}>
                  {number}
                </button>
              ))}
            </div>
          </div>


        </div>
      </Container >
    </>
  );
};

export default MathGame;
