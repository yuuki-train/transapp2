import React, {useState, useEffect} from 'react'
import Logic from './Logic'

const Result = () =>{
  
  //stateとなる変数を設定する
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');

  useEffect(() => {

    const logic = new Logic();

    const getId = (id) =>{
      return document.getElementById(id);
    } 
    const getValue = (id) =>{
      return document.getElementById(id).value;
    }

    const makeValueArray = (idArray) =>{
      const valueArray = []
      for(let i of idArray){
        valueArray.push(getValue(i));
      }
      return valueArray;
    }

    const resetState = () =>{
      setResult('');
      setTitle('');
      setSentence1('');
      setSentence2('');   
    }

    //makeSentencesメソッド：検索結果の上側に表示される、「検索結果」の見出しと検索条件の概略を構成する
    const makeSentences = () =>{
      //入力パラメータ及び必要な値を取得する
      const date = getValue('date');
      const year = date.slice(0,4);
      const month = date.slice(5,7);
      const aDay = date.slice(8);
      const day = logic.dayCheck(year, month, aDay);
      logic.saveDate(year, month, aDay, day);
    
      const time = getValue('time');
      const departure = getValue('departure');
      const destination = getValue('destination');
      const depOrArv = document.searchForm.depOrArv[0].checked;

      setTitle("検索結果")
      setSentence1(logic.makeSentenceA(year, month, aDay, day, departure, destination));
      setSentence2(logic.makeSentenceB(time, depOrArv));
    }
    
    //handleSearchメソッド：入力エラーが無いかを確認し、結果に応じて適切な処理を行うメソッド
    const handleSearch = () =>{
      const idArray = ['departure', 'destination', 'date', 'time'];
      const valueArray = makeValueArray(idArray);
      const wordArray = ['出発駅', '到着駅', '日付', '時刻'];
      let message = '';
      message = logic.inputErrorCheck(valueArray, wordArray, message);
      setError(message);   
      if(message === ""){
        resetState();
        searchAndFetch();  
      }   
    }

    //searchAndFetchメソッド：fetchを用いてフォームのデータを検索APIに送り、返り値を基に結果表示処理を行う
    const searchAndFetch = () =>{
      const data = new FormData(getId('form'));
      const URL = 'http://localhost:8080/search';
      const type = 'search';
      fetch(URL, {method: 'POST', mode: 'cors', body: data})
      .then(res =>res.json())
      .then(jsonParam =>{
        const fetchResult = logic.dispatchFetch(type, jsonParam);
        setResult(fetchResult);
        makeSentences();
      })
      .catch(error =>{
        console.error('Error:', error)
        setError('クライアント側でエラーが発生しました。');
      })
      
    }

    //検索ボタンが押されたら、handleSearchメソッドを呼び出す   
    document.getElementById('search').addEventListener('click', handleSearch);

  },[])

  

  //検索ボタンをResult.js側に持たせ、その下にtitle, sentece1, sentence2, result, errorを表示する
  return(
    <div className="result">
      <form>
        <input id="search" type="button" name="search" value="検索" />  
      </form> 
      {error}<br/> 
      <h2>{title}</h2>
        {sentence1}<br />
        {sentence2}<br />
        <ul>
          {result}
        </ul>
    </div>
  )
}

export default Result;