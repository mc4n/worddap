export function validateW(prev, curr) {
  if (prev.length === 0) return 1
  else if (prev.length !== 0 && Math.abs(prev.length - curr.length) > 1) return 0
  else {
    if (prev.length === curr.length) {
      let diff = 0
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== curr[i]) diff++
        if (diff > 1) return 0
      }

      return 1
    } else {
      const shortW = prev.length > curr.length ? curr : prev
      const longW = prev.length < curr.length ? curr : prev
      for (let i = 0; i < longW.length; i++) {
        let trimmedLong = []
        for (let j = 0; j < longW.length; j++)
          if (i !== j) trimmedLong.push(longW[j])
        if (trimmedLong.join('') === shortW) return -1
      }
      return 0
    }
  }
}

export function calcBalance(todos) {
  let balance = 0
  let score = 0
  
  if (todos.length===0) return [balance, score];

  for(var item of todos){
    const _add = item[1]?1:(-1);
    balance += _add;
    if(_add ===1)
      score += item[0].length;
  }

  return [balance, score]

}
