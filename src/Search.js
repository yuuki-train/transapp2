import { useState } from 'react';
import Logic from './Logic'

const Search = () =>{
  //stateとなる変数を設定する
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const logic = new Logic();

  //timeCheckメソッド：日付・時刻のデフォルト値となる、現在の日付・時刻を取得する
  const timeCheck = () =>{
    const now = new Date();
    const numDate= ['date', now.getFullYear(), now.getMonth()+1, now.getDate()];
    const numTime= ['type', now.getHours(), now.getMinutes()];
    setDate(logic.makeCurrent(numDate));
    setTime(logic.makeCurrent(numTime));  
  }  

  //画面ロードが行われたらtimeCheckメソッドを呼び出し、現在時刻を取得する
  window.addEventListener('load', timeCheck)

  return(
    <div className="form">
      <h2>経路検索</h2>
      <form id="form" name="searchForm">
        出発駅  <input id="departure" type="text" name="departure" defaultValue="天王寺" required/><br />
        到着駅  <input id="destination" type="text" name="destination" defaultValue="新大阪" required/><br />
        利用日時
        <input　id="date" type="date" name="date" defaultValue={date} required/>
        <input  id="time" type="time" name="time" defaultValue={time} required/><br />
        <input type="radio" name="depOrArv" value = "depart" defaultChecked/>出発時刻指定
        <input type="radio" name="depOrArv" value = "arrive" />到着時刻指定<br />
        優先事項
        <select name = "priority" defaultValue="faster">
          <option value="faster">速さ優先</option>
          <option value="cheaper">安さ優先</option>
          <option value="change">乗換の少なさ優先</option>
        </select>
        <input type="checkbox" name="addFeeTrain"　value="use" />有料列車を利用する<br />
        検索件数
        <select id="theNumberOfSearch" name="theNumberOfSearch" defaultValue="3">
          <option value="1">1件</option>
          <option value="3">3件</option>
          <option value="5">5件</option>
        </select><br /> 
      </form>
    </div>
  );    
}

export default Search;
