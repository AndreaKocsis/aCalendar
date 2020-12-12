import React, { Component } from 'react';
import Navigation from '../Navigation';


class Categories extends Component {
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
            Categories
        </div>
    )};
}
  
export default Categories;