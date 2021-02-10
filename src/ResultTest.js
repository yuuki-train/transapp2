import {useState, useEffect } from 'react'

const Result = () =>{

  const [line, setLine] = useState('')
  const [color, setColor] = useState('');
  const [test, setTest] = useState('');

  let paramater = ''

  const colorLogic = (paramater) =>{

    if(paramater === '山手線'){
      setColor('黄緑') 
    }else{
      setColor('不明')
    }
    
  }

  useEffect(() => {

    const handleParamater = (e) =>{
      paramater = e.detail;
      colorLogic(paramater);
      setLine(paramater);
      setTest(document.getElementById('line').value);
    }

    document.getElementById('result').addEventListener('setParamater', handleParamater);
  })

  if(line !== ''){
    return(
      <div className="result">
        {line}は{color}です。
        {test}
      </div>
    )
  }else{
    return(
      <div className="result">
      </div>
    )
  }  

}

//export default Result;