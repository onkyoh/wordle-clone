import './styles/App.css';
import { useState, useRef, useEffect } from 'react'
import { dictionary } from './words';

function App() {

  
  const [word, setWord] = useState([])
  const [guessValue, setGuessValue] = useState("")
  const [pastGuesses, setPastGuesses] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [rows, setRows] = useState([[], [], [], [], [], []])
  const tiles = ["", "", "", "", ""]
  const [finished, setFinished] = useState("")
  const [newWord, setNewWord] = useState(true)
  const [popup, setPopup] = useState(false)
  const [noType, setNoType] = useState(false)
  const [answer, setAnswer] = useState("")

  const guessRef = useRef("")


  useEffect (() => {
    const chosenWord =  dictionary[Math.floor(Math.random() * dictionary.length)]
    const wordSplit = chosenWord.toUpperCase().split("")
    setWord([...wordSplit])
    setAnswer(chosenWord.toUpperCase())
    guessRef.current.focus()
    console.log(wordSplit)
  }, [newWord])

  const handleWon = () => {
    setFinished("Correct")
    setPopup(() => true)
    setNoType(() => true)
  }

  const handleLost = () => {
    setFinished("Game Over")
    setPopup(() => true)
    setNoType(() => true)
  }

  const closeModal = () => {
   setPopup(() => false)
  }

  const styleSquares = (tempTiles) => {
    const currentTiles = document.querySelectorAll(`#row${currentRow}`)
    for (let i = 0; i < 5; i++) {
      currentTiles[i].style.backgroundColor = "hsl(120, 1%, 18%)";
      currentTiles[i].style.border = "0.05em solid hsl(120, 1%, 18%)";
      currentTiles[i].style.color = "white";
    }
    for (let i = 0; i < 5; i++) {
      for (let t = 0; t < 5; t++) {
        if (tempTiles[currentRow][i] === word[t]) {
          currentTiles[i].style.backgroundColor = "rgb(181, 186, 49)";
          currentTiles[i].style.border = "0.05em solid rgb(181, 186, 49)";
        } 
      }
      if (tempTiles[currentRow][i] === word[i]) {
        currentTiles[i].style.backgroundColor = "rgb(59, 133, 48)";
        currentTiles[i].style.border = "0.05em solid rgb(59, 133, 48)";
      }  
    }
  }

  const isPastGuesses = (dictionaryIdx) => {
    let guessArray = pastGuesses
    const pastGuessIdx = guessArray.indexOf(dictionaryIdx)
      if (pastGuessIdx > -1) {
        return true
      } else {
        guessArray.push(dictionaryIdx)
        setPastGuesses([...guessArray])
        return false
      }
  }

  const sendGuess = (e) => {
    e.preventDefault()
    const dictionaryIdx = dictionary.indexOf(guessValue)
    if (dictionaryIdx === -1) {
      return
    }
    if (isPastGuesses(dictionaryIdx)) {
      return
    }
    let guess = guessValue.toUpperCase()
    let tempTiles = [...rows]
    if (currentRow === 5) {
      setTimeout(() => {
        handleLost()
      }, 2500)
    }
    if (guess.length === 5) {
      for (let i = 0; i < 5; i++) {
        tempTiles[currentRow][i] = guess[i]
      }
      setRows([...tempTiles])
      setCurrentRow(prev => prev + 1)
      setGuessValue(() => "")

      //add styles to buttons
      styleSquares(tempTiles)
      //check for finish
      let guessString = tempTiles[currentRow].toString()
      let wordString = word.toString()
      if (guessString === wordString) {
        setTimeout(() => {
          handleWon()
        }, 2500)
      }
    }
    guessRef.current.focus()
  }

  const changeGuess = (e) => {
    let tempRows = [...rows]
    let currentGuess = e.target.value
    const re = /^[A-Za-z]+$/;
    if (re.test(currentGuess) || currentGuess === "") {
      for (let i = 0; i < 5; i++) {
        tempRows[currentRow][i] = currentGuess[i]; 
      }
      setRows(() => [...tempRows])
    } else {
      let dumbyString = currentGuess
      currentGuess = dumbyString.slice(0, -1)      
    }
    setGuessValue(() => currentGuess)
  }

  const handleFocus = () => {
    guessRef.current.focus()
  }

  const handlePlayAgain = () => {
    setNewWord(!newWord)
    console.log(newWord)
    setFinished("")
  }

  return (
    <div className='wrapper' onClick={handleFocus}>
      <section className='game-board'>
      {rows.map((row, rowIndex) => (
        <ul className="rows" >
            {tiles.map((tile, tileIndex) => (
              <li className='tiles' id={`row${rowIndex}`}>{rows[rowIndex][tileIndex]}</li>
            ))}
        </ul>
      ))}
      </section>
    <form className='enter-reload'>
      <input type="text" ref={guessRef} value={guessValue} autoFocus maxLength='5' disabled={noType} onChange={(e) => changeGuess(e)}/>
      <div>
        <button type="submit" onClick={(e) => sendGuess(e)}>ENTER</button>
        <button onClick={handlePlayAgain}>&#8635;</button>
      </div>
    </form>
    {popup && 
      <form className='popup'>
        <span onClick={closeModal}>X</span>
        <h3>{finished}</h3>
        {finished === "Game Over" && <h4>The answer was "{answer}"</h4>}
        <button onClick={handlePlayAgain}>PLAY AGAIN</button>
      </form>}
    </div>
  );
}

export default App;
