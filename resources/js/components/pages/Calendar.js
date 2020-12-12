import React, { Component } from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import Navigation from '../Navigation';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Row, Col } from 'react-bootstrap';

class Calendar extends Component {
    render(){ return (
        <div>
            <Navigation bg="dark"/>
            <div id="page-content">
            <Row>
                <Col>
                    <PageContent/>
                </Col>
            </Row>
           </div>
        </div>
    )};
}

class PageContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentEvents: [],
            all_events: [],
        }
    }


    componentWillMount(){
        this._isMounted = true;
        fetch(`${process.env.MIX_DOMAIN}/api/events`)
        .then((res) => res.json())
        .then((data) => {
            
            this.setState({
                all_events: data
            });
            console.log(this.state.all_events)
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


    render() {
        return (
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
                    select={this.handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={this.handleEventClick}
                    eventsSet={this.handleEvents.bind(this)} // called after events are initialized/added/changed/removed
                    /* you can update a remote database when these fire:
                    eventAdd={function(){}}
                    eventChange={function(){}}
                    eventRemove={function(){}}
                    */
                />
            </div>
        </div>
    )}

    handleDateSelect(selectInfo){
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        }
    }

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