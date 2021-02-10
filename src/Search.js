import {useState, useEffect } from 'react';

const Search = () =>{
  const [paramater, setParamater] = useState('');

  useEffect(() => {
    const handleClick = () => {
      const param = document.getElementById('line').value;
      setParamater(param);

      const event = new CustomEvent('setParamater', {detail: param});
      document.getElementById('result').dispatchEvent(event);
      setParamater("");
    }
    document.getElementById('search').addEventListener('click', handleClick);
  });

  return(
    <div className="Search">
      <form id="form" name ='form'>
        <input id="line" type="text" name="line" defaultValue="山手線"/><br/>
        <input id="search" type="button" name="search" value="検索"/>
      </form>
      <span id="result">{paramater}</span>
    </div>
  );    
}

export default Search;
