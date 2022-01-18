import React from "react";
import "./App.css";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {calcBalance, calcScore} from "./helper.js"


function Todo({ todo, index }) {
  return (
    <div
      className="todo">
      <span>{todo} ({todo.length})</span>
    </div>
  );
}

function FormTodo({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}> 
    <Form.Group>
      <Form.Label><b>Type a Word</b></Form.Label>
      <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="a valid Turkish word" />
    </Form.Group>
    <Button variant="primary mb-3" type="submit">
      Submit
    </Button>
  </Form>
  );
}

function App() {
  
  const [todos, setTodos] = React.useState([])
  
  const firstUpdate = React.useRef(true);

  const lastWord = todos[0] !== undefined ? todos[0] : ""

  const addTodo = _word => {
    if(!_word.includes(' ') && !todos.includes(_word.toLowerCase())){
      const cbal = calcBalance(lastWord, _word)
      if(cbal == 1 || cbal == -1){
        setTodos([_word.toLowerCase(),...todos])
      }
    }
  };

  const resetGame = () => setTodos([])

  let totalSc = calcScore(todos)

  if(totalSc == -1) resetGame()

  return (
    <div className="app">
      <div className="container">
        <button onClick={resetGame}> Reset</button>
        <h1 className="text-center mb-4">Worddapp</h1>
        <a> Score: {totalSc}</a><br/>
        <br/>
        <FormTodo addTodo={addTodo} />

        <a> Last Word:</a><br/>
        <a>{lastWord} ({lastWord.length}) </a> 
        <br/>
        <br/>
         <a>History:</a>
        <div>
          {todos.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo
                key={index}
                index={index}
                todo={todo}
                />
              </Card.Body>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
