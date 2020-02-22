import React, { Component } from 'react';
import * as userService from '../../../services/userService';
import Select from 'react-select';
import { ControlLabel, FormGroup, Modal, Button, FormControl, Form } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import '../../../../node_modules/flatpickr/dist/themes/dark.css';
import * as appointmentsService from '../../../services/appointmentsService';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import swal from 'sweetalert2';
import * as sendGridService from '../../../services/sendGridService'

class ScheduleAppointments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayModal: false
            , coaches: []
            , options: [
                { value: 'default'
                , label: 0 }
            ],
            selectedOption: null
            , requesterId: 0
            //guest id from connectionId selected coach
            , guestId: 0
            , appointmentDate: ''
            , appointmentEndDate: ''
            , location: ''
            , description: ''
        }

        this.onAppDateChange = this.onAppDateChange.bind(this)
        this.onSubmitAppointment = this.onSubmitAppointment.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.showModal = this.showModal.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    handleChange = (selectedOption) => { this.setState({ selectedOption }) }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        let id = this.props.userId || this.props.match.params.id

        const promise = userService.getUserIdNetwork(id)
        promise.then(response => {
            const coaches = []
            const coachItems = response.item
            coachItems.map(item => {
                coaches.push({
                    value: item.connectionId
                    , label: `${item.firstName} ${item.lastName}`
                })
                this.setState({
                    options: coaches
                    , requesterId: id
                })
            })
        })
            .catch(console.error)
    }

    onSubmitAppointment(event) {
        event.preventDefault()

        if(this.state.selectedOption === null){
            swal({
                type: 'error',
                title: 'Oops...',
                text: 'Please Select A Coach',
                showCancelButton: true,
                cancelButtonColor: '#7ac7f6',
                timer: 2000,
                background: '#0f2940'
              })
        }
        else{
            let id = this.state.requesterId
            if(id === 0){
                id = this.props.userId
            }
            const appointmentData = {
                  requesterId: id
                , guestId: this.state.selectedOption.value
                , appointmentDate: this.state.appointmentDate
                , appointmentEndDate: this.state.appointmentEndDate
                , location: this.state.location
                , description: this.state.description
            }
            swal({
                type: 'success',
                title: 'Your appointment is set!',
                showConfirmButton: true,
                confirmButtonColor: '#7ac7f6',
                timer: 2500,
                background: '#0f2940'
              })
              
            const promise = appointmentsService.create(appointmentData)
            promise.then((response) => {
                appointmentData.id = response.Id
                sendGridService.sendAppointmentEmail(appointmentData);
            })
            promise.then(response => {
                this.props.displayAppointment()
                this.props.scheduleAppt()
                this.clearForm()
            })
            .catch(console.error)
        }
    }

    onAppDateChange(dateSelected) {
            let dateToString = dateSelected.toString()
            let ISODate = moment(dateToString).format('YYYY-MM-DD HH:mm')
            if(this.validateDates(ISODate)){
                swal({
                    type: 'warning',
                    title: 'Oops',
                    text: 'Cannot select a past date',
                    showCancelButton: true,
                    cancelButtonColor: '#7ac7f6',
                    background: '#0f2940'
                })
            }
            this.setState({
                appointmentDate: ISODate
              , appointmentEndDate: ISODate
            })
    }

    validateDates(date) {
        const todayDate = moment(new Date().toISOString()).format('YYYY-MM-DD HH:mm')
        let value = date < todayDate
            ? true
            : false
        return value
    }

    showModal() {
        this.setState({
            displayModal: true
        })
    }

    hideModal() {
        this.setState({
            displayModal: false
        })
    }

    clearForm() {
        this.setState({
            selectedOption: null
            , appointmentDate: ''
            , appointmentEndDate: ''
            , location: ''
            , description: ''
        })
    }

    render() {
        const backdropStyle = {
            zIndex: 'auto',
            backgroundColor: '#000',
            opacity: 0.3
        }

        const customStyle = {
            option: (base, state) => ({
                borderBottom: '1px dotted gray',
                padding: 8,
                ...base,
                color: state.isFocused ? 'blue' : 'black',
            }),
        }
        const dateAppointment = this.state.appointmentDate
        const { selectedOption } = this.state;

        return (
            <React.Fragment>
                <Modal
                    bsSize="large"
                    aria-labelledby="contained-modal-title-lg"
                    show={this.props.show}
                    onHide={this.props.scheduleAppt}
                    animation={false}
                    backdropStyle={backdropStyle}
                >
                    <Modal.Header >
                        <div className='col-sm-12'>
                            <button className="btn btn-light float-right" style={{ backgroundColor: '#264057' }} onClick={this.props.scheduleAppt}>x</button>
                        </div>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <div className="row">
                                <div className="col-sm-10">
                                    <Select
                                    className="drop_style" 
                                    name="dropdown"
                                    coaches={this.state.coaches}
                                    style={customStyle} 
                                    value={selectedOption} 
                                    onChange={this.handleChange} 
                                    options={this.state.options} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <br />
                                    <ControlLabel>Location:</ControlLabel>
                                    <FormGroup>
                                        <FormControl
                                            name="location"
                                            type="text"
                                            placeholder="location"
                                            value={this.state.location}
                                            onChange={this.onChange}
                                        />
                                    </FormGroup>
                                </div>
                                
                                <div className="col-sm-4">
                                    <br />
                                    <ControlLabel>Select Date:</ControlLabel>
                                    <FormGroup className='input-group'>
                                        <span className='input-group-addon'>
                                            <i className='zmdi zmdi-calendar'></i>
                                        </span>
                                        <Flatpickr
                                        placeholder="Please Select.." 
                                        value={dateAppointment} 
                                        options={{ mode: 'single', enableTime: 'true', minuteIncrement: '1', static: 'true' }} 
                                        onChange={dateAppointment => { this.onAppDateChange(dateAppointment) }} />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-10">
                                    <br />
                                    <ControlLabel>Description:</ControlLabel>
                                    <FormGroup>
                                        <FormControl
                                            name="description"
                                            type="text"
                                            placeholder="i.e lets code!"
                                            value={this.state.description}
                                            onChange={this.onChange}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <Button className="btn btn-light" onClick={e => this.onSubmitAppointment(e)}>Schedule Appointment</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* <div className="col-sm-6 col-md-3"
                 onClick={this.showModal}>
                    <div className="quick-stats__item btn btn-light">
                        <div className="quick-stats__info">
                            <h2 >
                                <i className="zmdi zmdi-calendar-note zmdi-hc-fw"></i>
                            Schedule Appointments
                            </h2>
                        </div>
                    </div>
                </div> 
                //Button used in dashboard. 
                */}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userId: state.userProfiles.userId
})

export default withRouter(connect(mapStateToProps)(ScheduleAppointments));