import React from "react";
import * as resourceService from "../../../services/resourceService";
import * as validation from '../../../utils/validation';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import FileUploadModal from '../../../containers/FileUploadModal'; // import File Upload modal
import Select from 'react-select'; 

class ResourcesForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companyName: {
                value: '',
                input: false
            },
            description: {
                value: '',
                input: false
            },
            contactName: {
                value: '',
                input: false
            },
            contactEmail: {
                value: '',
                input: false
            },
            businessTypeId: {
                value: '',
                input: false
            },
            imageUrl: {
                value: '',
                input: false
            },
            siteUrl: {
                value: '',
                input: false
            },
            phone: {
                value: '',
                input: false
            },
            id: '',
            list: [],
            updateProfile: false, 
            options: [
                {value: 'default', label: 'default'}
            ], 
            selectedOption: null
        };

        this.onChange = this.onChange.bind(this)
        this.onClear = this.onClear.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.newCroppedImg = this.newCroppedImg.bind(this)
        this.toList = this.toList.bind(this); 
        this.toForm = this.toForm.bind(this); 
    };

    onChange(event) {
        console.log(event.target.name)
        console.log(event.target.value)
        const value = { value: event.target.value, input: true };
        this.setState({
            [event.target.name]: value
        })
    }

    onClear(event) {
        this.setState(
            {
                companyName: '',
                description: '',
                contactName: '',
                contactEmail: '',
                businessTypeId: '',
                imageUrl: '',
                siteUrl: '',
                phone: ''
            }
        )
    }

    checkValidation() {
        return validation.companyName(this.state.companyName.value) &&
            validation.name(this.state.contactName.value) &&
            validation.description(this.state.description.value) &&
            validation.email(this.state.contactEmail.value) &&
            validation.urlImageCheck(this.state.imageUrl.value) &&
            validation.urlCheck(this.state.siteUrl.value) &&
            validation.phone(this.state.phone.value)
    }

    onSubmit() {
        if (this.state.selectedOption === null) {
            alert("Please select a business category")
        } else {
        const data = {
            companyName: this.state.companyName.value,
            description: this.state.description.value,
            contactName: this.state.contactName.value,
            contactEmail: this.state.contactEmail.value,
            businessTypeId: this.state.businessTypeId.value,
            categoryId: this.state.selectedId.value, 
            imageUrl: this.state.imgCropped ? this.state.imgCropped : this.state.imageUrl.value, 
            siteUrl: this.state.siteUrl.value,
            phone: this.state.phone.value
        }
        if (this.checkValidation()) {
            let promise = {}
            if (this.state.updateProfile) {
                data.id = this.state.id
                promise = resourceService.put(this.props.match.params.id, data)
            } else {
                promise = resourceService.post(data)
            }
            promise
                .then(() => { this.props.history.push('/data-management/resources/list') })
                .catch(console.error)
        } else {
            console.log("Invalid Information")
        }
    }
    }



    componentDidMount() {
        this.onDropdown()

        if (this.props.match.params.id) {
            resourceService.getResourceById(this.props.match.params.id)
                .then(response => {
                    let editData = response.items
                    this.setState(
                        {
                            id: editData.id,
                            companyName: this.makeObj(editData.companyName),
                            description: this.makeObj(editData.description),
                            contactName: this.makeObj(editData.contactName),
                            contactEmail: this.makeObj(editData.contactEmail),
                            businessTypeId: this.makeObj(editData.businessTypeId),
                            selectedOption: this.makeOption(editData.type), 
                            selectedId: this.makeObj(editData.categoryId),
                            imageUrl: this.makeObj(editData.imageUrl),
                            siteUrl: this.makeObj(editData.siteUrl),
                            phone: this.makeObj(editData.phone),
                            updateProfile: true
                        }
                    )
                    console.log(response)
                })
                .catch(console.error);
        }
        else {
            return null
        }
    }

    onDropdown() {
        resourceService.getAllCategories()
            .then(response => {
                const categories = []; 
                const data = response.items; 
                data.map(item => {categories.push({ 
                    value: item.id, 
                    label: item.type})})

                this.setState({
                    options: categories 
                })
            })
    }

    onCategoryChange = (event) => {
        this.setState({
            selectedId: {
                value: event.value
            }
        })
    }

    makeObj(val) {
        const obj = {
            input: true,
            value: val
        }
        return obj
    }

    makeOption(val) {
        const obj = {
            value: val,
            label: val
        }
        return obj
    }

    newCroppedImg(imgCropped) {
        this.setState({ imgCropped: imgCropped })
    }

    toList() {
        this.props.history.push("/data-management/resources/list")
    }

    toForm() {
        this.props.history.push("/data-management/resources/form")
    }

    render() {
        let submitBtn = ""
        if (this.state.updateProfile) {
            submitBtn = "Update"
        } else {
            submitBtn = "Submit"
        }

        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>Resources Form</h1>

                    <div className="actions">
                        <a href="" className="actions__item zmdi zmdi-arrow-left zmdi-hc-fw" onClick={this.toList}></a>
                        <a href="" className="actions__item zmdi zmdi-plus zmdi-hc-fw" onClick={this.toForm}></a>

                    </div>
                </header>
                <div className="card col-sm-12">
                    <div className="card-body">
                        <div className="col-sm-12">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Company Name</ControlLabel>
                                            <FormControl
                                                className={this.state.companyName.input && (validation.companyName(this.state.companyName.value) ? 'is-valid' : 'is-invalid')}
                                                type="text"
                                                name="companyName"
                                                value={this.state.companyName.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.companyName.input && !validation.companyName(this.state.companyName.value) ? <HelpBlock style={{ position: "absolute" }}>Company name is required</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Website</ControlLabel>
                                            <FormControl
                                                className={this.state.siteUrl.input && (validation.urlCheck(this.state.siteUrl.value) ? 'is-valid' : 'is-invalid')}
                                                type="text"
                                                name="siteUrl"
                                                value={this.state.siteUrl.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.siteUrl.input && !validation.urlCheck(this.state.siteUrl.value) ? <HelpBlock style={{ position: "absolute" }}>Company name is required</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-12">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Description</ControlLabel>
                                            <FormControl
                                                className={this.state.description.input && (validation.description(this.state.description.value) ? 'is-valid' : 'is-invalid')}
                                                componentClass="textarea"
                                                rows="4"
                                                name="description"
                                                value={this.state.description.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.description.input && !validation.description(this.state.description.value) ? <HelpBlock style={{ position: "absolute" }}>Company description is required</HelpBlock> : null}
                                        </FormGroup> 
                                    </div>
                                    <div className="col-sm-4">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Contact Name</ControlLabel>
                                            <FormControl
                                                className={this.state.contactName.input && (validation.name(this.state.contactName.value) ? 'is-valid' : 'is-invalid')}
                                                type="text"
                                                name="contactName"
                                                value={this.state.contactName.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.contactName.input && !validation.name(this.state.contactName.value) ? <HelpBlock style={{ position: "absolute" }}>Contact name is required</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-4">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Contact Email</ControlLabel>
                                            <FormControl
                                                className={this.state.contactEmail.input && (validation.email(this.state.contactEmail.value) ? 'is-valid' : 'is-invalid')}
                                                type="text"
                                                name="contactEmail"
                                                value={this.state.contactEmail.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.contactEmail.input && !validation.email(this.state.contactEmail.value) ? <HelpBlock style={{ position: "absolute" }}>Email is required</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-4">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Contact Phone</ControlLabel>
                                            <FormControl
                                                className={this.state.phone.input && (validation.phone(this.state.phone.value) ? 'is-valid' : 'is-invalid')}
                                                type="phone"
                                                name="phone"
                                                value={this.state.phone.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.phone.input && !validation.phone(this.state.phone.value) ? <HelpBlock style={{ position: "absolute" }}>Phone is required</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-6"> 
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Business Type</ControlLabel>
                                            <FormControl
                                                className={this.state.businessTypeId.input && (validation.name(this.state.businessTypeId.value) ? 'is-valid' : 'is-invalid')}
                                                type="text"
                                                name="businessTypeId"
                                                value={this.state.businessTypeId.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.businessTypeId.input && !validation.name(this.state.businessTypeId.value) ? <HelpBlock style={{ position: "absolute" }}>Business Type is required</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm-6">  
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                            <ControlLabel>Business Category</ControlLabel>

                                            <Select className="drop_style" placeholder={this.state.selectedOption ? this.state.selectedOption.value : null} onChange={this.onCategoryChange} options={this.state.options} />
                                     </FormGroup>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormGroup
                                        controlId="formBasicText"
                                    >
                                        <ControlLabel>Business Logo</ControlLabel>
                                                                                
                                        <br></br>
                                        <img src={this.state.imgCropped ? this.state.imgCropped : this.state.imageUrl.value} style={{width: "40%"}} />
                                        <br></br>
                                        <br></br>
                                        <FileUploadModal fileUpload={this.onFileUpload} newProfileImg={this.newCroppedImg} />

                                    </FormGroup>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Button
                        type="button"
                        className='btn btn-light'
                        onClick={this.onSubmit}>
                        {submitBtn}
                    </Button>
                </div>
            </React.Fragment>
        )
    }
}
export default ResourcesForm;