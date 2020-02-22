import React from 'react';
import * as learningResourceService from '../../../services/learningResourceService';
import { ControlLabel, InputGroup, FormGroup, FormControl, HelpBlock, Button } from 'react-bootstrap';
import Select from 'react-select';
import Dropzone from '../../../containers/Dropzone';


class LearningResourceEdit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: ''
            , title: ''
            , description: ''
            , fileUrl: ''
            , fileType: ''
        }

        // this.onGetDropzone = this.onGetDropzone.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        this.validateMessage = this.validateMessage.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // onGetDropzone(url) {
    //     debugger
    //     this.setState({
    //         fileUrl: url
    //     })
    // }

    onSubmit() {
        const data = {
            title: this.state.title
            , description: this.state.description
            // , fileUrl: this.state.fileUrl
            , fileType: this.state.fileType
        }

        const promise = learningResourceService.create(data)
        return promise
    }

    validate() {
        var description = this.state.description
        if (description === '' && !description == /^\S{3,}$/) {
            return 'error';
        }
        else {
            return "success";
        }
    }

    validateMessage() {
        var regex = "^\\s+$";
        var description = this.state.description
        if ((description === '' || description.match(regex))) {
            this.setState({ validate: "please enter description" })
        }
        else {
            this.setState({ validate: 'description is valid' })
        }
    }

    render() {
        const fileTypeDropdown = [
            { value: 1, label: 'PDF' }
            , { value: 2, label: 'DOC' }
            , { value: 3, label: 'JPEG' }
            , { value: 4, label: 'Video' }
            , { value: 5, label: 'WAVE' }
            , { value: 6, label: 'GIF' }
            , { value: 7, label: 'PNG' }
            , { value: 8, label: 'MOV' }
            , { value: 9, label: 'ZIP' }
            , { value: 10, label: 'PSD' }
            , { value: 11, label: 'TXT' }
            , { value: 12, label: 'EXE' }
        ]

        const dropdownStyle = {
            option: (base, state) => ({
                borderBottom: '1px dotted gray',
                padding: 8,
                ...base,
                color: state.isFocused ? 'blue' : 'black',
            }),
        }

        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>Learning Resource Form</h1>
                </header>
                <div className="card">
                    <div className="card-body">
                        <h1 className='card-body__title'>Create and Upload Files for Learning Center</h1>
                        <br />
                        <form>
                            <div className='form-group'>
                                <div className='row'>
                                    <div className='col-sm-12'>
                                        <div>
                                            <div>
                                                <div className="form-group">
                                                    <FormGroup validationState={this.validate()} controlId="formBasicText">
                                                        <ControlLabel>Title</ControlLabel>
                                                        <FormControl validationState={this.validate()} type="text" placeholder="Enter Title" name="title" value={this.state.title} onChange={this.handleChange} />
                                                        <HelpBlock>{this.state.validate}</HelpBlock>
                                                    </FormGroup>
                                                </div>

                                                <div className="form-group">
                                                    <FormGroup validationState={this.validate()} controlId="formControlsTextarea">
                                                        <ControlLabel>Description</ControlLabel>
                                                        <FormControl validationState={this.validate()} componentClass="textarea" placeholder="Enter text" name="description" value={this.state.description} onChange={this.handleChange} />
                                                        <HelpBlock>{this.state.validate}</HelpBlock>
                                                    </FormGroup>
                                                </div>
                                                <div className="form-group col-sm-2" style={{ paddingLeft: 0 }}>
                                                        <FormGroup validationState={this.validate()} >
                                                            <ControlLabel>File type</ControlLabel>
                                                            <Select
                                                                name="fileType"
                                                                options={fileTypeDropdown}
                                                                styles={dropdownStyle}
                                                                onChange={this.handleChange}
                                                            />
                                                            {/* <HelpBlock>File Type</HelpBlock> */}
                                                        </FormGroup>
                                                    </div>
                                                    <h6>Upload your file</h6>
                                                    <div className="col-sm-6" style={{ paddingLeft: 0 }}>
                                                        <InputGroup>
                                                            <Dropzone />
                                                        </InputGroup>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <div>
                                    {this.state.editMode
                                        ? <Button className="btn btn-light" onClick={this.onSubmit}>Save</Button>
                                        : <Button className="btn btn-light" onClick={this.onSubmit}>Create</Button>}
                                    <Button className="btn btn-light" onClick={() => this.props.history.push('/data-management/admin-milestone/list/')}>Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default LearningResourceEdit;