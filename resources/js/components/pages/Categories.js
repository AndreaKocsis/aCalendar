import React, { Component,  useEffect } from 'react';
import Navigation from '../Navigation';
import {Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { MDBDataTableV5, Container, CardBody, DataTable } from 'mdbreact';


class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriesData : [],
            isLoading: true
        }
        this.getCategoriesHandler = this.getCategoriesHandler.bind(this);
    }

    async getCategoriesHandler(){
        const res = await axios.get(`${process.env.MIX_DOMAIN}/api/get-categories`)
        this.setState({loading:false, categoriesData: res.data})
    }

    componentDidMount(){
        this.getCategoriesHandler();
    }

    render(){ return (
        <div>
            <Navigation bg="dark"/>
            <div id="page-content">
                <h3 id="page-title">KATEGÓRIÁK</h3>
                <Row>
                    <Col sm={4}><NewCategoryForm onSubmit={this.getCategoriesHandler}/></Col>
                    <Col sm={8} className="table-content"><CategoriesList dataLoad={this.state.categoriesData}/></Col>
                </Row>
            </div>
        </div>
    )};
}

class NewCategoryForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            description : '',
            msg: "",
            errMsg:"",
            redirect: false,
            rerenderDatatable: props.callBack
        }
    
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangehandler = this.onChangehandler.bind(this);
    }

    onSubmitHandler(){
        axios.post(`${process.env.MIX_DOMAIN}/api/create-category`, {
            name: this.state.name,
            description: this.state.description,
        })
        .then((response) => {
            if (response.data.status === 200) {
                this.setState({msg : response.data.message})
                this.props.onSubmit();
                
            } else {
                this.setState({errMsg : response.data.validation_error})
            }
        })
        .catch((error) => {
            this.setState({errMsg : response.data.validation_error})
        });
        this.setState({redirect : true})
        
    }

    onChangehandler(e){
        let name = e.target.name;
        let value = e.target.value;
        let data = {};
        data[name] = value;
        data['msg'] = data['errMsg'] = false;
        this.setState(prevState => data);
    };

    render(){ return (
        <div>
            <h5>Új kategória létrehozása</h5>
            <Form>
            <Form.Group>
                <Form.Label>Kategória neve:</Form.Label>
                <Form.Control type="text" name="name" value={this.state.name || ''} onChange={this.onChangehandler}/>
            </Form.Group>

            <Form.Group>
                <Form.Label>Kategória leírás:</Form.Label>
                <Form.Control type="text" name="description" value={this.state.description || ''} onChange={this.onChangehandler}/>
            </Form.Group>

            <Form.Group>
                <p className="text-success">{this.state.msg}</p>
                <p className="text-danger">{this.state.errMsg}</p>
            </Form.Group>

            <Button variant="dark" block onClick={() => this.onSubmitHandler()}>
                Létrehozás
            </Button>
            </Form>
        </div>
    )};
}

function CategoriesList (props){
    return ( 
    <div>
        <h5>Kategórialista</h5>
        <DataTable
            entriesOptions={[10, 50, 100]}
            entries={10}
            pagesAmount={10}
            data={props.dataLoad}
            responsive
            fixed
            bordered
        />      
    </div>
    )
}


export default Categories;