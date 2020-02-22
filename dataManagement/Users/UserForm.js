import React from 'react';
import * as userService from '../../../services/userService';
import * as validation from '../../../utils/validation';
import UserFormTemplate from './UserFormTemplate';
import * as resourcesUserService from '../../../services/resourcesUserService';
import swal from 'sweetalert2';
import * as userCoachExpertiseService from '../../../services/userCoachExpertise.Service';
import UserProfileModal from '../../UserProfileModal';
import * as userProfileInfoService from '../../../services/userProfileInfoService';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import UserTypesDropdown from '../../UserTypesDropdown';
import UserCoachExpertise from './UserCoachExpertise';
import ResourceProviderModal from '../../ResourceProviderModal';
import ResetPassword from '../../ResetPassword';
import Select from 'react-select'

class UserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: {
                input: false,
                value: ''
            },
            lastName: {
                input: false,
                value: ''
            },
            email: {
                input: false,
                value: ''
            },
            password: {
                input: false,
                value: ''
            },
            passwordConfirm: {
                input: false,
                value: ''
            },
            userTypeId: {
                input: false,
                value: ''
            },
            referralSource: {
                input: false,
                value: ''
            },
            isConfirmed: false,
            editMode: false,
            show: false,
            submit: false,
            profileData: {},
            expertisePicked: [],
            userId: 0,
            resourcesId: '',
            profileEdit: true, 
            options: [
                {value: 'default', label: 'default'}
            ], 
            selectedOption: null
        }

        this.onChange = this.onChange.bind(this);
        this.onSendEmail = this.onSendEmail.bind(this);
        this.modalData = this.modalData.bind(this);
        this.postMode = this.postMode.bind(this);
        this.passResourceProp = this.passResourceProp.bind(this);
        this.submitButton = this.submitButton.bind(this);
        this.passExpertiseProp = this.passExpertiseProp.bind(this);
        this.userEdit = this.userEdit.bind(this); 
    }

    onSendEmail() {
        var data = ({
            personalizations:
                [{
                    to: [{ email: 'c60@dispostable.com', name: 'Test User' }],
                    subject: 'Pathways Project!'
                }],
            from: { email: 'admin@example.com', name: 'Administrator' },
            reply_to: { email: 'sonyasemail@example.com', name: 'Administrator' },
            content: [
                {
                    type: 'text/html',
                    value: "<html><head></head><body>Congratulations " + this.state.firstName.value + " " + this.state.lastName.value + "!" + "Your login information is" + " Username:" + this.state.email.value + " Password:" + this.state.password.value + "</body></html>"
                }
            ]
        })
        userService.sendLoginEmail(data)

    }

    postMode() {
        this.setState({
            firstName: {
                input: false,
                value: ''
            },
            lastName: {
                input: false,
                value: ''
            },
            email: {
                input: false,
                value: ''
            },
            password: {
                input: false,
                value: ''
            },
            passwordConfirm: {
                input: false,
                value: ''
            },
            userTypeId: {
                input: false,
                value: ''
            },
            referralSource: {
                input: false,
                value: ''
            },
            id: '',
            isConfirmed: false,
            editMode: false
        })
    }

    componentDidMount() {
        this.onDropdown()
        let userId = this.props.match.params.userId

        if (userId) {
            const promise1 = userService.readById(userId)
            return promise1
                .then(response => {
                    let values = response.item
                    this.setState({
                        userId: values.id,
                        editMode: true,
                        isConfirmed: values.isConfirmed,
                        firstName: this.makeObj(values.firstName),
                        lastName: this.makeObj(values.lastName),
                        email: this.makeObj(values.email),
                        password: this.makeObj(values.password),
                        passwordConfirm: this.makeObj(values.password),
                        selectedId: {value: values.userTypeId, label: values.typeName}, 
                        userTypeId: {value: values.userTypeId, label: values.typeName},
                        referralSource: this.makeObj(values.referralSource)

                    })
                })
                .catch(error => console.log(error))
        }
    }

    onDropdown() {
        userService.getAllUserTypes()
            .then(response => {
                const categories = []; 
                const data = response.items; 
                data.map(item => {categories.push({ 
                    value: item.id, 
                    label: item.typeName})})

                this.setState({
                    options: categories 
                })
            })
    }

    makeObj(val) {
        const obj = {
            input: true,
            value: val
        }
        return obj
    }

    passExpertiseProp(expertisePicked) {
        this.setState({
            expertisePicked: expertisePicked
        });
    }

    passResourceProp(resourceObj) {
        this.setState({
            resourceLabel: resourceObj.label,
            resourcesId: resourceObj.value
        })
    }

    modalData(data, editBool) {
        this.setState({
            profileData: data,
            editMode: editBool

        })
    }

    onChange(e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : { value: e.target.value, input: true };
        this.setState({
            [e.target.name]: value
        })
    }

    onCategoryChange = (event) => {
        this.setState({
            userTypeId: event,
            selectedId: event
        })
    }

    checkValidation() {
        return validation.name(this.state.firstName.value) &&
            validation.name(this.state.lastName.value) &&
            validation.email(this.state.email.value) &&
            validation.password(this.state.password.value) &&
            validation.confirmPassword(this.state.password.value, this.state.passwordConfirm.value) &&
            validation.integer(this.state.userTypeId.value) &&
            validation.name(this.state.referralSource.value)
    }

    sendEmailModal() {
        const promise = swal({
            title: "Email New User?",
            text: "Would you like to email username and password information?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#7ac7f6",
            cancelButtonColor: 'red',
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            background: '#0f2940'
        })
            .then((result) => {
                if (result.value) {
                    this.onSendEmail()
                    swal({
                        title: 'Emailed!',
                        text: 'Username and password information has been emailed!',
                        type: 'success',
                        background: '#0f2940',
                        confirmButtonColor: "#7ac7f6"
                    })

                }
            })
        return promise;
    }

    userEdit() {
       const data = {
           id: this.state.userId, 
           firstName: this.state.firstName.value, 
           lastName: this.state.lastName.value, 
           email: this.state.email.value
       } 
       userService.updateUserEdit(data)
        .then(() => {
            this.props.history.push('/user-profile')
        })
        .catch(console.log)
    }

    submitButton() {
        const data = {
            id: this.state.userId,
            firstName: this.state.firstName.value,
            lastName: this.state.lastName.value,
            email: this.state.email.value,
            password: this.state.password.value,
            userTypeId: this.state.userTypeId.value,
            referralSource: this.state.referralSource.value,
            isConfirmed: this.state.isConfirmed,
        }
        const coachExpertiseData = {
            userId: '',
            expertisePicked: this.state.expertisePicked
        }

        const resourceData = {
            userId: '',
            resourcesId: this.state.resourcesId
        }

        const profileDataObj = this.state.profileData;

        if (this.checkValidation()) {
            
            if (this.state.editMode) {
                let userId = this.state.userId;
                const promise = userService.update(data, userId)
                return promise
                    .then(() => {                        
                        let profileDataObj = this.state.profileData;
                        userProfileInfoService.updateByUserId(userId,profileDataObj)
                    })
                    .then(() => {
                        this.props.history.push('/user/list/')
                    })
                    .catch((error) => console.log(error))

            } else {
                userService.create(data)
                    .then((response) => {
                        const userId = response.item
                        return userId
                    })
                    .then((userId) => {
                        if (coachExpertiseData.expertisePicked.length) {
                            coachExpertiseData.userId = userId
                            userCoachExpertiseService.create(coachExpertiseData)
                        }
                        return userId
                    })
                    .then((userId) => {
                        if (resourceData.resourcesId) {
                            resourceData.userId = userId
                            resourcesUserService.create(resourceData)
                        }
                        return userId
                    })
                    .then((userId) => {
                        if (Object.keys(profileDataObj).length !== 0) {
                            profileDataObj.userId = userId;
                            userProfileInfoService.create(profileDataObj)
                        }
                    })
                    .then(() => {
                        if (this.state.userTypeId.value == "3" || this.state.userTypeId.value == "4" || this.state.userTypeId.value == "5") {
                            const promise = this.sendEmailModal();
                            return promise;
                        }
                    })
                    .then(() => {
                        this.props.history.push('/user/list/')
                    })
                    .catch((error) => console.log(error))
            }
        } else {
            console.log("Invalid Information")
        }
    }

    render() {
        let button = this.state.editMode ? <button type="button" className="btn btn-light btn-block" onClick={this.submitButton}>Update</button>
            : <button type="button" className="btn btn-light btn-block" onClick={this.submitButton}>Submit</button>
        
        const coachExpertise = this.state.userTypeId.value == '3' ? <UserCoachExpertise userId={this.state.userId && this.state.userId} setExpertiseProp={this.passExpertiseProp}  validation={this.props.valdation} /> : <div></div>
        const coachResourceProvider = this.state.userTypeId.value == '3' ? <ResourceProviderModal setResourceProp={this.passResourceProp}  /> : <div></div>

        let form;
        let addButton; 
        if (this.props.location.pathname === `/user/form/${this.props.userProfile.userId}/edit`) {
            form =
                <div>
                    <FormGroup>
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl
                            className={this.state.firstName.input && (validation.name(this.state.firstName.value) ? 'is-valid' : 'is-invalid')}
                            type="text"
                            name="firstName"
                            value={this.state.firstName.value}
                            onChange={this.onChange}
                        />
                        <i className="form-group__bar"></i>
                        <FormControl.Feedback />
                        {this.state.firstName.input && !validation.name(this.state.firstName.value) ? <HelpBlock style={{ position: "absolute" }}>First name is required</HelpBlock> : null}
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl
                            className={this.state.lastName.input && (validation.name(this.state.lastName.value) ? 'is-valid' : 'is-invalid')}
                            type="text"
                            name="lastName"
                            value={this.state.lastName.value}
                            onChange={this.onChange}
                        />
                        <i className="form-group__bar"></i>
                        <FormControl.Feedback />
                        {this.state.lastName.input && !validation.name(this.state.lastName.value) ? <HelpBlock style={{ position: "absolute" }}>Last name is required</HelpBlock> : null}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            className={this.state.email.input && (validation.email(this.state.email.value) ? 'is-valid' : 'is-invalid')}
                            type="text"
                            name="email"
                            value={this.state.email.value}
                            onChange={this.onChange}
                        />
                        <FormControl.Feedback />
                        <i className="form-group__bar"></i>
                        {this.state.email.input && !validation.email(this.state.email.value) ? <HelpBlock style={{ position: "absolute" }}>Email is required</HelpBlock> : null}
                    </FormGroup>

                    <FormGroup>
                        {this.state.password.value && <ResetPassword password={this.state.password.value ? this.state.password.value : null} />}                        
                    </FormGroup>
                </div>
                addButton = <div></div>
                button = <button type="button" className="btn btn-light btn-block" onClick={this.userEdit}>Update</button>
        } else {
            form = 
                <div>
                <FormGroup>
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                        className={this.state.firstName.input && (validation.name(this.state.firstName.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="firstName"
                        value={this.state.firstName.value}
                        onChange={this.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.state.firstName.input && !validation.name(this.state.firstName.value) ? <HelpBlock style={{ position: "absolute" }}>First name is required</HelpBlock> : null}
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                        className={this.state.lastName.input && (validation.name(this.state.lastName.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="lastName"
                        value={this.state.lastName.value}
                        onChange={this.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.state.lastName.input && !validation.name(this.state.lastName.value) ? <HelpBlock style={{ position: "absolute" }}>Last name is required</HelpBlock> : null}
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        className={this.state.email.input && (validation.email(this.state.email.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="email"
                        value={this.state.email.value}
                        onChange={this.onChange}
                    />
                    <FormControl.Feedback />
                    <i className="form-group__bar"></i>
                    {this.state.email.input && !validation.email(this.state.email.value) ? <HelpBlock style={{ position: "absolute" }}>Email is required</HelpBlock> : null}
                </FormGroup>
                <FormGroup>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            className={this.state.password.input && (validation.password(this.state.password.value) ? 'is-valid' : 'is-invalid')}
                            type="text"
                            name="password"
                            value={this.state.password.value}
                            onChange={this.onChange}
                        />
                        <i className="form-group__bar"></i>
                        <FormControl.Feedback />
                        {this.state.password.input && !validation.password(this.state.password.value) ? <HelpBlock style={{ position: "absolute" }}>Password is required</HelpBlock> : null}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            className={this.state.passwordConfirm.input && (validation.confirmPassword(this.state.password.value, this.state.passwordConfirm.value) ? 'is-valid' : 'is-invalid')}
                            type="text"
                            name="passwordConfirm"
                            value={this.state.passwordConfirm.value}
                            onChange={this.onChange}
                        />
                        <i className="form-group__bar"></i>
                        <FormControl.Feedback />
                        {this.state.passwordConfirm.input && !validation.confirmPassword(this.state.password.value, this.state.passwordConfirm.value) ? <HelpBlock style={{ position: "absolute" }}>Must match password</HelpBlock> : null}
                    </FormGroup>

                <FormGroup style={{ alignContent: "left" }}>
                    <ControlLabel>User Type</ControlLabel>

                    <Select className="drop_style" value={this.state.userTypeId} onChange={this.onCategoryChange} options={this.state.options} />
                    <br />
                    {coachExpertise}

                </FormGroup>

                <FormGroup>
                    <ControlLabel>Referral Source</ControlLabel>
                    <FormControl
                        className={this.state.referralSource.input && (validation.name(this.state.referralSource.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="referralSource"
                        value={this.state.referralSource.value}
                        onChange={this.onChange}
                    /> 
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.state.referralSource.input && !validation.name(this.state.referralSource.value) ? <HelpBlock style={{ position: "absolute" }}>Referral Source is required</HelpBlock> : null}
                </FormGroup>
                <label className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" onChange={this.onChange} name="isConfirmed" checked={this.props.isConfirmed} />
                    <span className="custom-control-indicator"></span>
                    <span className="custom-control-description">Confirmed?</span>
                </label>
                <br /><br />
                <div>
                    {coachResourceProvider}
                    <span value={this.state.resourcesId}> {this.state.resourceLabel}</span>
                </div>
            </div>
            addButton = <div className="actions">
                <a className="actions__item zmdi zmdi-plus-circle" onClick={this.postMode}></a>
            </div>
        }

        return (
            <div>
                <header className="content__title">
                    <h1>Profile Form</h1>

                    {addButton}
                </header>

                <div className="card">
                    <div className="card-body">
                        {form}
                        <br></br>
                        <UserProfileModal 
                            show={this.state.show} 
                            profileEdit={this.state.profileEdit} 
                            profileData={this.modalData} 
                            preservedData={this.state.profileData} />
                        <br></br><br></br>
                        {button}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userProfile: state.userProfiles
})

export default connect(mapStateToProps)(UserForm);