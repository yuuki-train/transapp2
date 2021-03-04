import { useState } from 'react';
import Logic from './Logic'
import HistoryResult from './HistoryResult'

const HistorySearch = () =>{
　//stateとなる変数を設定する
  const [month, setMonth] = useState('');
  const logic = new Logic();

  //timeCheckメソッド：日付・時刻のデフォルト値となる、現在の日付・時刻を取得する
  const monthCheck = () =>{
    setMonth(logic.makeCurrent('month'));
  } 
  //画面ロードが行われたらtimeCheckメソッドを呼び出し、現在時刻を取得する
  window.addEventListener('load', monthCheck);

  return(
    <div className="history">
      <h2>履歴及び利用額の確認</h2>
      <form id="historyForm" name="historyForm">
        検索する年月
        <input　id="month" type="month" name="month" defaultValue={month} required/><br />
        並べ替え
        <select id="sort" name="sort" defaultValue="dateAsc">
          <option value="dateAsc">日付昇順</option>
          <option value="dateDesc">日付降順</option>
          <option value="totalChargeAsc">金額昇順</option>
          <option value="totalChargeDesc">金額降順</option>
        </select><br />   
      </form>
      <HistoryResult />
    </div>
  );    
}

export default HistorySearch;
