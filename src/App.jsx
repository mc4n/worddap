import React from "react";
import "./App.css";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



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
      <Form.Label><b>Add Word</b></Form.Label>
      <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new word" />
    </Form.Group>
    <Button variant="primary mb-3" type="submit">
      Submit
    </Button>
  </Form>
  );
}

function App() {
  const [score, setScore] = React.useState(0);
  const [todos, setTodos] = React.useState([]);

  const lastWord = todos[0]

  const lenLastWord = lastWord!==undefined? lastWord.length:0

  const addTodo = text => {
    if(!todos.includes(text)){
      const newTodos = [text.replace(/\s/g, ''), ...todos ];
      setTodos(newTodos);
      const isEqLen=text.length===lenLastWord
      setScore(
        score+ 
          (
            isEqLen?1:-1
          )
        )
    }
  };

  

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Worddapp</h1>
        <a> Score: {score}</a><br/>
        <br/>
        <FormTodo addTodo={addTodo} />
        <a> Last Word:</a><br/>
        
        <a>{lastWord} (length: {lastWord!==undefined? lastWord.length:''}) </a>
        
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