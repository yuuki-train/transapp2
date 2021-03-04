import { useState, useEffect } from 'react';
import Logic from './Logic'

const HistoryResult = () =>{
　//stateとなる変数を設定する
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const logic = new Logic();

  useEffect(() =>{
    const handleHistorySearch = () =>{
      const idArray = ['month'];
      const valueArray = [document.getElementById(idArray[0]).value];
      const wordArray = ['年月'];
      let message = '';
      setError(logic.inputErrorCheck(valueArray, wordArray, message));
      
    } 
    
    document.getElementById("historySearch").addEventListener('click', handleHistorySearch);

  },[])
  
  return(
    <div className="historyResult">
      <form>
        <input id="historySearch" type="button" name="historySearch" value="履歴表示" />  
      </form>
      {message}<br />
      {error}
    </div>
  );    
}

export default HistoryResult;
