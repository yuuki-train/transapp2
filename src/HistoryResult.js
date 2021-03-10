import { useState, useEffect } from 'react';
import Logic from './Logic'

const HistoryResult = () =>{
　//stateとなる変数を設定する
  const [result, setResult] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() =>{
    const logic = new Logic();

    const getId = (id) =>{
      return document.getElementById(id);
    } 
    const getValue = (id) =>{
      return document.getElementById(id).value;
    } 

    const handleHistorySearch = () =>{
      setResult('');
      setTitle('');
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
        if(fetchResult ==='検索結果が0件です。再度検索してください'){
          setError(fetchResult);
        }else{
          setResult(fetchResult);
          const yearAndMonth = getValue("month")
          setTitle(logic.getYearAndMonth(yearAndMonth));
        }
        
      })
      .catch(error =>{
        console.error('Error:', error)
        setError('クライアント側でエラーが発生しました。');
      })
    }
    
    document.getElementById("historySearch").addEventListener('click', handleHistorySearch);

  },[])

  if(title === ''){
    return(
      <div className="historyResult">
        <form>
          <input id="historySearch" type="button" name="historySearch" value="履歴表示" />  
        </form>
        <br />
        {error}
      </div>
    );    
  }else{
    return(
      <div className="historyResult">
        <form>
          <input id="historySearch" type="button" name="historySearch" value="履歴表示" />  
        </form>
        <table>
          <caption>{title}</caption>
          <tr><th>日付</th> <th>時刻</th> <th>経路</th>　<th>合計金額</th>　<th>運賃</th>　<th>料金</th></tr>
          {result}
        </table>
        <br />
        {error}
      </div>
    );    
  }
  
 
}

export default HistoryResult;
