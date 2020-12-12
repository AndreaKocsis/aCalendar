import React, { Component } from 'react';
import Navigation from '../Navigation';


class Tags extends Component {
    render(){ return (
        <div>
            <Navigation bg="dark"/>
            <PageContent/>
        </div>
    )};
}

class PageContent extends Component {
    render(){ return (
        <div>
            tags
        </div>
    )};
}
  
export default Tags;