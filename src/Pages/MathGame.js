import React, { useState, useEffect } from 'react';

import { Header } from '../Utilities/Header'
import { ToggleButtonGroup, ButtonToolbar, ToggleButton, Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"


const MathGame = () => {

  const [enableSpeak, setEnableSpeak] = useState(true);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [info, setInfo] = useState("")

  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [levelsCleared, setLevelsCleared] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const { submitScore } = useAuth()

  const speak = (text) => {
    if (enableSpeak) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };


  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1 + levelsCleared * 5; // Adjust the range as needed
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
    if (sum)
      speak('Target sum is ' + sum.toString())
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
    else if (selectedNumbers.length === 1) {
      setSuccess("");
      setInfo("");
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
    setInfo("New Game initiated!")
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
          {info && <Alert>{info}</Alert>}

          <div>
            {/* <h1>Math Game</h1> */}
            

            <div>
              <p>Target Number: {targetNumber}</p>
              <p>Selected Numbers: {selectedNumbers.join(', ')}</p>
              <p>Levels Cleared: {levelsCleared}</p>
            </div>
            <div>
            Options : 
              {options.map((number, index) => (
                <Button key={index} variant="primary"
                  className="m-2" onClick={() => {
                    handleOptionClick(number);
                    speak(number.toString());
                  }}>
                  {number}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 50 }}>
              <ToggleButtonGroup type="checkbox" className="mb-2">
                <ToggleButton
                  id="toggle-speak"
                  type="checkbox"
                  variant={enableSpeak ? 'primary' : 'disabled'}
                  value={0}
                  checked={enableSpeak}
                  onChange={() => setEnableSpeak(!enableSpeak)}
                  className={`rounded-pill`}
                >
                  {enableSpeak ? 'Disable' : 'Enable'} Speak
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
        </div>
      </Container >
    </>
  );
};

export default MathGame;
