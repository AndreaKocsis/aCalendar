import React, { Component } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import FullCalendar, { formatDate } from '@fullcalendar/react';
import Navigation from '../Navigation';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Row, Col, Form, ButtonGroup, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
// import Tooltip from "https://unpkg.com/tooltip.js/dist/umd/tooltip.min.js";


class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentEvents: [],
            all_events: [],
            show: false,
            modalTitle: 'Új esemény létrehozása',
            eventTitle: '',
            eventDescription: '',
            eventCategories: [],
            eventSelectedCategory: 0,
            eventStart : '',
            eventEnd : '',
            eventId: 0,
        }

        this.getEvents = this.getEvents.bind(this);
    }


    componentWillMount(){
        this._isMounted = true;
        this.getEvents();


        fetch(`${process.env.MIX_DOMAIN}/api/get-categories-to-calendar`)
        .then((res) => res.json())
        .then((eventCategories) => {
            this.setState({eventCategories: eventCategories})
        } )     
    }

    getEvents(){
        fetch(`${process.env.MIX_DOMAIN}/api/events`)
        .then((res) => res.json())
        .then((data) => {
            
            this.setState({
                all_events: data
            });
        })
    }

    eventDateSelect(time){
        this.eventModalBlur()
        this.setState({ 
            modalTitle: 'Új esemény létrehozása',
            show: true, 
            eventStart: time.start,
            eventEnd: time.end,
        })
    }

        
    handleEventClick (e) {
       
        this.eventModalBlur();
        this.setState({
            modalTitle: e.event.title+' esemény módosítása',
            show: true,
            eventId: e.event.id,
            eventTitle: e.event.title,
            eventDescription: e.event.extendedProps.description,
            eventSelectedCategory: e.event.extendedProps.category_id,
            eventStart: e.event.start,
            eventEnd: e.event.end,
        })
    }

    deleteEvent(){
        if (window.confirm(`Biztosan törlöd ezt az eseményt: '${this.state.eventTitle}'?`)) {
            alert('hehe, ez még not ready')
        }
    }

    handleEvents (events) {
        this.setState({
            currentEvents: events
        })
    }

    eventContent (e) {
        return (
            <>
              <b>{e.timeText}</b>
              <p><i>{e.event.title}</i></p>
            </>
        )
    };

    eventRender(info) {
        // var tooltip = new Tooltip(info.el, {
        //   title: info.event.extendedProps.title,
        //   placement: "top",
        //   trigger: "click",
        //   container: "body"
        // });
    }

    eventModalBlur(){
        this.setState({
            show: false,
            eventId: 0,
            eventTitle: '',
            eventDescription: '',
            eventSelectedCategory: 0,
            eventStart: '',
            eventEnd: '',
        })
    }


    saveEvent(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: this.state.eventTitle, 
                description: this.state.eventDescription, 
                category_id: this.state.eventSelectedCategory,
                start: this.state.eventStart,
                end: this.state.eventEnd,
                id: this.state.eventId,
            } )
        };
        fetch(`${process.env.MIX_DOMAIN}/api/save-event`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            if(data['status'] == 200){
                this.setState({
                    show: false,
                    eventSelectedCategory: 0,
                    eventTitle: '',
                    eventDescription: '',
                })

                this.getEvents();
            }
            alert(data['msg'])
        } )
    }


    render() {
        return (
            <div>
                <Navigation bg="dark"/>
                <div id="page-content">
                    <Row>
                        <Col>
                            <div className='demo-app'>
                                <div className='demo-app-main'>
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                        }}
                                        locale='hu'
                                        buttonText= {{
                                            today: 'ma',
                                            month: 'hónap',
                                            week: 'hét',
                                            day: 'nap',
                                        }}
                                        allDayText= 'egész nap'
                                        firstDay='1'
                                        initialView='timeGridWeek'
                                        editable={true}
                                        selectable={true}
                                        selectMirror={true}
                                        dayMaxEvents={true}
                                        events={this.state.all_events}
                                        select={this.eventDateSelect.bind(this)}
                                        eventClick={this.handleEventClick.bind(this)}
                                        eventsSet={this.handleEvents.bind(this)} 
                                        eventContent={this.eventContent}
                                        eventRender={this.eventRender}
                                    />


                                    <SweetAlert
                                        show={this.state.show}
                                        title={this.state.modalTitle}
                                        closeOnConfirm= {false}
                                        showConfirmButton= {false} 
                                        showCancelButton= {false} 
                                        >
                                        <hr/>
                                        <Form>
                                            <Form.Group as={Row} >
                                                <Form.Label column sm="3" style={{textAlign :'left'}}>Cím:</Form.Label>
                                                <Col sm="9"><Form.Control type="text" name="title" placeholder={'Esemény megnevezése'} value={this.state.eventTitle} onChange={(e) => this.setState({ eventTitle: e.target.value })}/></Col>
                                            </Form.Group>

                                            
                                            <Form.Group as={Row} >
                                                <Form.Label column sm="3" style={{textAlign :'left'}}>Start:</Form.Label>
                                                <Col sm="6">
                                                    <Datetime 
                                                        onChange={(e) => this.setState({ eventStart: e })}
                                                        value={this.state.eventStart}
                                                        dateFormat='YYYY-MM-DD'
                                                        timeFormat=''
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <Datetime 
                                                        onChange={(e) => this.setState({ eventStart: e })}
                                                        value={this.state.eventStart}
                                                        dateFormat=""
                                                        timeFormat='HH:mm'
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} >
                                                <Form.Label column sm="3" style={{textAlign :'left'}}>Vége:</Form.Label>
                                                <Col sm="6">
                                                    <Datetime 
                                                        onChange={(e) => this.setState({ eventEnd: e })}
                                                        value={this.state.eventEnd}
                                                        dateFormat='YYYY-MM-DD'
                                                        timeFormat=''
                                                    />
                                                </Col>
                                                <Col sm="3">
                                                    <Datetime 
                                                        onChange={(e) => this.setState({ eventEnd: e })}
                                                        value={this.state.eventEnd}
                                                        dateFormat=""
                                                        timeFormat='HH:mm'
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} >
                                                <Form.Label column sm="3" style={{textAlign :'left'}}>Kategória:</Form.Label>
                                                <Col sm="9">
                                                    <Form.Control as="select" value={this.state.eventSelectedCategory} onChange={(e) => this.setState({eventSelectedCategory: e.target.value})}>
                                                        <option key={0} value={0}>Kérem válasszon!</option>
                                                        {Object.keys(this.state.eventCategories).map((row) =>
                                                        <option key={row} value={row}>
                                                            {this.state.eventCategories[row]['name']}
                                                        </option>
                                                        )}
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} >
                                                <Form.Label column sm="3" style={{textAlign :'left'}}>Leírás:</Form.Label>
                                                <Col sm="9"><Form.Control as="textarea" rows={3} name="description" placeholder={'Leírás..'} value={this.state.eventDescription} onChange={(e) => this.setState({ eventDescription: e.target.value })}/></Col>
                                            </Form.Group>

                                            <ButtonGroup className="mb-2 btn-block">
                                                <Button variant="success" onClick={() => this.saveEvent()}>Mentés</Button>
                                                <Button variant="primary" onClick={(e) => this.setState({ show: false })}>Mégse</Button>

                                                {this.state.eventId != 0 &&
                                                    <Button variant="danger"  onClick={(e) => this.deleteEvent().bind(this)}>Törlés</Button>
                                                }
                                            </ButtonGroup>
                                        </Form>
                                        <hr/>
                                        
                                    </SweetAlert>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        
        
    )}

}

  
export default Calendar;