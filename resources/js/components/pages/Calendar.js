import React, { Component } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import FullCalendar, { formatDate } from '@fullcalendar/react';
import Navigation from '../Navigation';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Row, Col, Form } from 'react-bootstrap';


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

        
    handleEventClick (clickInfo) {
        if (window.confirm(`Biztosan törlöd ezt az eseményt: '${clickInfo.event.title}'?`)) {
            clickInfo.event.remove()
        }
    }

    handleEvents (events) {
        this.setState({
            currentEvents: events
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
            } )
        };
        fetch(`${process.env.MIX_DOMAIN}/api/save-event`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            //ha minden oké, akkor ez, különben ..még fejlesztés alatt
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
                                        events={this.state.all_events} // alternatively, use the `events` setting to fetch from a feed
                                        select={(time) => this.setState({ 
                                                show: true, 
                                                eventStart: time.start,
                                                eventEnd: time.end,
                                            })
                                        }
                                        eventContent={renderEventContent} // custom render function
                                        eventClick={this.handleEventClick}
                                        eventsSet={this.handleEvents.bind(this)} // called after events are initialized/added/changed/removed
                                        /* you can update a remote database when these fire:
                                        eventAdd={function(){}}
                                        eventChange={function(){}}
                                        eventRemove={function(){}}
                                        */
                                    />


                                    <SweetAlert
                                        show={this.state.show}
                                        title={this.state.modalTitle}
                                        onConfirm={() => this.saveEvent()}
                                        onCancel={() => this.setState({ show: false })}
                                        confirmBtnText = "Mentés"
                                        cancelBtnText = "Mégse"
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

function renderEventContent(eventInfo) {
  return (
    <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
    </>
  )
}

  
export default Calendar;