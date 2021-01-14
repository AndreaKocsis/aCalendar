import React, { Component,  useEffect } from 'react';
import Navigation from '../Navigation';
import {Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { MDBDataTableV5, Container, CardBody, DataTable } from 'mdbreact';


class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagsData : [],
            isLoading: true,
            userData: JSON.parse(localStorage.getItem("userData"))
        }
        this.getTagsHandler = this.getTagsHandler.bind(this);
    }

    async getTagsHandler(){
        const res = await axios.post(`${process.env.MIX_DOMAIN}/api/get-tags`,{user_id: this.state.userData.id})
        this.setState({loading:false, tagsData: res.data})
    }

    componentDidMount(){
        this.getTagsHandler();
    }

    render(){ return (
        <div>
            <Navigation bg="dark"/>
            <div id="page-content">
                <h3 id="page-title">CÍMKÉK</h3>
                <Row>
                    <Col sm={4}><NewTagForm onSubmit={this.getTagsHandler}/></Col>
                    <Col sm={8} className="table-content"><TagList dataLoad={this.state.tagsData}/></Col>
                </Row>
            </div>
        </div>
    )};
}

class NewTagForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            description : '',
            msg: "",
            errMsg:"",
            redirect: false,
            rerenderDatatable: props.callBack,
            userData: JSON.parse(localStorage.getItem("userData"))
        }
    
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangehandler = this.onChangehandler.bind(this);
    }

    onSubmitHandler(){
        axios.post(`${process.env.MIX_DOMAIN}/api/create-tag`, {
            name: this.state.name,
            description: this.state.description,
            user_id: this.state.userData.id,
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
            <h5>Új címke létrehozása</h5>
            <Form>
            <Form.Group>
                <Form.Label>Címke neve:</Form.Label>
                <Form.Control type="text" name="name" value={this.state.name || ''} onChange={this.onChangehandler}/>
            </Form.Group>

            <Form.Group>
                <Form.Label>Címke leírás:</Form.Label>
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

function TagList (props){
    return ( 
    <div>
        <h5>Címkelista</h5>
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


export default Tags;