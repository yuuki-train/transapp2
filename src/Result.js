import {useState, useEffect } from 'react'

const Result = () =>{

  const [change, setChange] = useState('');
  const [error, setError] = useState('');
  const [sentence1, setSentence1] = useState('');
  const [sentence2, setSentence2] = useState('');
  const [data, setData] = useState('');
  const results = [];
  const details = [];
  
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
      details.length = 0;
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
  
  const searchAndFetch = (count) =>{
    count = count + 1;
    setData(count);  
    const URL = 'http://localhost:8080/plus'
    fetch(URL, {
      method: 'POST',
      mode: 'cors',
    })
    .then(res =>res.json())
    .then(json =>{
      results.push(json["response"])
      //makeResult(json);
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
    setSentence1(sentenceA);
    setSentence2(sentenceB);
  }

  const handleData = (e) =>{
    let count = 0;
    const formData = e.detail;
    
    setSentence1('');
    setSentence2('');
    setError('');

    searchAndFetch(count);
    
    
    if(error === ''){
      makeSentences();
    }
    

  }

  useEffect(() => {
    //setFormDataイベントが発火したら、searchAndFetchメソッドを呼び出す
    document.getElementById('data').addEventListener('setFormData', handleData);
  })

  if(results.length !== 0){
    return(
      <div className="result">
          <h2>検索結果</h2>
          {sentence1}<br />
          {sentence2}<br />
          <ul>
            {results}
          </ul>  
        </div>
    )
  }else{
    return(
      <div className="result">
        {error}
        {data}
      </div>
    )
  }  

}

export default Result;