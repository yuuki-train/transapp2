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

  saveData(id){
    const dateData = JSON.parse(sessionStorage.getItem('dateData'));
    const trainsData = JSON.parse(sessionStorage.getItem('trainsData'));
    const trainData = trainsData[id];
    const data = dateData.concat(trainData);

    const URL = 'http://localhost:8080/save'
    fetch(URL, {
      method: 'POST',
      mode: 'cors',
      body: data
    })
    .then(res => res.json())
    .then(json =>{
      if(json[0]['result'] === 'OK'){
        return alert('経路の保存が完了しました。');
      }else{
        return alert('サーバ側でエラーが発生しました。');
      }
    })
    .catch(error =>{
      console.error('Error:', error)
      return alert('クライアント側でエラーが発生しました。');
    })
  }
}

export default Logic