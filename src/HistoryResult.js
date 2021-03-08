import { useState, useEffect } from 'react';
import Logic from './Logic'

const HistoryResult = () =>{
　//stateとなる変数を設定する
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() =>{
    const logic = new Logic();

    const getId = (id) =>{
      return document.getElementById(id);
    } 

    const handleHistorySearch = () =>{
      const idArray = ['month'];
      const valueArray = [document.getElementById(idArray[0]).value];
      const wordArray = ['年月'];
      let message = '';
      message = logic.inputErrorCheck(valueArray, wordArray, message);
      setError(message);   
      if(message === ""){
        searchAndFetch();  
      }   
      
    } 

    const searchAndFetch = () =>{
      const data = new FormData(getId('historyForm'));
      const URL = 'http://localhost:8080/history';
      const type = 'history';
      fetch(URL, {method: 'POST', mode: 'cors', body: data})
      .then(res =>res.json())
      .then(jsonParam =>{
        const fetchResult = logic.dispatchFetch(type, jsonParam);
        setResult(fetchResult);
      })
      .catch(error =>{
        console.error('Error:', error)
        setError('クライアント側でエラーが発生しました。');
      })
    }
    
    document.getElementById("historySearch").addEventListener('click', handleHistorySearch);

  },[])
  
  return(
    <div className="historyResult">
      <form>
        <input id="historySearch" type="button" name="historySearch" value="履歴表示" />  
      </form>
      {result}<br />
      {error}
    </div>
  );    
}

export default HistoryResult;
