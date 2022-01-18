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



function calcBalance(prev, curr){
  if (prev.length == 0) return 1
  else if(prev.length != 0 && Math.abs(prev.length-curr.length) > 1) return 0
  else {

    if(prev.length == curr.length){
      let diff = 0
      for(let i = 0; i < prev.length; i++){
        if(prev[i]!=curr[i]) diff++
        if(diff>1)return 0
      }

    return 1
    }
    else{
      const shortW = prev.length> curr.length? curr:prev
      const longW = prev.length< curr.length?curr:prev
      for(let i = 0; i < longW.length; i++){
          let trimmedLong = []
          for(let j = 0; j < longW.length; j++) 
            if(i != j) trimmedLong.push(longW[j])
          if(trimmedLong.join("") == shortW) return -1
      }
      return 0
    }

  }
}


function calcScore(todos){
  let score = 0
    for (let i=todos.length-1; i > 0; i--){
      const cb = calcBalance(todos[i-1], todos[i])
      console.log(cb)
      score += cb
    }
  return score
}


function App() {
  
  const [todos, setTodos] = React.useState([])

  const [lastWord, setLastWord] = React.useState([])


  React.useEffect(()=>{
    setTodos([lastWord,...todos])
  },[lastWord]);


  


  const addTodo = _word => {
    if(!_word.includes(' ') && !todos.includes(_word.toLowerCase())){
      const cbal = calcBalance(lastWord, _word)
      //console.log(cbal)
      if(cbal == 1 || cbal == -1){
        setLastWord(_word.toLowerCase())
      }
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Worddapp</h1>
        <a> Score: {calcScore(todos)}</a><br/>
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