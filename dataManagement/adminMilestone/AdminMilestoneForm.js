import React from 'react';
import { Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import * as milestoneService from '../../../services/milestoneService';


class AdminMilestoneForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            milestones: []
            , description: ''
            , editMode: false
            , id: ''
            , isCustomCreateByMentor: false
            , customMentorId: ''
            ,validate: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.validateMessage = this.validateMessage.bind(this);

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
        if ((description === ''||description.match(regex)) ) {
            this.setState({ validate: "please enter valid milestone" })
        }
        else {
            this.setState({ validate: 'milestone is valid' })
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id
            const promise = milestoneService.milestoneGetById(id)
            return promise
                .then(responseData => {
                    let values = responseData.item
                    this.setState({
                        description: values.description
                        , customMentorId: values.customMentorId
                        , editMode: true
                    })
                })
                .catch(console.log)
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.validateMessage();
        this.setState({ [name]: value })
    }

    onSubmit() {
        const data = {
            description: this.state.description
            , isCustomCreateByMentor: this.state.isCustomCreateByMentor
            , customMentorId: this.state.customMentorId
        }
        if (this.state.validate == "milestone is valid") {

            if (this.state.editMode) {
                const formId = this.props.match.params.id;
                const promise = milestoneService.updateMilestone(formId, data)
                return promise
                    .then(() => this.props.history.push('/data-management/admin-milestone/list/'))
                    .catch(console.log)
            } else {
                const promise = milestoneService.createMilestone(data)
                return promise
                    .then(() => this.props.history.push('/data-management/admin-milestone/list/'))
                    .catch(console.log)
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>Milestones</h1>
                </header>

                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className='form-group'>
                                <h1 className='card-body__title'>Create Milestones</h1>
                                <div className='row'>
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <FormGroup validationState={this.validate()} controlId="formControlsTextarea">
                                                <FormControl validationState={this.validate()} componentClass="textarea" placeholder="Enter text" name="description" value={this.state.description} onChange={this.handleChange} />
                                                <HelpBlock>{this.state.validate}</HelpBlock>
                                            </FormGroup>
                                        </div>
                                        <label className="custom-control custom-checkbox">
                                            <input type="checkbox" name="isCustomCreateByMentor" className="custom-control-input" checked={this.state.isCustomCreateByMentor} onChange={this.handleChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Save to Mentor Milestone List</span>
                                        </label>

                                    </div>
                                </div>
                                <br />
                                <div>
                                    {this.state.editMode
                                        ? <Button className="btn btn-light" onClick={this.onSubmit}>Save</Button>
                                        : <Button className="btn btn-light" onClick={this.onSubmit}>Create</Button>}
                                    <Button className="btn btn-light" onClick={()=>this.props.history.push('/data-management/admin-milestone/list/')}>Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default AdminMilestoneForm;