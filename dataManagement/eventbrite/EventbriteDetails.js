import React from 'react';
import * as eventbriteService from '../../../services/eventbriteServices';
import moment from 'moment';

class EventbriteDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            eventbrite: {}
        }
        this.toList=this.toList.bind(this)
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const promise = eventbriteService.getById(id)
        promise.then(response => {
            this.setState({
                eventbrite: response
            })
        })
            .catch(console.error)
    }

    toList() {
        this.props.history.push("/data-management/eventbrite/list")
    }

    render() {
        if (!this.state.eventbrite.name){
            return null;
        }

        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>{this.state.eventbrite.name.text}</h1>
                    <small>{moment(this.state.eventbrite.start.utc).format('MMMM Do YYYY, h:mm:ss a')}</small>
                </header>
                <div className="card" href={this.state.eventbrite.url}>
                        <img className="card-img-top" src={this.state.eventbrite.logo ? this.state.eventbrite.logo.url : 'http://www.otczenacts.com/images/no-image.jpg'} alt="" />
                        <div className="card-body">
                            <p className="card-text">{this.state.eventbrite.description.text}</p>
                        </div>

                        <div className="blog__tags tags">
                            <div className="tags__body">
                            <a href="">#Mentorship</a>
                                    <a href="">#Coaching</a>
                                    <a href="">#Start-Up</a>
                                    <a href="">#City of LA</a>
                                    <a href="">#Entrepreneur</a>
                            </div>
                        </div>

                    <div className="blog__arthur">
                        <div className="blog__arthur-img">
                            <img src="demo/img/contacts/1.jpg" alt="" />
                        </div>
                        <div className="groups__info">

                            <a href={this.state.eventbrite.url} target='_blank' ><button style={{ float: "right" }} type="button" class="btn btn-light btn-lg" data-automation="ticket-modal-btn" aria-haspopup="true">See Details in EventBrite</button></a>


                            <button type="button" style={{ float: "left" }} class="btn btn-light btn-lg" data-automation="ticket-modal-btn" aria-haspopup="true"
                                onClick={e => this.toList(e)}>Back</button>

                        </div>
                    </div>


                    </div>

            </React.Fragment>
        )
    }
}

export default EventbriteDetails;