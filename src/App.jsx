import React from 'react'
import './App.css'
import { Button, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { calcBalance, calcScore } from './helper.js'

function Todo({ todo, index, onSwitch}) {
  return (
    <div className="todo">
      <span>
        {todo} ({todo.length})
      </span>
      {(index === 0)? <div></div> :<button class="btn btn-secondary" onClick={()=>onSwitch(index)}>-></button>}
    </div>
  )
}

function FormTodo({ addTodo }) {
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
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Turkish please."
        />
      </Form.Group>
      <button class="btn btn-success" type="submit">
        Submit
      </button>
    </Form>
  )
}

function App() {
  const [todos, setTodos] = React.useState([])

  const lastWord = todos[0] !== undefined ? todos[0] : ''

  const addTodo = (_word) => {
    if (!_word.includes(' ') && !todos.includes(_word.toLowerCase())) {
       fetch('https://sozluk.gov.tr/gts?ara='+ _word)
        .then(response => response.json())
        .catch(()=>alert("error validating the word! check your network connection."))
        .then(data =>{
            if(data.error!=="Sonuç bulunamadı"){
              const cbal = calcBalance(lastWord, _word)
              if (cbal === 1 || cbal === -1) setTodos([_word.toLowerCase(), ...todos])
            }
        })
    }
  }

  const resetGame = () => setTodos([])

  let totalSc = calcScore(todos)

  return (
    <div className="app">
      <div className="container">
      <button onClick={resetGame} type="button" class="btn btn-dark">Reset</button>
        <h1 className="text-center mb-4">Worddapp</h1>
        
        {(totalSc > -1)?<p> Score: {totalSc}</p>:<h2>Game over!</h2>}

        <br/>
        <br/>

        {(totalSc > -1)?<FormTodo addTodo={addTodo} />:<div/>}
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
