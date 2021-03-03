import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navigator from './Navigator'
import Search from './Search';
import HistorySearch from './HistorySearch'


const App = () =>{
  return(
    <div className="App">
      <div>
        <h1>交通アプリ</h1>
      </div>
      <div>
        <Router>
          <Navigator /><hr/>  
          <Route exact path="/" component={Search}/>
          <Route exact path="/history" component={HistorySearch}/>
        </Router>
      </div>
    </div>
  );
} 

export default App;