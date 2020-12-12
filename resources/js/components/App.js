import React, { Component } from 'react';
import {Route, BrowserRouter as Router} from 'react-router-dom';

import Index from './pages/Index'
import Calendar from './pages/Calendar'
import Categories from './pages/Categories'
import Tags from './pages/Tags'

class App extends Component {
  render(){ return (
    <Router>
        <Route path="/" exact component={Index}/>
        <Route path="/calendar" exact component={Calendar}/>
        <Route path="/categories" exact component={Categories}/>
        <Route path="/tags" exact component={Tags}/>
    </Router>
  )};
}

export default App;
