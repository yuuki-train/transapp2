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

    //handleSearchメソッド：入力エラーが無いかを確認し、結果に応じて適切な処理を行うメソッド
    const handleSearch = () =>{

      //出発駅、到着駅、日付、時刻の4つの必須入力項目で、入力エラーを確認する
      const checkId = ['departure', 'destination', 'date', 'time'];
      const word = ['出発駅', '到着駅', '日付', '時刻'];
      let message = '';
      //それぞれの値が空白及びnullであれば、入力エラーメッセージを作成する
      for(let i in checkId){
        const element = document.getElementById(checkId[i]).value;
        if(element === '' | null){
          if(message === ''){
            message = message + word[i];
          }else{
            message = message + '、' + word[i];
          }
        }
      }
      //エラーあり：入力エラーメッセージを完成させ、errorにセットする
      //エラーなし：stateを初期化し、searchAndFetchメソッドを呼び出す
      if(message !== ''){
        message = message + 'を正しく入力してください';
        setError(message);
      }else{
        setResult('');
        setError('');
        setTitle('');
        setSentence1('');
        setSentence2('');
    
        searchAndFetch();     
      }
    }

    //searchAndFetchメソッド：fetchを用いてフォームのデータを検索APIに送り、返り値を基に結果表示処理を行う
    const searchAndFetch = () =>{
      //フォームのデータを取得し、検索APIにPOST送信する
      const data = new FormData(document.getElementById('form'));
      const URL = 'http://localhost:8080/search'
      fetch(URL, {
        method: 'POST',
        mode: 'cors',
        body: data
      })
      //返り値をjson形式に変換する。その上でmakeResultメソッド及びmakeSentencesメソッドを呼び出し、画面に結果が表示できるようにする
      .then(res =>res.json())
      .then(json =>{
        const arrayData = logic.makeData(json);
        const jsonData = JSON.stringify(arrayData)
        sessionStorage.setItem('trainsData', jsonData);
        makeResult(json);
        if(error === ''){
          makeSentences();
        }    
      })
      //API側の処理エラーがある場合、コンソールに表示し、処理エラーメッセージをerrorにセットする
      .catch(error =>{
        console.error('Error:', error)
        setError('処理エラーが発生しました。再度検索してください')
      })
    }

    //makeResultメソッド：画面に表示される検索結果を構築する
    const makeResult = (json) =>{
      const results = [];
      const details = [];
      const changeTrain = [];

      //検索件数分だけ繰り返す
      for(let i in json){

        //大阪駅での乗り換えが必要：文言を配列に追加する
        //乗り換えが不要：空文字列を配列に追加する（※この機能は、APIの処理を変更次第削除予定）
        if(json[i]['changeTrain'] !== 0){
          changeTrain.push('（大阪駅乗り換え）');
        }else{
          changeTrain.push('');
        }

        //経路詳細部分を配列に追加する
        details.push(
          <li key={json[i]["id"]}>
            {json[i]["depHour"]} : {json[i]["depMinute"]} {json[i]["departure"]}<br />
            {json[i]["line"]} {json[i]["trainType"]}{changeTrain[i]}<br />
            {json[i]["arvHour"]} : {json[i]["arvMinute"]} {json[i]["destination"]}<br />   
          </li>
        )

        //経路番号j(= i + 1)を数字型に変換し、検索結果部分を配列に追加する 
        const numI = parseInt(i,10);
        const j = numI + 1;
        results.push(
          <li key={json[i]["id"]}>  
            <details>
              <summary>
                第{j}経路 {json[i]["depHour"]} : {json[i]["depMinute"]} → {json[i]["arvHour"]} : {json[i]["arvMinute"]}<br />
                  {json[i]["totalMinutes"]}分、{json[i]["totalCharge"]}円（運賃{json[i]["fair"]}円、有料列車料金{json[i]["fee"]}円）、乗換{json[i]["changeTrain"]}回
                <form>
                  <input id={i} type="button" name={i} value="この経路を利用する"  onClick={handleSave}/>
                </form>
              </summary>
              <ul>
                {details[i]}
              </ul>                         
            </details>
          </li>
        )     
      }
      setResult(results)  
  
      //検索件数が0件の場合は、結果無しエラーメッセージをerrorにセットする
      if(json.length === 0){
        setError('検索結果が0件です。再度検索してください')     
      }

    }

    const handleSave = (ev) =>{
      const e = ev || window.event;
      const elem = e.target || e.srcElement;
      const id = elem.id;
      if(window.confirm('この経路を利用しますか？（経路情報が保存されます。）')){
        logic.saveData(id);
      }
    }

    //検索ボタンが押されたら、handleSearchメソッドを呼び出す   
    document.getElementById('search').addEventListener('click', handleSearch);

  },[error])






  //makeSentencesメソッド：検索結果の上側に表示される、「検索結果」の見出しと検索条件の概略を構成する
  const makeSentences = () =>{
    let dateData = [];
    //入力パラメータ及び必要な値を取得する
    const date = document.getElementById('date').value;
    const year = date.slice(0,4);
    const month = date.slice(5,7);
    const aDay = date.slice(8);
    const time = document.getElementById('time').value;
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;

    //日付に合わせて適切な曜日を取得する
    const dayCheck = new Date();
    dayCheck.setFullYear(parseInt(year,10));
    dayCheck.setMonth(parseInt(month,10));
    dayCheck.setDate(parseInt(aDay,10));
    const day = "日月火水木金土".charAt(dayCheck.getDay()); 

    dateData = [year, month, aDay, day];
    const jsonData = JSON.stringify(dateData);
    sessionStorage.setItem('dateData', jsonData);

    //入力パラメータの内容に応じて文章を組み立て、それぞれtitle, sentence1, sentence2にセットする
    const sentenceA = year +'年'+ month +'月'+ aDay +'日（'+ day + '） ' + departure + ' → ' + destination;
    let sentenceB = '';
    if (document.searchForm.depOrArv[0].checked){
      sentenceB = time + ' 出発';
    }else{
      sentenceB = time + ' 到着';
    }
    setTitle('検索結果')
    setSentence1(sentenceA);
    setSentence2(sentenceB);
  }

  //検索ボタンをResult.js側に持たせ、その下にtitle, sentece1, sentence2, result, errorを表示する
  return(
    <div className="result">
      <form>
        <input id="search" type="button" name="search" value="検索" />  
      </form>  
      <h2>{title}</h2>
        {sentence1}<br />
        {sentence2}<br />
        <ul>
          {result}
        </ul>
        {error}
    </div>
  )
}

export default Result;