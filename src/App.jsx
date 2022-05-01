import React from 'react'
import './App.css'
import { Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { validateW, calcBalance } from './helper.js'

function Todo({ todo, index, onSwitch}) {
  return (
    <div className="todo">
      <p style={{'backgroundColor':todo[1]?'#55FF74':'#F87758'}}>
        {todo[0]} ({todo.length})
      </p>

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

  const lastWord = todos[0] !== undefined ? todos[0][0] : ''

  const [isFetching, setisFetching] = React.useState(false)

  const myRef = React.createRef();
  
  const addTodo = (_word) => {
    if (!_word.includes(' ') && _word.length > 1 && todos.find(o => o[0] === _word.toLowerCase())===undefined) {
      
      const cbal = validateW(lastWord, _word)
      if(cbal !== 0){
         setisFetching(true)
         fetch('https://sozluk.gov.tr/gts?ara='+ _word)
          .then(response => response.json())
          .catch(()=>{
            alert("error validating the word! check your network connection.");
            setisFetching(false);
          })
          .then(data =>{
              
                setTodos([[_word.toLowerCase(), data.error !== "Sonuç bulunamadı"], ...todos])
              
          })
          .then(()=>setisFetching(false))
      }
    }
  }

  const resetGame = () => setTodos([])


  let totalBc = [0, 0]

  if (!isFetching && todos.length > 0) totalBc = calcBalance(todos)

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
      <h6 className="text-muted mb-4" align="center"> (Altering one letter at a time, the balance increases by 1 if word is valid;
       drops by 1 if invalid. Keep the balance positive, and grow your list!)</h6>
      <div className="container">
      <button onClick={resetGame} type="button" className="btn btn-dark">Reset</button>
        <h1 className="text-center mb-2" style={{color:"grey"}}>Worddap</h1>

        {!isFetching?<h3 style={{color:"blue"}}> Score: {totalBc[1]}</h3>:<div></div>}
        
        {(totalBc[0] > -1)?(!isFetching?<p style={{color:totalBc[0]<=1?"red":"green"}}> Balance: {totalBc[0]}</p>:<div></div>):<h2>Game over!</h2>}

        {(totalBc[0] > -1)?<FormTodo txtRef = {myRef} addTodo={addTodo} disabled={isFetching} />:<div/>}


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
        {lastWord !== '' ? <p>History (total: {todos.length}):</p> : <div />}
        <div>
          {todos.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo key={todo} index={index} todo={todo} onSwitch={(i)=>{ setTodos(todos.slice(i)) }} />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
