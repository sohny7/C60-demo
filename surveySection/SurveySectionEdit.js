import React, { Component } from 'react'
import * as surveySectionsService from "../../../services/surveySectionsService";
import swal from "sweetalert2";
import {
  FormGroup,
  FormControl,
  HelpBlock
} from "react-bootstrap";

class SurveySectionEdit extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      survey: 0,
      title: "",
      description: "",
      sortOrder: 0,  
    }

    this.onChange = this.onChange.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onCreateOrUpdate = this.onCreateOrUpdate.bind(this);
  }

  onChange(event) { this.setState({ [event.target.name]: event.target.value}) }

  componentDidMount() {
    const surveyId = this.props.match.params.id;
    if (surveyId) {
      surveySectionsService.readById(surveyId)
        .then(response => {
          this.setState({
            survey: parseInt(response.item.survey, 10),
            title: response.item.title,
            description: response.item.description,
            sortOrder: parseInt(response.item.sortOrder, 10)
          })
          this.setState({goingToUpdate: true})
          console.log("Editing...", response)
        })
    }
    else (this.onReset())
  }
  
  errorMsgSwal () {
    swal ({
      type: "error",
      title: "Cannot submit form.",
      text: 'Please, make sure all fields are filled out correctly.',
      background: '#0f2940',
      confirmButtonColor: '#7ac7f6'
    })
  }
 
  onCreateOrUpdate() {

    const formData = this.state;
    const surveyId = this.props.match.params.id;

    let promise = {}
    if (surveyId) {
      delete this.state.goingToUpdate;      
      promise = surveySectionsService.update(surveyId, formData)
    }
    else promise = surveySectionsService.create(formData)
    promise
      .then(response => {
          this.props.history.push("/data-management/survey-section/list")
          this.onReset()
      })
      .catch (console.error)
  }

  validateSurvey() {
    const max = 1000000
    const valid = (`${"is-valid"}`);
    const invalid = (`${"is-invalid"}`);
    const survey = this.state.survey;
    if(survey === 0) return null;
    if (survey > 0 && survey < max) return valid
    else return invalid;
  }

  validateTitle() {
    const valid = (`${"is-valid"}`);
    const invalid = (`${"is-invalid"}`);
    const title = this.state.title;

    if(title === "") return null;
    if (title.length > 10 && title.length < 250) return valid 
    else return invalid;
  }

  validateDesc() {
    const valid = (`${"is-valid"}`);
    const invalid = (`${"is-invalid"}`);
    const description = this.state.description;

    if(description === "") return null;
    if (description.length > 10 && description.length < 2000) return valid 
    else return invalid;
  }

  
  validateSort() {
    const max = 1000000
    const valid = "is-valid";
    const invalid = "is-invalid";
    const sort = this.state.sortOrder;
    if (sort === 0) return null;
    if (sort > 0 && sort < max) return valid
    else return invalid;
  }

  onReset() {
    this.setState({
      survey: 0,
      title: "",
      description: "",
      sortOrder: 0
    })
  }
    showHelp (Fn){
      const invalid = "is-invalid";
      if (Fn === this.validateSurvey() && Fn === invalid)
        return <HelpBlock><sub>Must be numbers only. Max 6 digits.</sub></HelpBlock>
      else if (Fn === this.validateTitle() && Fn === invalid)
        return <HelpBlock><sub>Must be at least 10 characters long. Max 250 characters.</sub></HelpBlock>
      else if (Fn === this.validateDesc() && Fn === invalid)
        return <HelpBlock><sub>Must be at least 10 characters long. Max 2000 characters.</sub></HelpBlock>
      else if (Fn === this.validateSort() && Fn === invalid)
        return <HelpBlock><sub>Must be numbers only. Max 6 digits.</sub></HelpBlock>
  }
    render() {
      let button = null;
      this.state.goingToUpdate
      ? button = <button className="btn btn-dark" onClick={this.onCreateOrUpdate}>Confirm Changes</button>
      : button = <button className="btn btn-dark" onClick={this.onCreateOrUpdate }>Submit</button>

      let surveyHelpBlock = this.showHelp(this.validateSurvey());
      let titleHelpBlock = this.showHelp(this.validateTitle());      
      let descHelpBlock = this.showHelp(this.validateDesc());
      let sortHelpBlock = this.showHelp(this.validateSort());

      
    return (
        <React.Fragment>
        <header className="content__title">
          <h1>Survey Section Edit/List</h1>

          
        </header>

        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Survey Section Form</h4>
            <h6 className="card-subtitle">Tester Form Layout/Appearance</h6>
            {this.errorMsgSwal}
            <FormGroup>
              <h5 className="card-subtitle">Survey: </h5>
              <FormControl className={`${this.validateSurvey()}`} type="text" name="survey" placeholder="Enter an id for the survey..." value={this.state.survey} onChange={this.onChange} />
              <div>{surveyHelpBlock}</div>
            </FormGroup>
            <FormGroup>
            <br />
            <br />
            <h5 className="card-subtitle">Survey Title: </h5>
              <FormControl className={`${this.validateTitle()}`} type="text" name="title" placeholder="Enter survey title..." value={this.state.title} onChange={this.onChange} />
              <div>{titleHelpBlock}</div>
            </FormGroup>
            <FormGroup>
            <br />
            <br />
            <h5 className="card-subtitle">Survey Description: </h5>
              <FormControl className={`${this.validateDesc()}`} type="text" name="description" placeholder="Enter a description for the survey..." value={this.state.description} onChange={this.onChange} />
              <div>{descHelpBlock}</div>
            </FormGroup>
            <FormGroup>
            <br />
            <br />
            <h5 className="card-subtitle">Survey Order: </h5>
              <FormControl className={`${this.validateSort()}`} type="text" name="sortOrder" placeholder="Enter the sort number of the survey..." value={this.state.sortOrder} onChange={this.onChange} />
              <div>{sortHelpBlock}</div>
            </FormGroup>
            <div>{button}</div>
            <input className="btn btn-dark" type="button" value="Clear" style= {{float: "right"}} onClick={this.onReset} />
            <br />
          </div>
        </div>
      </React.Fragment>
    )
}
}

export default SurveySectionEdit;