import React from "react";
import * as entrepreneurialInfoSkillService from "../../../services/entrepreneurialInfoSkillService";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from "react-bootstrap";
import * as validation from "../../../utils/validation";
class EntrepreneurialInfoSkillsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      editMode: false,
      skill: {
        value: "",
        input: false
      }
    };
    this.onChange = this.onChange.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.editButton = this.editButton.bind(this);
  }
  onChange(e) {
    const value = { value: e.target.value, input: true };
    this.setState({ [e.target.name]: value });
    console.log(e.target.name);
    console.log(e.target.value);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      entrepreneurialInfoSkillService
        .readById(this.props.match.params.id)
        .then(data => {
          let editData = data.item;
          this.setState({
            id: editData.id,
            skill: this.makeObj(editData.skill),
            editMode: true
          });
          console.log(data);
        })
        .catch(console.error);
    } else {
      return null;
    }
  }

  makeObj(val) {
    const obj = {
      input: true,
      value: val
    };
    return obj;
  }

  editButton() {
    const data = {
      id: this.state.id,
      skill: this.state.skill.value
    };
    if (this.validation()) {
      let promise = {};
      if (this.state.editMode) {
        promise = entrepreneurialInfoSkillService.update(data);
      }
      promise
        .then(() => {
          this.props.history.push("../list");
        })
        .catch(console.error);
    } else {
      console.log("Error");
    }
  }

  submitButton() {
    const data = {
      skill: this.state.skill.value
    };
    if (this.validation()) {
      let promise = {};
      if (this.state.editMode) {
        data.id = this.state.id;
        promise = entrepreneurialInfoSkillService.update(data);
      } else {
        promise = entrepreneurialInfoSkillService.create(data);
      }
      promise
        .then(() => {
          this.props.history.push("./list");
        })
        .catch(console.error);
    } else {
      console.log("Error");
    }
  }

  validation() {
    return validation.entrepreneurialInfoSkills(this.state.skill.value);
  }

  render() {
    const button = this.state.editMode ? (
      <button
        type="button"
        className="btn btn-dark btn-block"
        onClick={this.editButton}
      >
        Edit
      </button>
    ) : (
      <button
        type="button"
        className="btn  btn-dark btn-block"
        onClick={this.submitButton}
      >
        Submit
      </button>
    );

    return (
      <React.Fragment>
        <header className="content__title" style={{ paddingLeft: "40px" }}>
          <h4>Entrepreneurial Info Skills Form</h4>
        </header>
        <div className="card">
          <div className="mario" role="tablist">
            <div className="card-body">
              <div className="container row">
                <div className=" col-md-6">
                  <div className="form-group">
                    <FormGroup controlId="formBasicText">
                      <ControlLabel>Add Skills</ControlLabel>
                      <FormControl
                        name="skill"
                        type="text"
                        onChange={this.onChange}
                        value={this.state.skill.value}
                        className={
                          this.state.skill.input &&
                          (validation.entrepreneurialInfoSkills(
                            this.state.skill.value
                          )
                            ? "is-valid"
                            : "is-invalid")
                        }
                      />
                      <i className="form-group__bar" />
                      <FormControl.Feedback />
                      {this.state.skill.input &&
                      !validation.entrepreneurialInfoSkills(
                        this.state.skill.value
                      ) ? (
                        <HelpBlock style={{ position: "absolute" }}>
                          Please enter your skill
                        </HelpBlock>
                      ) : null}
                    </FormGroup>
                  </div>
                  {button}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default EntrepreneurialInfoSkillsForm;
