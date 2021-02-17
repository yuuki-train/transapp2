import {useState, useEffect } from 'react'

const Result = () =>{

  const [change, setChange] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [test2, setTest2] = useState('');
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');
  const results = [];
  const details = [];

  //メソッド2：検索値を取得して入力エラーが無いかを確認する
  const inputCheck = () =>{
    const checkId = ['departure', 'destination', 'date', 'time'];
    const word = ['出発駅', '到着駅', '日付', '時刻'];
    let message = '';
    //それぞれの検索値が、空白及びnullであれば入力エラーメッセージを作成する
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
    //エラーメッセージを完成させstateに入れる
    if(message !== ''){
      message = message + 'を正しく入力してください';
      setError(message);
    }
  }
  
  const makeResult = (json) =>{
    //検索結果表示部分のリストを初期化する。
    results.length = 0
    //検索件数分だけ繰り返す。
    for(let i in json){
      //大阪駅乗り換えの文章を表示する。（削除予定）
      if(json[i]['changeTrain'] !== 0){
        setChange('（大阪駅乗り換え）');
      }else{
        setChange('');
      }
      //経路番号表示(i+1)を数字型に変換する。
      const numI = parseInt(i,10);
      const j = numI + 1;
            
      //検索結果部分を表示する。  
      results.push(
        <li key={json[i]["id"]}>  
          <details>
            <summary>
              第{j}経路 {json[i]["depHour"]} : {json[i]["depMinute"]} → {json[i]["arvHour"]} : {json[i]["arvMinute"]}<br />
                {json[i]["totalMinutes"]}分、{json[i]["totalCharge"]}円（運賃{json[i]["fair"]}円、有料列車料金{json[i]["fee"]}円）、乗換{json[i]["changeTrain"]}回
              <form>
                <input id="search" type="button" name="search" value="この経路を利用する" />   
              </form>
            </summary>
            <ul>{details}</ul>                         
          </details>
        </li>
      )

      //経路詳細部分を表示する。
      details.length = 0
      details.push(
        <li key={json[i]["id"]}>
          {json[i]["depHour"]} : {json[i]["depMinute"]} {json[i]["departure"]}<br />
          {json[i]["line"]} {json[i]["trainType"]}{change}<br />
          {json[i]["arvHour"]} : {json[i]["arvMinute"]} {json[i]["destination"]}<br />   
        </li>
      )

    }
    //検索件数が0件であれば、結果無しエラーメッセージを表示する。
    if(json.length === 0){
      setError('検索結果が0件です。再度検索してください')     
    }else{
      setError('')
    }
  }
  
  const searchAndFetch = () =>{
    const data = new FormData(document.getElementById('form'));
    const URL = 'http://localhost:8080/search'
    fetch(URL, {
      method: 'POST',
      mode: 'cors',
      body: data
    })
    .then(res =>res.json())
    .then(json =>{
      makeResult(json);
      if(error === ''){
        makeSentences();
        setTest2(results)
      }    
    })
    .catch(error =>{
      //エラー内容をコンソールに表示させ、処理エラーメッセージを表示する。
      console.error('Error:', error)
      setError('処理エラーが発生しました。再度検索してください')
    })
  }
  
  const makeSentences = () =>{

    const date = document.getElementById('date').value;
    const year = date.slice(0,4);
    const month = date.slice(5,7);
    const aDay = date.slice(8);

    const dayCheck = new Date();
    dayCheck.setFullYear(parseInt(year,10));
    dayCheck.setMonth(parseInt(month,10));
    dayCheck.setDate(parseInt(aDay,10));
    const day = "日月火水木金土".charAt(dayCheck.getDay());

    const time = document.getElementById('time').value;
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;

    const sentenceA = year +'年'+ month +'月'+ aDay +'日（'+ day + '） ' + departure + ' → ' + destination;
    let sentenceB = '';

    //出発時刻が指定されていたら出発を表示し、されていなければ到着を表示する。
    if (document.searchForm.depOrArv[0].checked){
      sentenceB = time + ' 出発';
    }else{
      sentenceB = time + ' 到着';
    }
    
    setTitle('検索結果')
    setSentence1(sentenceA);
    setSentence2(sentenceB);
  }

  const handleSearch = () =>{
    inputCheck();
    if(error === ''){
      setTitle('')
      setSentence1('');
      setSentence2('');
      setError('');
      searchAndFetch();
    }
    
  }

  useEffect(() => {
    //setFormDataイベントが発火したら、searchAndFetchメソッドを呼び出す
    document.getElementById('search').addEventListener('click', handleSearch);

  })

  return(
    <div className="result">
      <form>
        <input id="search" type="button" name="search" value="検索" />  
      </form>  
      <h2>{title}</h2>
        {sentence1}<br />
        {sentence2}<br />
        <ul>
          {test2}
        </ul>
        {error}
    </div>
  )
    

}

export default Result;