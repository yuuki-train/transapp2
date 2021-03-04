import React from 'react';
import { Link } from 'react-router-dom';

const Navigator = () =>{

  return(
    <div>
      <Link id="searchLink" to="/">経路検索</Link><br/>
      <Link id="historyLink" to="/history">履歴及び利用額の確認</Link>
    </div>
  )
}

export default Navigator