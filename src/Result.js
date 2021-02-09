import {useState, useEffect } from 'react'


const Result = () =>{

  const [line, setLine] = useState('')
  const [result, setResult] = useState('');

  function getResult(line){
    let result = ''
  
    if(line === '山手線'){
       result = '黄緑' 
    }else{
       result = '不明'
    }
  
    return result; 
  }

  useEffect(() => {
    
    const handleParamater = (e) =>{

      setLine(e.detail);
      const response = getResult(line);
      setResult(response)
    }
    document.getElementById('result').addEventListener('setParamater', handleParamater);
  })

  return(
    <div className="result">
      {line}は{result}です。
    </div>

  );

}

export default Result