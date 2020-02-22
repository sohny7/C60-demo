import React from 'react';
import * as validation from '../../../utils/validation';
import * as workshopEventsServices from '../../../services/workshopEventsServices';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import '../../../theme/style/dark.css';
import './WorkshopEventsForm.css';

class WorkshopEventsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            host: '',
            description: '',
            addressId: '',
            startTime: new Date(),
            endTime: new Date(),
            url: '',
            imageUrl: '',
            isRegistered: false,
            editProfile: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.onChangeRadio = this.onChangeRadio.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onStartDateChange = this.onStartDateChange.bind(this);
        this.onEndDateChange = this.onEndDateChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeRadio(e) {
        this.setState({
            isRegistered: e.target.value === 'true'
        })
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id;
            workshopEventsServices.getById(id)
                .then(response => {
                    this.setState({
                        title: response.title,
                        host: response.host,
                        description: response.description,
                        addressId: response.addressId,
                        startTime: new Date(response.startTime),
                        endTime: new Date(response.endTime),
                        url: response.url,
                        imageUrl: response.imageUrl,
                        isRegistered: response.isRegistered,
                        editProfile: true
                    });
                })
                .catch(console.error)
        } else {
            return null;
        }
    }

    onSubmit() {
        const data = {
            title: this.state.title,
            host: this.state.host,
            description: this.state.description,
            addressId: this.state.addressId,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            url: this.state.url,
            imageUrl: this.state.imageUrl,
            isRegistered: this.state.isRegistered
        };
        if (!this.state.editProfile) {
            workshopEventsServices.create(data)
                .then(() => {
                    this.props.history.push('/data-management/workshopevents/list');
                })
                .catch(console.error);
        } else {
            workshopEventsServices.edit(this.props.match.params.id, data)
                .then(() => {
                    this.props.history.push('/data-management/workshopevents/list');
                })
                .catch(console.error);
        }
    }

    onStartDateChange(input) {
        this.setState({
            startTime: input[0]
        })
    }

    onEndDateChange(input) {
        this.setState({
            endTime: input[0]
        })
    }

    onReset() {
        this.setState({
            title: '',
            host: '',
            description: '',
            addressId: '',
            startTime: '',
            endTime: '',
            url: '',
            imageUrl: '',
            isRegistered: ''
        })
    }

    getTitleValidation() {
        if (this.state.title.length > 200) {
            return false;
        } else {
            return true;
        }
    }

    getHostValidation() {
        if (this.state.host.length > 200) {
            return false;
        } else {
            return true;
        }
    }

    getUrlValidation() {
        if (this.state.url.length > 3000) {
            return false;
        } else {
            return true;
        }
    }

    getImageUrlValidation() {
        if (this.state.imageUrl.length > 3000) {
            return false;
        } else {
            return true;
        }
    }

    getDescriptionValidation() {
        if (this.state.description.length > 4000) {
            return false;
        } else {
            return true;
        }
    }

    buttonToggle() {
        return validation.emptyStringCheck(this.state.title) && validation.emptyStringCheck(this.state.host) && validation.emptyStringCheck(this.state.description) && validation.emptyStringCheck(this.state.addressId) && validation.emptyStringCheck(this.state.imageUrl) && validation.emptyStringCheck(this.state.url) && validation.emptyStringCheck(this.state.startTime) && validation.emptyStringCheck(this.state.endTime) && validation.emptyStringCheck(this.state.isRegistered);
    }

    render() {
        const startDate = this.state.startTime;
        const endDate = this.state.endTime;
        return (
            <div className='content__inner'>

                <div className="card">
                    <div className="card-body">

                        <h4 className="card-title">Workshop/Events Input Form</h4>
                        <h6 className="card-subtitle">Add your own events into the system.</h6>

                        <div className='row'>
                            <div className="col-sm-4">
                                <FormGroup>
                                    <ControlLabel>Title:</ControlLabel>
                                    <FormControl type='text' id='title' name='title' value={this.state.title} onChange={this.handleChange} />
                                    {this.getTitleValidation() === false ? <HelpBlock style={{ color: 'red' }}>Title must be no longer than 200 characters long.</HelpBlock> : null}
                                </FormGroup>
                            </div>
                            <div className="col-sm-4">
                                <FormGroup>
                                    <ControlLabel>Hosted By:</ControlLabel>
                                    <FormControl type='text' id='host' name='host' value={this.state.host} onChange={this.handleChange} />
                                    {this.getHostValidation() === false ? <HelpBlock style={{ color: 'red' }}>Host name must be no longer than 200 characters long.</HelpBlock> : null}
                                </FormGroup>
                            </div>
                            <div className="col-sm-4">
                                <p className='custom-control custom-radio' style={{ padding: '0' }}>Registered?</p>
                                <br></br><br></br>
                                <div className='form-group'>
                                    <label className="custom-control custom-radio">
                                        <input type="radio" name="isRegistered" className="custom-control-input" value={true} checked={this.state.isRegistered === true} onChange={this.onChangeRadio} />
                                        <span className="custom-control-indicator"></span>
                                        <span className="custom-control-description">Yes</span>
                                    </label>
                                    <label className="custom-control custom-radio">
                                        <input type="radio" name="isRegistered" className="custom-control-input" value={false} checked={this.state.isRegistered === false} onChange={this.onChangeRadio} />
                                        <span className="custom-control-indicator"></span>
                                        <span className="custom-control-description">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-3">
                                <ControlLabel>Start Time:</ControlLabel>
                                <FormGroup className='input-group'>
                                    <span className='input-group-addon'>
                                        <i className='zmdi zmdi-calendar'></i>
                                    </span>
                                    <Flatpickr data-enable-time value={startDate} options={{ mode: 'single', minuteIncrement: '1' }} onChange={startDate => { this.onStartDateChange(startDate) }} />
                                </FormGroup>
                            </div>
                            <div className="col-sm-3">
                                <ControlLabel>End Time:</ControlLabel>
                                <FormGroup className='input-group'>
                                    <span className='input-group-addon'>
                                        <i className='zmdi zmdi-calendar'></i>
                                    </span>
                                    <Flatpickr data-enable-time value={endDate} options={{ mode: 'single', minuteIncrement: '1' }} onChange={endDate => { this.onEndDateChange(endDate) }} />
                                </FormGroup>
                            </div>
                            <div className="col-sm-3">
                                <FormGroup>
                                    <ControlLabel>URL:</ControlLabel>
                                    <FormControl type='text' id='url' name='url' value={this.state.url} onChange={this.handleChange} />
                                    {this.getUrlValidation() === false ? <HelpBlock style={{ color: 'red' }}>URL must be no longer than 3000 characters long.</HelpBlock> : null}
                                </FormGroup>
                            </div>
                            <div className="col-sm-3">
                                <FormGroup>
                                    <ControlLabel>Image URL:</ControlLabel>
                                    <FormControl type='text' id='imageUrl' name='imageUrl' value={this.state.imageUrl} onChange={this.handleChange} />
                                    {this.getImageUrlValidation() === false ? <HelpBlock style={{ color: 'red' }}>Image URL must be no longer than 3000 characters long.</HelpBlock> : null}
                                </FormGroup>
                            </div>
                        </div>

                        <FormGroup>
                            <ControlLabel>Address:</ControlLabel>
                            <FormControl type='text' id='addressId' name='addressId' value={this.state.addressId} onChange={this.handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description:</ControlLabel>
                            <FormControl componentClass='textarea' rows='10' id='description' name='description' value={this.state.description} onChange={this.handleChange} />
                            {this.getDescriptionValidation() === false ? <HelpBlock style={{ color: 'red' }}>Description must be no longer than 4000 characters long.</HelpBlock> : null}
                        </FormGroup>

                        <div className='row'>
                            <div className='col-sm-6'>
                                <button type='button' className='btn btn-success btn-lg btn-block' disabled={!this.buttonToggle()} onClick={this.onSubmit}>{this.state.editProfile ? 'Update' : 'Submit'}</button>
                            </div>
                            <div className='col-sm-6'>
                                <button type='button' className='btn btn-danger btn-lg btn-block' onClick={this.onReset}>Reset Form</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default WorkshopEventsForm;