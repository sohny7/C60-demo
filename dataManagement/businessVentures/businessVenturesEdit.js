import React, { Component } from 'react';
import * as businessVentureService from '../../../services/businessVentureService';
import { FormGroup, HelpBlock, ControlLabel, FormControl, Button } from 'react-bootstrap';
import swal from 'sweetalert2';
class BusinessVenturesEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: {
                value: ''
                , touched: false
            },
            annualBusinessIncome: {
                value: ''
                , touched: false
            },
            yearsInBusiness: {
                value: ''
                , touched: false
            },
            industry: {
                value: ''
                , touched: false
            },
            editMode: false
            , isMentored: false

        }

        this.swalSubmit = this.swalSubmit.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
        this.onClear = this.onClear.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onHandleCheckbox = this.onHandleCheckbox.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    onChange(e) {
        const obj = {
            touched: true
            , value: e.target.value
        }
        this.setState({
            [e.target.name]: obj
        })
    }

    onHandleCheckbox(e) {
        const target = e.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        })
    }
    
    swalSubmit() {
        const promise = swal({
            title: "Submitted",
            text: "Succesfully submitted",
            type: 'success',
            confirmButtonColor: '#7ac7f6',
            confirmButtonText: 'Confirm',
            background: '#0f2940'
        })
        return promise;
    } 

    onSubmit() {
        const id = this.props.userId;
        const businessVentureState = this.state;
        const dataToSubmitOrEdit = {
            name: this.state.name.value
            , isMentored: this.state.isMentored
            , annualBusinessIncome: this.state.annualBusinessIncome.value
            , yearsInBusiness: this.state.yearsInBusiness.value
            , industry: this.state.industry.value
        }
            if (this.state.editMode) {
                const promise = businessVentureService.update(id, dataToSubmitOrEdit)
                this.swalSubmit()
                return promise

            } else {
                if (this.props.onDeleteBusinessVenture) {
                    this.props.onDeleteBusinessVenture(businessVentureState)
                }
                const promise = businessVentureService.create(dataToSubmitOrEdit)
                this.swalSubmit()
                return promise
            } 
        }

    componentDidMount() {
        const dataToEdit = this.props.userId;
        if (dataToEdit) {
            const promise = businessVentureService.getById(dataToEdit)
            promise.then((response) => {
                this.setState({
                    name: {
                        value: response.item.name
                        , touched: false
                    },
                    annualBusinessIncome: {
                        value: response.item.annualBusinessIncome
                        , touched: false
                    },
                    yearsInBusiness: {
                        value: response.item.yearsInBusiness
                        , touched: false
                    },
                    industry: {
                        value: response.item.industry
                        , touched: false
                    },
                    editMode: true
                    , 
                    isMentored: response.item.isMentored
                })
            })
                .catch((err) => {
                    console.error("Error", err)
                })
        }
    }

    onClear = () => {
        this.setState({
            name: {
                value: ''
                , touched: false
            },
            annualBusinessIncome: {
                value: ''
                , touched: false
            },
            yearsInBusiness: {
                value: ''
                , touched: false
            },
            industry: {
                value: ''
                , touched: false
            },
            isMentored: false
        })
    }

    getIdValidationState(inputCheck) {
        if (inputCheck >= 1) {
            return true;
        } else {
            return false;
        }
    }


    getYearsInBusinessValidationState(yearsInput) {
        if (yearsInput >= 0 && yearsInput <= 200) {
            return true;
        } else {
            return false;
        }
    }


    getStringValidationState(stringCheck) {
        if (stringCheck.length >= 4 && stringCheck.length <= 100) {
            return true;
        } else {
            return false;
        }
    }

    onDelete() {
        const businessVentureId = this.props.userId;
        const promise = businessVentureService.del(businessVentureId)
        promise.then(response => {
            this.props.onDeleteBusinessVenture(businessVentureId)
        })
            .catch(console.error)
    }

    render() {
        const button = this.state.editMode
            ? <button className="btn btn-light" type="button" value="Submit" onClick={this.onSubmit}>Update</button>
            : <button className="btn btn-light" type="button" value="Submit" onClick={this.onSubmit}>Submit</button>

        return (
            <React.Fragment>
                <h4 className="card-title">Business Ventures</h4>

                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup
                                controlId="formInput"
                            >
                                {/* <ControlLabel>User Id</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    className={this.state.userId.touched && (this.getIdValidationState(this.state.userId.value) ? "is-valid" : "is-invalid")}
                                                    placeholder="i.e 1234"
                                                    onChange={this.onChange}
                                                    value={this.state.userId.value}
                                                    name='userId' />
                                                <i className="form-group_bar"></i>
                                                {this.state.userId.touched && (this.getIdValidationState(this.state.userId.value) ? null : <HelpBlock>Number must be greater then 0</HelpBlock>)}
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-6">
                                            <FormGroup
                                                controlId="formInput"
                                            >
                                                <ControlLabel>Status Id</ControlLabel>
                                                <FormControl
                                                    type="text"
                                                    className={this.state.statusId.touched && (this.getIdValidationState(this.state.statusId.value) ? "is-valid" : "is-invalid")}
                                                    placeholder="i.e 1234"
                                                    onChange={this.onChange}
                                                    value={this.state.statusId.value}
                                                    name='statusId' />
                                                <i className="form-group_bar"></i>
                                                <FormControl.Feedback />
                                                {this.state.statusId.touched && (this.getIdValidationState(this.state.statusId.value) ? null : <HelpBlock>Number must be greater then 0</HelpBlock>)}
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-6">
                                            <FormGroup
                                                controlId="formInput"
                                            > */}
                                <ControlLabel>Business Name</ControlLabel>
                                <FormControl
                                    type="text"
                                    className={this.state.name.touched && (this.getStringValidationState(this.state.name.value) ? "is-valid" : "is-invalid")}
                                    placeholder="i.e Technology Today"
                                    onChange={this.onChange}
                                    value={this.state.name.value}
                                    name='name' />
                                <i className="form-group_bar"></i>
                                <FormControl.Feedback />
                                {this.state.name.touched && (this.getStringValidationState(this.state.name.value) ? null : <HelpBlock>Must be between 4-100 characters</HelpBlock>)}
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup
                                controlId="formInput"
                            >
                                <ControlLabel>Annual Business Income</ControlLabel>
                                <FormControl
                                    type="text"
                                    className={this.state.annualBusinessIncome.touched && (this.getIdValidationState(this.state.annualBusinessIncome.value) ? "is-valid" : "is-invalid")}
                                    placeholder="i.e 120,000"
                                    onChange={this.onChange}
                                    value={this.state.annualBusinessIncome.value}
                                    name='annualBusinessIncome' />
                                <i className="form-group_bar"></i>
                                <FormControl.Feedback />
                                {this.state.annualBusinessIncome.touched && (this.getIdValidationState(this.state.annualBusinessIncome.value) ? null : <HelpBlock>Number must be greater then 0 </HelpBlock>)}
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup
                                controlId="formInput"
                            >
                                <ControlLabel>Years In Business</ControlLabel>
                                <FormControl
                                    type="text"
                                    className={this.state.yearsInBusiness.touched && (this.getYearsInBusinessValidationState(this.state.yearsInBusiness.value) ? "is-valid" : "is-invalid")}
                                    placeholder="i.e 3"
                                    onChange={this.onChange}
                                    value={this.state.yearsInBusiness.value}
                                    name='yearsInBusiness' />
                                <i className="form-group_bar"></i>
                                <FormControl.Feedback />
                                {this.state.yearsInBusiness.touched && (this.getYearsInBusinessValidationState(this.state.yearsInBusiness.value) ? null : <HelpBlock>Must be between 0-200 years</HelpBlock>)}
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup
                                controlId="formInput"
                            >
                                <ControlLabel>Industry</ControlLabel>
                                <FormControl
                                    type="text"
                                    className={this.state.industry.touched && (this.getStringValidationState(this.state.industry.value) ? "is-valid" : "is-invalid")}
                                    placeholder="i.e Tech Industry"
                                    onChange={this.onChange}
                                    value={this.state.industry.value}
                                    name='industry' />
                                <i className="form-group_bar"></i>
                                <FormControl.Feedback />
                                {this.state.industry.touched && (this.getStringValidationState(this.state.industry.value) ? null : <HelpBlock>Must be between 4-100 characters</HelpBlock>)}
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <FormGroup>
                                <ControlLabel className="custom-control custom-checkbox">
                                    <FormControl
                                        type="checkbox"
                                        className="custom-control-input"
                                        onChange={this.onHandleCheckbox}
                                        checked={this.state.isMentored}
                                        name='isMentored' />
                                    <span className="custom-control-indicator"></span>
                                    <span className="custom-control-description">Check box if you're mentored.</span>
                                </ControlLabel>
                            </FormGroup>
                        </div>
                    </div>
                    {button}
                    <br /><br />
                    <Button className="btn btn-light"
                        type="button" value="Clear"
                        onClick={this.onClear}>Clear</Button>

                    <Button className="btn btn-light btn--icon col-sm-6"
                        onClick={e => this.onDelete(e)}
                        style={{ float: "right" }}>
                        <i className="zmdi zmdi-delete"></i>
                    </Button>
                </form>
            </React.Fragment>
        )
    }
}

export default BusinessVenturesEdit;