import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Feedback, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import * as interactionTypeService from "../../../services/interactionTypeService";
import * as appointmentsService from '../../../services/appointmentsService';
import * as reviewsService from '../../../services/reviewsService.js';
import swal from "sweetalert2";
import LoadingSpinner from '../../layout/LoadingSpinner'
import './ReviewForm.css'

const backdropStyle = {
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.3
};
class ReviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reviewerId: '',
      dateOfInteraction: '',
      isVisibleByMentor: false,
      interactionTypeId: "",
      interactionTypeList: [],
      starRating: 0,
      comments: '',
      appointments: [
        { appointmentId: '', appointmentDate: null, appointmentLocation: '' }
      ],
      showModal: false,
      loading: false,
    }

    this.onItem = this.onItem.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.onSubmitReview = this.onSubmitReview.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.showModalContent = this.showModalContent.bind(this);
  }

  componentDidMount() {
    const coachOrMentorId = this.props.coachOrMentorId
    const modalOpen = this.props.show
    if(coachOrMentorId && modalOpen)
    {
      interactionTypeService.getAll()
        .then(data => {
          this.setState({
            interactionTypeList: data.items
          })
        }) 
        this.setState({reviewerId: coachOrMentorId})
        this.getUserPastAppointments(coachOrMentorId)
    }
  }

  onItem(id, e) {
    this.setState({ interactionTypeId: id });
    return true
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  changeRating(newRating) {
    this.setState({ starRating: newRating })
  }

  getUserPastAppointments() {
    let userId = this.props.currentUser.userId
    let coachOrMentorId = this.props.coachOrMentorId;
    appointmentsService.getPastAppointmentsByUserId(userId)
      .then(response => {
        this.showLoadingSpinner()
        let apts = response.items.filter(item => {
          return item.guestId == coachOrMentorId && item.id == this.props.appointmentId;
        })
        let pastAppointments = [];
        apts.map(item => {
          this.setState({dateOfInteraction: item.appointmentDate})
          pastAppointments.push({ 
            appointmentId: item.id, 
            appointmentDate: item.appointmentDate, 
            appointmentLocation: item.location
           })
        })
        this.setState({ appointments: pastAppointments})
      })
      this.showLoadingSpinner()
  }

  onSubmitReview() {
    const formData = {
      reviewerId: this.state.reviewerId
      , comments: this.state.comments
      , starRating: this.state.starRating
      , interactionTypeId: this.state.interactionTypeId
      , isVisibleByMentor: this.state.isVisibleByMentor
      , dateOfInteraction: this.state.dateOfInteraction
    }
    reviewsService.create(formData)
      .then( () => {
        this.successReviewEntry()
        this.resetForm()
        this.props.close()
     })
      .catch( () => {this.incompleteFormAlert()}) 
  }

  resetForm(){
    this.setState({
       comments: ''
      , starRating: 0
      , interactionTypeId: ''
      , isVisibleByMentor: false
    })
  }

  incompleteFormAlert(){
    swal({
      type: 'error',
      title: 'Oops!',
      text: this.validateSection(),
      background: '#0f2940',
      confirmButtonColor: '#7ac7f6'
    })
  }

  successReviewEntry() {
    swal({
      type: 'success',
      title: 'Great!',
      text: 'Your review has been submitted.',
      background: '#0f2940',
      confirmButtonColor: '#7ac7f6'
    })
    .then( () => {
      this.props.onHide()
    })
  }
  
  showModalContent(){
    const show = this.state.appointments.length === 0
      ? 'none'
      : 'block'
    return show 
  }

  showLoadingSpinner(){
    this.setState({ loading: !this.state.loading })
  }

  validateSection() {
    const emptyInteraction = this.state.interactionTypeId == ''
    const emptyStars = this.state.starRating == 0
    const emptyComments = this.state.comments == ''
    let error = ''

    if (emptyInteraction){
      return error = 'Pick an Interaction'
    }
    if(emptyStars){
      return error = 'Choose a Rating'
    }
    if(emptyComments){
      return error = 'Comments Cannot Be Empty'
    }

  }

  render() {  

    const interactionTypeList = this.state.interactionTypeList ?
      this.state.interactionTypeList.map(item => {
        return (
          <label  className="review_radiolist custom-control custom-radio" key={item.id}>
            <span>{item.typeName}</span>
              <input type="radio" className="custom-control-input" id='interactionTypeId' name='interactionTypeId'
                onChange={e => this.onItem(item.id, e)} checked={this.state.interactionTypeId === item.id} value={item.id}></input>
              <span className="custom-control-indicator"></span>
          </label>
        );
      })
      : "is loading";

    const pastAppointmentsList = this.state.appointments.length === 0 ? <strong>{'No Past Appointments Available'}</strong>
      : this.state.appointments.map(item => {
        return (
          <label className='custom-control custom-radio' key={item.appointmentId}>
            { `${moment(item.appointmentDate).format('MMMM Do YYYY [at] h a')} in ${item.appointmentLocation}` }
            <input type='radio' className='custom-control-input' defaultChecked/>
            <span className="custom-control-indicator "></span>
          </label>
        )
      })

    return (
      <React.Fragment>
        <LoadingSpinner loading={this.state.loading}/>
        <Modal
          show={this.props.show}
          bsSize='lg'
          backdropStyle={backdropStyle}
          animation={false}
          onHide={this.props.close}>

          <Modal.Header >
            <div className='col-sm-12'>
              <button className="btn btn-light float-right" style={{ backgroundColor: '#264057' }} onClick={this.props.close}>x</button>
            </div>
          </Modal.Header>

          <Modal.Body>
            <div className='container col-sm-12'>

              <div className='review_row row'>
                <div className=' col-sm-4'>
                <div className='review_title_tag'><em>You Are Viewing:</em></div>
                  <h1>{this.props.coachOrMentorName}</h1>
                  <hr></hr>
                </div>
              </div>

              <div className="review_row row">
                <div className="col-sm-4">
                  <h5>Date of Interaction</h5>
                </div>
                <div className="review_col col-sm-6">
                  <ul className='list'>
                    {pastAppointmentsList}
                  </ul>
                </div>
              </div>

              <div className='modal-body-content'  style={{display:this.showModalContent()}}>

              <div className='review_row row'>
              <div className="col-sm-4">
                <h5>Visible to mentor?</h5>
                </div>
                <div className='review_col col-sm-6'>
                <label className='custom-control custom-checkbox'>
                  <input type='checkbox' className='custom-control-input' name='isVisibleByMentor' checked={this.state.isVisibleByMentor} onChange={this.handleChange} />
                  Yes, Make Review Visible
                <span className='custom-control-indicator'></span>
                </label>
              </div>
              </div>

                <div className="review_row_radiolist row">
                  <div className="col-sm-4">
                    <h5>Interaction Type</h5>
                  </div>
                  <div className='col-sm-6'>
                    <ul className="review_radiolist_ul">
                      {interactionTypeList}
                    </ul>
                    <div>
                    </div>
                  </div>
                </div>

                <div className='review_row row'>
                  <div className="col-sm-4">
                    <h5>How many stars?</h5>
                  </div>
                  <div className='review_col col-sm-6'>
                  <StarRatings starDimension={"35px"} rating={this.state.starRating} starRatedColor="#FFD700" starHoverColor="#FFD700" changeRating={this.changeRating} numberOfStars={5} name="rating"></StarRatings>
                </div>
              </div>

              <div className="review_row row">
                <div className="col-sm-12">
                  <FormGroup>
                    <h5>Comments</h5>
                    <FormControl componentClass="textarea" id='comments' name='comments' value={this.state.comments} onChange={this.handleChange} />
                    <FormControl.Feedback />
                  </FormGroup>
                </div>
              </div>

                <div className='row'>
                <div className='col-sm-12'>
                  <button className='btn btn-light float-left' type='button' onClick={this.onSubmitReview}>Submit</button>
                  <button className='btn btn-light float-right' type='button' onClick={this.resetForm}>Clear</button>
                </div>
                </div>

              </div>

            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  currentUser: state.userProfiles
})
export default connect(mapStateToProps)(ReviewModal);

