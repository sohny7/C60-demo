import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from "react-bootstrap";
import * as entrepreneurServices from "../../../services/entrepreneurialInfoServices";

class EntrepreneurialForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            businessIndustryRadio: '',
            businessStatusRadio: '',
            mentorRadio: '',
            trainingRadio: '',
            clearenceRadio: '',
            insuranceRadio: '',
            bondsRadio: '',
            userId: '',
            userIdTouched: false,
            specializedEquipment: '',
            seTouched: false,
            skills: '',
            skillsTouched: false,
            isEditClicked: false
        }

        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.userIdInputChange = this.userIdInputChange.bind(this);
        this.skillsInputChange = this.skillsInputChange.bind(this);
        this.seInputChange = this.seInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getSpecializedEquipmentValidationState = this.getSpecializedEquipmentValidationState.bind(this);
        this.getSkillsValidationState = this.getSkillsValidationState.bind(this);
        this.getUserIdValidationState = this.getUserIdValidationState.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }
    componentDidMount() {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id
            this.setState({
                isEditClicked: true
            })
            console.log(id);
            entrepreneurServices.readById(id)
                .then(response => {
                    let editData = response.item
                    console.log(editData)
                    this.setState({
                        businessIndustryRadio: editData.businessIndustryId,
                        businessStatusRadio: editData.businessStatusId,
                        mentorRadio: editData.mentor,
                        trainingRadio: editData.trainingMilestonesId,
                        clearenceRadio: editData.hasSecurityClearence,
                        insuranceRadio: editData.hasInsurance,
                        bondsRadio: editData.hasBonds,
                        userId: editData.userId,
                        userIdTouched: true,
                        specializedEquipment: editData.specializedEquipment,
                        seTouched: true,
                        skills: editData.skills,
                        skillsTouched: true
                    })
                })

        }
        else { console.log("no id found") }
    }

    getUserIdValidationState() {
        function validateUserId(userId) {
            var re = /^([1-9][0-9]{0,4}|100000)$/;
            return re.test(String(userId));
        }
        const userId = this.state.userId;
        if (this.state.userIdTouched === true && !validateUserId(userId)) return "is-invalid";
        if (this.state.userIdTouched === true && validateUserId(userId)) return "is-valid";
    }

    getSpecializedEquipmentValidationState() {
        function validateSpecializedEquipment(specializedEquipment) {
            //regex from stackoverflow to allow all characters
            var re = /^.{0,500}$/;
            return re.test(String(specializedEquipment));
        }
        const specializedEquipment = this.state.specializedEquipment;
        if (this.state.seTouched && !validateSpecializedEquipment(specializedEquipment)) return "is-invalid";
        if (this.state.seTouched && validateSpecializedEquipment(specializedEquipment)) return "is-valid";
    }

    getSkillsValidationState() {
        function validateSkills(skills) {
            var re = /^.{1,4000}$/;
            return re.test(String(skills));
        }
        const skills = this.state.skills;
        if (this.state.skillsTouched && !validateSkills(skills)) return "is-invalid";
        if (this.state.skillsTouched && validateSkills(skills)) return "is-valid";
    }

    handleOptionChange(changeEvent) {
        this.setState({
            [changeEvent.target.name]: JSON.parse(changeEvent.target.value)
        });
    }

    userIdInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            userIdTouched: true,
        })
    }
    skillsInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            skillsTouched: true,
        })
    }
    seInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            seTouched: true,
        })
    }

    onSubmit(event) {
        event.preventDefault()
        let id = this.props.match.params.id
        const entrepreneurData = {
            businessIndustryId: this.state.businessIndustryRadio,
            businessStatusId: this.state.businessStatusRadio,
            mentor: this.state.mentorRadio,
            trainingMilestonesId: this.state.trainingRadio,
            hasSecurityClearence: this.state.clearenceRadio,
            hasInsurance: this.state.insuranceRadio,
            hasBonds: this.state.bondsRadio,
            userId: this.state.userId,
            specializedEquipment: this.state.specializedEquipment,
            skills: this.state.skills
        }
        console.log(entrepreneurData)
        let promise = {}
        if (this.state.isEditClicked === false){
            promise = entrepreneurServices.create(entrepreneurData)
        }
        else{
            promise = entrepreneurServices.update(id, entrepreneurData)}
            promise.then(response => {
            })
            .then(
                this.setState({
                    businessIndustryRadio: '',
                    businessStatusRadio: '',
                    mentorRadio: '',
                    trainingRadio: '',
                    clearenceRadio: '',
                    insuranceRadio: '',
                    bondsRadio: '',
                    userId: '',
                    userIdTouched: false,
                    specializedEquipment: '',
                    seTouched: false,
                    skills: '',
                    skillsTouched: false
                })
            )
            .then(() => this.props.history.push('/entrepreneurial-list'))

    }

    clearForm(event) {
        event.preventDefault();
        this.setState({
            businessIndustryRadio: '',
            businessStatusRadio: '',
            mentorRadio: '',
            trainingRadio: '',
            clearenceRadio: '',
            insuranceRadio: '',
            bondsRadio: '',
            userId: '',
            userIdTouched: false,
            specializedEquipment: '',
            seTouched: false,
            skills: '',
            skillsTouched: false
        })
    }

    render() {
        const isEditClicked = this.state.isEditClicked;
        let button;
        if (isEditClicked) {
            button = <UpdateEntrepreneurButton onClick={this.onSubmit} />;
        }
        else {
            button = <AddEntrepreneurButton onClick={this.onSubmit} />;
        }
        // const {businessIndustryRadio, businessStatusRadio, mentorRadio, trainingRadio, clearenceRadio, insuranceRadio, bondsRadio, userId, skills } = this.state
        // const enabled =
        //     businessIndustryRadio &&
        //     businessStatusRadio &&
        //     mentorRadio &&
        //     trainingRadio &&
        //     clearenceRadio &&
        //     insuranceRadio &&
        //     bondsRadio &&
        //     userId &&
        //     skills;

        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>Entrepreneurial Info</h1>
                </header>
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Entrepreneurial Form</h4>
                        <h6 className="card-subtitle"></h6>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Business Industry</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="businessIndustryRadio1" name="businessIndustryRadio" type="radio" className="custom-control-input" value={1} checked={this.state.businessIndustryRadio === 1} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Retail</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessIndustryRadio2" name="businessIndustryRadio" type="radio" className="custom-control-input" value={2} checked={this.state.businessIndustryRadio === 2} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Finance</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessIndustryRadio3" name="businessIndustryRadio" type="radio" className="custom-control-input" value={3} checked={this.state.businessIndustryRadio === 3} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Transportation</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessIndustryRadio4" name="businessIndustryRadio" type="radio" className="custom-control-input" value={4} checked={this.state.businessIndustryRadio === 4} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Construction</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessIndustryRadio5" name="businessIndustryRadio" type="radio" className="custom-control-input" value={5} checked={this.state.businessIndustryRadio === 5} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Other</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Are You A Mentor?</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="mentorRadio1" name="mentorRadio" type="radio" className="custom-control-input" value={true} checked={this.state.mentorRadio === true} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Yes</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="mentorRadio0" name="mentorRadio" type="radio" value={false} className="custom-control-input" checked={this.state.mentorRadio === false} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">No</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Training Milestones</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="trainingRadio1" name="trainingRadio" type="radio" className="custom-control-input" value={1} checked={this.state.trainingRadio === 1} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Been to Workshops</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="trainingRadio2" name="trainingRadio" type="radio" className="custom-control-input" value={2} checked={this.state.trainingRadio === 2} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Complete Training Programs</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="trainingRadio3" name="trainingRadio" type="radio" className="custom-control-input" value={3} checked={this.state.trainingRadio === 3} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Pitched Business</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="trainingRadio4" name="trainingRadio" type="radio" className="custom-control-input" value={4} checked={this.state.trainingRadio === 4} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Obtained Funding</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Business Status</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="businessStatusRadio1" name="businessStatusRadio" type="radio" className="custom-control-input" value={1} checked={this.state.businessStatusRadio === 1} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">I have a great idea and need help.</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessStatusRadio2" name="businessStatusRadio" type="radio" className="custom-control-input" value={2} checked={this.state.businessStatusRadio === 2} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Beta Tested</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessStatusRadio3" name="businessStatusRadio" type="radio" className="custom-control-input" value={3} checked={this.state.businessStatusRadio === 3} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">MVP</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessStatusRadio4" name="businessStatusRadio" type="radio" className="custom-control-input" value={4} checked={this.state.businessStatusRadio === 4} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Generating Revenue</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="businessStatusRadio5" name="businessStatusRadio" type="radio" className="custom-control-input" value={5} checked={this.state.businessStatusRadio === 5} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Growth</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup validationState={this.getUserIdValidationState()}>
                                        <ControlLabel>User Id</ControlLabel>
                                        <FormControl type="text" className={`
                 ${this.getUserIdValidationState()}`} name="userId" value={this.state.userId} onChange={this.userIdInputChange} id='userId' placeholder="Numeric value between 1-100000 i.e. 123, 5678 (required)" />
                                        <i className="form-control__bar"></i>
                                        {this.state.userIdTouched && this.getUserIdValidationState() === "is-invalid" ? <HelpBlock style={{ position: 'absolute', color: 'rgb(247, 73, 73)' }}>Enter number between 1-100000</HelpBlock> : ''}
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Do You Have Security Clearence?</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="clearenceRadio1" name="clearenceRadio" type="radio" className="custom-control-input" value={true} checked={this.state.clearenceRadio === true} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Yes</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="clearenceRadio0" name="clearenceRadio" type="radio" className="custom-control-input" value={false} checked={this.state.clearenceRadio === false} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">No</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Do You Have Insurance?</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="insuranceRadio1" name="insuranceRadio" type="radio" className="custom-control-input" value={true} checked={this.state.insuranceRadio === true} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Yes</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="insuranceRadio0" name="insuranceRadio" type="radio" className="custom-control-input" value={false} checked={this.state.insuranceRadio === false} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">No</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Do You Have Bonds?</label>
                                        <div className="clearfix mb-2"></div>
                                        <label className="custom-control custom-radio">
                                            <input id="bondsRadio1" name="bondsRadio" type="radio" className="custom-control-input" value={true} checked={this.state.bondsRadio === true} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">Yes</span>
                                        </label>
                                        <label className="custom-control custom-radio">
                                            <input id="bondsRadio0" name="bondsRadio" type="radio" className="custom-control-input" value={false} checked={this.state.bondsRadio === false} onChange={this.handleOptionChange} />
                                            <span className="custom-control-indicator"></span>
                                            <span className="custom-control-description">No</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup validationState={this.getSpecializedEquipmentValidationState()}>
                                        <ControlLabel>Do You Have Specialized Equipment?</ControlLabel>
                                        <FormControl type="textarea" className={`form-group
                 ${this.getSpecializedEquipmentValidationState()}`} name="specializedEquipment" value={this.state.specializedEquipment} onChange={this.seInputChange} id='specializedEquipment' placeholder="Explain Specialized Equipment Here... (optional)" />
                                        <i className="form-group__bar"></i>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup validationState={this.getSkillsValidationState()}>
                                        <ControlLabel>What Skills Do You Have?</ControlLabel>
                                        <FormControl type='text-area' className={`form-group
                 ${this.getSkillsValidationState()}`} name="skills" value={this.state.skills} onChange={this.skillsInputChange} id='skills' placeholder="i.e. Business, Finance, Sales.... (required)" />
                                        <i className="form-group__bar"></i>
                                    </FormGroup>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="mt-5 text-center">
                                {isEditClicked}{button}
                                <a href="" onClick={this.clearForm} className="btn btn-light">Clear Form</a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
        function AddEntrepreneurButton(props) {
            return (
                <button className="btn btn-light" onClick={props.onClick}>Create Entrepreneur Profile</button>
            );
        }
        function UpdateEntrepreneurButton(props) {
            return (
                <button className="btn btn-light" onClick={props.onClick}>Update Entrepreneur Profile</button>
            );
        }

    }
}
export default EntrepreneurialForm
