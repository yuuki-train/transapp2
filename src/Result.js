import {useState, useEffect } from 'react'

const Result = () =>{

  const [line, setLine] = useState('')
  const [color, setColor] = useState('');
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
      setLine(paramater);
      colorLogic(paramater);
    }

    document.getElementById('result').addEventListener('setParamater', handleParamater);
  })

  if(line !== ''){
    return(
      <div className="result">
        {line}は{color}です。
      </div>
    )
  }else{
    return(
      <div className="result">
      </div>
    )
  }  

}

export default Result