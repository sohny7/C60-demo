import React from "react";
import * as contractService from "../../../services/contracts/contractsService";
import * as validation from "../../../utils/contractsValidation"
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import * as moment from 'moment';
import FileUpload from '../../FileUploadModal'

class ContractsForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            id: 0,
            name: "",
            budget: "",
            description: "",
            contractTypeId: 12,
            insuranceTypeId: 2,
            projectStageId: 13,
            projectStartDate: "",
            projectDueDate: "",
            bidMethodTypeId: 9,
            contactName: "",
            phone: "",
            onSiteRequired: false,
            industry: "",
            addressId: 46,
            businessTypeId: 20,
            designationsTypeId: 12,
            securityClearanceId: 2,
            isOnGoing: false,
            laborRequirements: "",
            hasLicenses: false,
            edit: false

        };

        this.contractInput = this.contractInput.bind(this);
        this.btnSubmit = this.btnSubmit.bind(this);

    }

    componentDidMount() {

        if (this.props.match.params.id) {
            contractService.readById(this.props.match.params.id)
                .then(responseData => {
                    responseData.items.forEach(item => {
                        this.setState({
                            id: item.id,
                            name: item.name,
                            budget: item.budget,
                            description: item.description,
                            contactName: item.contactName,
                            phone: item.phone,
                            industry: item.industry,
                            projectStartDate: moment(item.projectStartDate).format("M/DD/YYYY"),
                            projectDueDate: moment(item.projectDueDate).format("M/DD/YYYY"),
                            laborRequirements: item.laborRequirements,
                            hasLicenses: item.hasLicenses ? "true" : "false",
                            onSiteRequired: item.onSiteRequired ? "true" : "false",
                            isOnGoing: item.isOngoing ? "true" : "false",
                            edit: true

                        })

                    })

                })
                .catch((error) => {
                    alert(error);

                });
            }
    }

    contractInput(event) {

        this.setState({
            [event.target.name]: event.target.value
        })

    }


    btnSubmit() {
        const data = this.state
        if (this.formValidation()) {
            let promise = {}
            if (this.state.edit) {
                promise = contractService.updateContracts(data, data.id)
                console.log("update")
            }
            else {
                promise = contractService.create(data)
                console.log("create")
            }
            promise
                .then(() => this.props.history.push("/data-management/Contracts/Contracts"), this.formReset())
                .catch(console.error)
        } else {
            console.log("The form is incomplete.")

        }

    }

    validationCheck(input) {
        if (!input === "" || !input === false) {
            return true;
        }
        else {
            return false;
        }

    }

    formReset() {
        this.setState({
            id: "",
            name: "",
            budget: "",
            description: "",
            contractTypeId: 12,
            projectStageId: 13,
            projectStartDate: "",
            projectDueDate: "",
            bidMethodTypeId: 9,
            contactName: "",
            phone: "",
            onSiteRequired: "",
            industry: "",
            addressId: 46,
            businessTypeId: 20,
            designationsTypeId: 12,
            securityClearanceIdl: 2,
            isOngoing: "",
            laborRequirements: "",
            hasLicenses: "",
        })

    }

    formValidation() {
        return validation.name(this.state.name) &&
            validation.description(this.state.description) &&
            validation.budget(this.state.budget) &&
            validation.phone(this.state.phone) &&
            validation.industry(this.state.industry) &&
            validation.laborRequirements(this.state.laborRequirements) &&
            validation.projectStartDate(this.state.projectStartDate) &&
            validation.projectStartDate(this.state.projectStartDate) &&
            validation.checkBox(this.state.onSiteRequired) &&
            validation.checkBox(this.state.hasLicenses) &&
            validation.checkBox(this.state.isOnGoing)
    }


    render() {
        return (
            <React.Fragment>
                <header className="content__title" style={{ paddingLeft: 20 }}>
                    <h4 className="display-4">Contracts</h4>
                </header>

                <div className="card">

                    <div className="card-header" role="tab" id="headingOne" style={{ paddingLeft: '25px' }}>

                        <h4> New contract</h4>

                    </div>

                    <div className="card-body">

                        <div className="container row">
                            <div className=" col-md-6">

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Name</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.name) && (validation.name(this.state.name) ? "is-valid" : "is-invalid")}
                                        value={this.state.name}
                                        onChange={this.contractInput}
                                        name="name"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.name) && (validation.name(this.state.name) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Name is not valid.</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Description</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.description) && (validation.description(this.state.description) ? "is-valid" : "is-invalid")}
                                        value={this.state.description}
                                        onChange={this.contractInput}
                                        name="description"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.description) && (validation.description(this.state.description) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Invalid character in description field</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Budget</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.budget) && (validation.budget(this.state.budget) ? "is-valid" : "is-invalid")}
                                        value={this.state.budget}
                                        onChange={this.contractInput}
                                        placeholder='$'
                                        name="budget"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.budget) && (validation.budget(this.state.budget) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Please enter budget in dollar value.</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Phone</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.phone) && (validation.phone(this.state.phone) ? "is-valid" : "is-invalid")}
                                        value={this.state.phone}
                                        onChange={this.contractInput}
                                        name="phone"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.phone) && (validation.phone(this.state.phone) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Phone number is not valid.</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Industry</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.industry) && (validation.industry(this.state.industry) ? "is-valid" : "is-invalid")}
                                        value={this.state.industry}
                                        onChange={this.contractInput}
                                        name="industry"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.industry) && (validation.industry(this.state.industry) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Invalid character in text.</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Labor Requirements:</h3></ControlLabel>
                                    <FormControl
                                        componentClass="textarea"
                                        className={this.validationCheck(this.state.laborRequirements) && (validation.laborRequirements(this.state.laborRequirements) ? "is-valid" : "is-invalid")}
                                        value={this.state.laborRequirements}
                                        onChange={this.contractInput}
                                        name="laborRequirements"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.laborRequirements) && (validation.laborRequirements(this.state.laborRequirements) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Invalid character in text.</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Contact Name</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.contactName) && (validation.contactName(this.contactName) ? "is-valid" : "is-invalid")}
                                        value={this.state.contactName}
                                        onChange={this.contractInput}
                                        name="contactName"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.contactName) && (validation.name(this.state.contactName) ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Contact name is invalid.</HelpBlock>)}
                                </FormGroup>


                                {/* page break                 */}

                            </div>
                            <div className="col-md-6" style={{ paddingLeft: "10px" }}>
                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Project Start Date:</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.projectStartDate) && (validation.projectStartDate(this.state.projectStartDate) ? "is-valid" : "is-invalid")}
                                        value={this.state.projectStartDate}
                                        onChange={this.contractInput}
                                        name="projectStartDate"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.projectStartDate) && (validation.projectStartDate(this.state.projectStartDate) ? null : <HelpBlock style={{ position: "absolute"}}>Date format: MM/DD/YYYY</HelpBlock>)}
                                </FormGroup>

                                <FormGroup controlId="formBasicText">
                                    <ControlLabel><h3 className="card-body__title">Project Due Date:</h3></ControlLabel>
                                    <FormControl
                                        type="text"
                                        className={this.validationCheck(this.state.projectDueDate) && (validation.projectDueDate(this.state.projectDueDate) ? "is-valid" : "is-invalid")}
                                        value={this.state.projectDueDate}
                                        onChange={this.contractInput}
                                        name="projectDueDate"
                                    />
                                    <i className="form-group__bar" />
                                    <FormControl.Feedback />
                                    {this.validationCheck(this.state.projectDueDate) && (validation.projectDueDate(this.state.projectDueDate) ? null : <HelpBlock style={{ position: "absolute" }}>Date format: MM/DD/YYYY</HelpBlock>)}
                                </FormGroup>

                                    <br/>
                                    <ControlLabel><h3 className="card-body__title">On site required?</h3></ControlLabel>
                                    <div className="radioBtn" style={{ marginLeft: "15px" }}>
                                        <label>
                                            <input type="radio" name="onSiteRequired" value="true" onChange={e => this.contractInput(e)} checked={this.state.onSiteRequired === 'true'} /> Yes
                                        </label>
                                        <label>
                                            <input type="radio" name="onSiteRequired" value="false" onChange={e => this.contractInput(e)} checked={this.state.onSiteRequired === 'false'} style={{ marginLeft: "10px" }} /> No
                                        </label>
                                    </div>

                             
                                     <br/>
                                    <ControlLabel><h3 className="card-body__title">Ongoing project</h3></ControlLabel>
                                    <div style={{ marginLeft: "15px" }}>
                                        <label>
                                            <input type="radio" name="isOnGoing" value="true" onChange={e => this.contractInput(e)} checked={this.state.isOnGoing === 'true'} /> Yes
                                        </label>
                                        <label>
                                            <input type="radio" name="isOnGoing" value="false" onChange={e => this.contractInput(e)} checked={this.state.isOnGoing === 'false'} style={{ marginLeft: "10px" }} /> No
                                        </label>
                                    </div>
                             

                                      <br/>
                                    <ControlLabel><h3 className="card-body__title">Has licenses?</h3></ControlLabel>
                                    <div style={{ marginLeft: "15px" }}>
                                        <label>
                                            <input type="radio" name="hasLicenses" value="true" onChange={e => this.contractInput(e)} checked={this.state.hasLicenses === 'true'} /> Yes
                                        </label>
                                        <label>
                                            <input type="radio" name="hasLicenses" value="false" onChange={e => this.contractInput(e)} checked={this.state.hasLicenses === 'false'} style={{ marginLeft: "10px" }} /> No
                                        </label>
                                    </div>
                                   
                                    {/* <FormControl.Feedback />
                                   {validation.checkBox(this.state.hasLicenses) && (this.state.hasLicenses === 'true' || this.state.hasLicenses === 'false' ? null : <HelpBlock style={{ position: "absolute", color: "red" }}>Please select one.</HelpBlock>)}  */}

                                <FileUpload />

                            </div>

                        </div>

                    </div>
                    <br/>
                    <button className="btn btn-light btn-block" style={{ display: this.state.edit ? "none" : "block", marginTop: "30px", paddingBottom: "10px", fontSize: "15px" }} onClick={this.btnSubmit}>SUBMIT</button>
                <button  className="btn btn-light btn-block" style={{ display: this.state.edit ? "block" : "none", marginTop: "10px", paddingBottom: "10px", fontSize: "15px" }} onClick={this.btnSubmit}>UPDATE</button>
                </div>



            </React.Fragment>

        )

    }
}

export default ContractsForm;
