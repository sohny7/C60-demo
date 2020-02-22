import React from "react";
import * as eventbriteSearchCriteriaService from "../../../services/eventbriteSearchCriteriaService";
import Select from "react-select";
import * as validation from "../../../utils/validation";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
} from "react-bootstrap";
const customStyle = {
  control: styles => ({ ...styles, backgroundColor: "#eff3f9" })
};
class EventbriteSearchCriteriaForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Id: "",
      criteriaId: {
        value: "",
        input: false
      },
      criteriaText: {
        value: "",
        input: false
      },
      typeId: 1,
      editMode: false,
      options: [{ value: "default", label: "default" }],
      selectedOption: ""
    };
    this.onChange = this.onChange.bind(this);
    this.submitButton = this.submitButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getTypes();
    if (this.props.match.params.id) {
      eventbriteSearchCriteriaService
        .ReadEventBriteSearchCriteriaById(this.props.match.params.id)
        .then(data => {
          let values = data.item;
          this.setState({
            id: values.id,
            editMode: true,
            criteriaId: this.makeObj(values.criteriaId),
            criteriaText: this.makeObj(values.criteriaText),
            typeId: values.typeId
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

  handleChange(selectedOption) {
    this.setState({
      typeId: selectedOption.value
    });
  }

  onChange(event) {
    console.log(event.target.name);
    console.log(event.target.value);
    const value = { value: event.target.value, input: true };
    this.setState({
      [event.target.name]: value
    });
  }

  getTypes = () => {
    eventbriteSearchCriteriaService.ReadAllTypes().then(response => {
      const types = [];
      const temp = response.items;
      temp.map(item => {
        types.push({ value: item.id, label: `${item.type}` });
      });
      this.setState({ options: types });
    });
  };

  submitButton() {
    const data = {
      criteriaId: this.state.criteriaId.value,
      criteriaText: this.state.criteriaText.value,
      typeId: this.state.typeId
    };
    if (this.checkValidation()) {
      let promise = {};
      if (this.state.editMode) {
        data.id = this.state.id;
        promise = eventbriteSearchCriteriaService.updateById(data);
      } else {
        promise = eventbriteSearchCriteriaService.create(data);
      }
      promise
        .then(() => {
          this.props.history.push(
            "/data-management/eventbriteSearchCriteria/list"
          );
        })
        .catch(console.error);
    } else {
      console.log("Invalid Information");
    }
  }

  checkValidation() {
    return (
      validation.emptyStringCheck(this.state.criteriaText.value) &&
      validation.integer(this.state.criteriaId.value)
    );
  }

  render() {
    const typeId = this.state.typeId;
    let index = 0;
    if (typeId) {
      index = this.state.options.findIndex(item => {
        return item.value === typeId;
      });
    }
    const selectedOption = this.state.options[index];
    const {
      isClearable,
      isSearchable,
      isDisabled,
      isLoading,
      isRtl
    } = this.state;
    const button = this.state.editMode ? (
      <button
        type="button"
        className="btn btn-dark btn-block"
        onClick={this.submitButton}
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
          <h4>Eventbrite Search Criteria Form</h4>
        </header>
        <div className="card">
          <div className="mario" role="tablist">
            <div className="card-body">
              <div className="container row">
                <div className=" col-md-6">
                  <FormGroup controlId="formBasicText">
                    <ControlLabel>Criteria Id</ControlLabel>
                    <FormControl
                      className={
                        this.state.criteriaId.input &&
                        (validation.integer(this.state.criteriaId.value)
                          ? "is-valid"
                          : "is-invalid")
                      }
                      type="text"
                      name="criteriaId"
                      value={this.state.criteriaId.value}
                      onChange={this.onChange}
                    />
                    <i className="form-group__bar" />
                    <FormControl.Feedback />
                    {this.state.criteriaId.input &&
                    !validation.integer(this.state.criteriaId.value) ? (
                      <HelpBlock style={{ position: "absolute" }}>
                        Criteria Id is required
                      </HelpBlock>
                    ) : null}
                  </FormGroup>
                  <FormGroup controlId="formBasicText">
                    <ControlLabel>Criteria Text</ControlLabel>
                    <FormControl
                      className={
                        this.state.criteriaText.input &&
                        (validation.emptyStringCheck(
                          this.state.criteriaText.value
                        )
                          ? "is-valid"
                          : "is-invalid")
                      }
                      type="text"
                      name="criteriaText"
                      value={this.state.criteriaText.value}
                      onChange={this.onChange}
                    />
                    <i className="form-group__bar" />
                    <FormControl.Feedback />
                    {this.state.criteriaText.input &&
                    !validation.emptyStringCheck(
                      this.state.criteriaText.value
                    ) ? (
                      <HelpBlock style={{ position: "absolute" }}>
                        Criteria Text is required
                      </HelpBlock>
                    ) : null}
                  </FormGroup>
                  <div className="form-group ">
                    <h3 className="card-body__title"> Type Id </h3>
                    <div className="col-md-4">
                      <Select
                        className="drop_style"
                        classNamePrefix="select"
                        isDisabled={isDisabled}
                        isLoading={isLoading}
                        isClearable={isClearable}
                        isRtl={isRtl}
                        isSearchable={isSearchable}
                        styles={customStyle}
                        id="typeId"
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={this.state.options}
                        name="typeId"
                      />
                    </div>
                    <i className="form-group__bar" />
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
export default EventbriteSearchCriteriaForm;
