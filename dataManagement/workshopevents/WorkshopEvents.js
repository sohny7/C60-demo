import React from 'react';
import * as workshopEventsServices from '../../../services/workshopEventsServices';
import WorkshopEventsList from './WorkshopEventsList';

class EventsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventsArray: []
        };
    }

    componentDidMount() {
        workshopEventsServices.getAll()
            .then(response => {
                this.setState({
                    eventsArray: response
                })
            })
            .catch(console.error)
    }

    render() {
        return (
            <React.Fragment>
                <WorkshopEventsList key={this.state.eventsArray} eventsArray={this.state.eventsArray} history={this.props.history} />
            </React.Fragment>
        )
    }
}

export default EventsList;