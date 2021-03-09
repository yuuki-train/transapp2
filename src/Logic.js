class Logic {

  //makeCurrentメソッド：日付・時刻を取得し、文字列形式で返す。
  makeCurrent(type){
    const numArray = this.makeNumArray(type);
    numArray.shift();
    const strArray = numArray.map(this.to2digits);
    return this.makeDateOrTime(type, strArray);
  }

  makeNumArray(type){
    const now = new Date();
    if(type === 'time'){
      return [type, now.getHours(), now.getMinutes()]; 
    }else{
      const array = [type, now.getFullYear(), now.getMonth()+1]
      if(type === 'date'){
        array.push(now.getDate())
      }
      return array
    }
  }
  
  to2digits(value){
    if(value < 10){
      return '0' + String(value);
    }else{
      return String(value); 
    }
  }
  
  makeDateOrTime(type, strArray){
    if((type === 'month')||(type === 'date')){
      return this.makeCurrentDate(strArray)
    }else{
      return this.makeCurrentTime(strArray)
    }
  }

  makeCurrentDate(array){
    let result = array[0] + '-' + array[1];
    if(array[2] !== undefined){
      result = result + '-' + array[2];
    }
    return result;
  }
  
  makeCurrentTime(array){
    return array[0] + ':' + array[1];
  }
  
  
  //inputErrorCheckメソッド：必須入力項目で、入力エラーを確認する
  inputErrorCheck(valueArray, wordArray, message){
    for(let i in valueArray){
      if(valueArray[i] === ""){
        message = message + this.makeErrorMessage(wordArray[i], message);
      }
    }
    return this.checkMessage(message);
  }

  makeErrorMessage(word, message){
    let result = ''
    if(message === ''){
      result = word;
    }else{
      result ='、' + word;
    }
    return result;
  }

  checkMessage(message){
    if(message !== ''){
      message = message + 'を正しく入力してください';
    }
    return message;
  }



  dispatchFetch = (type, jsonParam) =>{
    if(type === 'search'){
      return this.fetchResultForSearch(jsonParam);
    }else if(type === 'save'){
      return this.fetchResultForSave(jsonParam);
    }else{
      return this.fetchResultForHistory(jsonParam);
    }
  }

  fetchResultForSearch = (jsonParam) =>{
    const arrayData = this.makeData(jsonParam);
    const jsonData = JSON.stringify(arrayData); 
    sessionStorage.setItem('trainsData', jsonData);
    return this.resultErrorCheck(jsonParam);
  }

  fetchResultForHistory = (jsonParam) =>{
    if(jsonParam[0]['id'] == 2){
      return "OK";
    }else{
    return "Error";
    }


  }

  makeData(json){
    const dataArray = [];
    const key = ['id', 'line', 'departure', 'depHour', 'depMinute', 'depTime', 
    'destination', 'arvHour', 'arvMinute', 'arvTime', 'totalMinutes', 'trainType', 
    'totalCharge', 'fair', 'fee', 'changeTrain']

    for(let i in json){
      const valueArray = [];
      for(let j of key){
        valueArray.push(json[i][j]);
      }  
      dataArray.push(valueArray);   
    }
    return dataArray;
  }

  resultErrorCheck = (jsonParam) =>{
    //検索件数が0件の場合は、結果無しエラーメッセージをerrorにセットする
    if(jsonParam.length === 0){
      return '検索結果が0件です。再度検索してください'     
    }else{
      return this.makeResult(jsonParam);
    }
  }


  makeResult = (jsonParam) =>{
    let searchResults = [];
    let searchDetails = [];
    let changeTrain = [];
    //検索件数分だけ繰り返す
    for(let i in jsonParam){
      changeTrain = this.inputChangeTrain(jsonParam, i, changeTrain);
      searchDetails = this.makeDetails(jsonParam, i, searchDetails, changeTrain);
      const routeCounter = this.makeRouteCounter(i);
      searchResults = this.makeSearchResults(jsonParam, i, searchResults, searchDetails, routeCounter);    
    }
    return searchResults;
  }

  inputChangeTrain = (jsonParam, i, changeTrain) =>{
    //大阪駅での乗り換えが必要：文言を配列に追加する
    //乗り換えが不要：空文字列を配列に追加する（※この機能は、APIの処理を変更次第削除予定）
    const returnArray = changeTrain;
    if(jsonParam[i]['changeTrain'] !== 0){
      returnArray.push('（大阪駅乗り換え）');
    }else{
      returnArray.push('');
    }
    return returnArray;
  }

  makeDetails = (jsonParam, i, searchDetails, changeTrain) =>{
    const returnArray = searchDetails;
    returnArray.push(
      <li key={jsonParam[i]["id"]}>
        {jsonParam[i]["depHour"]} : {jsonParam[i]["depMinute"]} {jsonParam[i]["departure"]}<br />
        {jsonParam[i]["line"]} {jsonParam[i]["trainType"]}{changeTrain[i]}<br />
        {jsonParam[i]["arvHour"]} : {jsonParam[i]["arvMinute"]} {jsonParam[i]["destination"]}<br />   
      </li>
    )   
    return returnArray;
  }

  makeRouteCounter = (i) =>{
    const numI = parseInt(i,10);
      return numI + 1;
  }

  makeSearchResults = (jsonParam, i, searchResults, searchDetails, routeCounter) =>{
    const returnArray = searchResults;
    returnArray.push(
      <li key={jsonParam[i]["id"]}>  
        <details>
          <summary>
            第{routeCounter}経路 {jsonParam[i]["depHour"]} : {jsonParam[i]["depMinute"]} → {jsonParam[i]["arvHour"]} : {jsonParam[i]["arvMinute"]}<br />
              {jsonParam[i]["totalMinutes"]}分、{jsonParam[i]["totalCharge"]}円（運賃{jsonParam[i]["fair"]}円、有料列車料金{jsonParam[i]["fee"]}円）、乗換{jsonParam[i]["changeTrain"]}回
            <form>
              <input id={i} type="button" name={i} value="この経路を利用する"  onClick={this.handleSave}/>
            </form>
          </summary>
          <ul>
            {searchDetails[i]}
          </ul>                         
        </details>
      </li>
    )     
    return returnArray;
  }

  

  //日付に合わせて適切な曜日を取得する
  dayCheck = (year, month, aDay) =>{
    const date = new Date();
    date.setFullYear(parseInt(year,10));
    date.setMonth(parseInt(month, 10)-1);
    date.setDate(parseInt(aDay,10));
    return "日月火水木金土".charAt(date.getDay());
  }

  saveDate = (year, month, aDay, day) =>{
    const dateData = [year, month, aDay, day];
    const jsonData = JSON.stringify(dateData);
    sessionStorage.setItem('dateData', jsonData);
  }

  makeSentenceA = (year, month, aDay, day ,departure, destination) => {
    return year +'年'+ month +'月'+ aDay +'日（'+ day + '） ' + departure + ' → ' + destination;
  }
  
  makeSentenceB = (time, depOrArv) => {
    if (depOrArv){
      return time + ' 出発';
    }else{
      return time + ' 到着';
    }
  }


  handleSave = (ev) =>{
    const e = ev || window.event;
    const elem = e.target || e.srcElement;
    const id = elem.id;
    this.saveSearchData(id);

  }

  getSaveData(id){
    const dateData = JSON.parse(sessionStorage.getItem('dateData'));
    const trainsData = JSON.parse(sessionStorage.getItem('trainsData'));
    const trainData = trainsData[id];
    return dateData.concat(trainData);
  }

  saveSearchData(id){
    if(window.confirm('この経路を利用しますか？（経路情報が保存されます。）')){
      const data = this.getSaveData(id);
      const URL = 'http://localhost:8080/save'
      const type = 'save'
      fetch(URL, {method: 'POST', mode: 'cors', body: data})
      .then(res =>res.json())
      .then(jsonParam =>{
        this.dispatchFetch(type, jsonParam);
      })
      .catch(error =>{
        console.error('Error:', error)
        alert('クライアント側でエラーが発生しました。');
      })
    }
  }

  fetchResultForSave = (jsonParam) =>{
    if(jsonParam[0]['result'] === 'OK'){
      alert('経路の保存が完了しました。');
    }else{
      alert('サーバ側でエラーが発生しました。');
    }
  }

}

export default Logic