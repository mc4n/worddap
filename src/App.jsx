import React from 'react'
import './App.css'
import { Button, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { calcBalance, calcScore } from './helper.js'

function Todo({ todo, index, onSwitch}) {

  const [color, setColor] = React.useState("black")

  const [isFetching, setisFetching] = React.useState(false)

  React.useEffect(() => {
    setisFetching(true)
       fetch('https://sozluk.gov.tr/gts?ara='+ todo)
        .then(response => response.json())
        .catch(()=>alert("error validating the word! check your network connection."))
        .then(data =>{
            setColor(data.error!=="Sonuç bulunamadı"?"green":"red")
        })
    
  },[todo])

  return (
    <div className="todo">
      <span style={{color:color}}>
        {todo} ({todo.length})
      </span>
      {(index === 0)? <div></div> :<button className="btn btn-secondary" onClick={()=>onSwitch(index)}>-></button>}
    </div>
  )
}

function FormTodo({txtRef, addTodo, disabled }) {
  const [value, setValue] = React.useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value) return
    addTodo(value)
    setValue('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>
          <b>Type a Word:</b>
        </Form.Label>
        <Form.Control
          ref = {txtRef}
          disabled = {disabled}
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Turkish please."
        />
      </Form.Group>
      <button className="btn btn-success" type="submit">
        Submit
      </button>
    </Form>
  )
}

function App() {
  const [todos, setTodos] = React.useState([])

  const lastWord = todos[0] !== undefined ? todos[0] : ''

  const [isFetching, setisFetching] = React.useState(false)

  const myRef = React.createRef();
  
  const addTodo = (_word) => {
    if (!_word.includes(' ') && _word.length > 1 && !todos.includes(_word.toLowerCase())) {
      /*setisFetching(true)
       fetch('https://sozluk.gov.tr/gts?ara='+ _word)
        .then(response => response.json())
        .catch(()=>alert("error validating the word! check your network connection."))
        .then(data =>{
            if(data.error!=="Sonuç bulunamadı"){*/
            const cbal = calcBalance(lastWord, _word)
            if (cbal === 1 || cbal === -1) setTodos([_word.toLowerCase(), ...todos])
            //}
        //}).then(()=>setisFetching(false))
        
    }
  }

  const resetGame = () => setTodos([])

  let totalSc = calcScore(todos)

  React.useEffect(()=>{
     if (myRef!==null && myRef.current!==null)myRef.current.focus()
   })


  /*const isStart = React.useRef(true)

  React.useEffect(() => {
        if(!isStart.current) localStorage.setItem("todos", JSON.stringify(todos))
        else setTodos(JSON.parse(localStorage.getItem("todos")))
        isStart.current = false
   },[todos])*/
 

  return (
    <div className="app">
      <h6 className="text-muted mb-4" align="center"> (Alter one letter, the balance increases by 1;
       add/remove, drops by 1. Keep the balance positive, and grow your list!)</h6>
      <div className="container">
      <button onClick={resetGame} type="button" className="btn btn-dark">Reset</button>
        <h1 className="text-center mb-2">Worddap</h1>
        
        {(totalSc > -1)?<p> Balance: {totalSc}</p>:<h2>Game over!</h2>}        

        {(totalSc > -1)?<FormTodo txtRef = {myRef} addTodo={addTodo} disabled={isFetching} />:<div/>}
        <br/>
        
        {lastWord !== '' ? (
          <p>
            Last Word: <br />
            {lastWord} ({lastWord.length}){' '}
          </p>
        ) : (
          <div />
        )}
        <br />
        {lastWord !== '' ? <p>History (count: {todos.length}):</p> : <div />}
        <div>
          {todos.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo key={index} index={index} todo={todo} onSwitch={(i)=>{ setTodos(todos.slice(i)) }} />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
