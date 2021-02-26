class Logic {

  makeCurrent(numArray){
    const type = numArray[0];
    numArray.shift();
    const strArray = numArray.map(this.to2digits)
    if(type === 'date'){
      return this.makeCurrentDate(strArray)
    }else{
      return this.makeCurrentTime(strArray)
    }
  }

  to2digits(value){
    if(value < 10){
      return '0' + String(value);
    }else{
      return String(value); 
    }
  }

  makeCurrentDate(array){
    return array[0] + '-' + array[1]+ '-' + array[2];
  }

  makeCurrentTime(array){
    return array[0] + ':' + array[1];
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