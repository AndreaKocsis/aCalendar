import React, { Component } from 'react';
import Navigation from '../Navigation';


class Index extends Component {
    render(){ return (
        <div className="bg-img">
            <Navigation bg="transparent"/>
            <PageContent/>
        </div>
    )};
}

class PageContent extends Component {
    render(){ return (
        <div className="title">
            <div>“Céljaink határidős álmok.”</div>
            <div className="title-writer">– Diana Scharf Hunt</div>
        </div>
    )};
}
  
export default Index;