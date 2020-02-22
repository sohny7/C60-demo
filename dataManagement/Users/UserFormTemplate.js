import React from 'react';
import * as validation from '../../../utils/validation';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import UserTypesDropdown from '../../UserTypesDropdown';
import UserCoachExpertise from './UserCoachExpertise';
import ResourceProviderModal from '../../ResourceProviderModal';


class UserFormTemplate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            resourcesId: ''
        }
        
        this.passExpertiseProp = this.passExpertiseProp.bind(this);
        this.passResourceProp = this.passResourceProp.bind(this);
    }

    passExpertiseProp(expertisePicked) {
        this.props.passExpertiseProp(expertisePicked)
      }

    passResourceProp(resourceObj) {
        this.setState({
            resourceLabel: resourceObj.label,
            resourcesId: resourceObj.value
        })
        this.props.passResourceProp(resourceObj)
      } 

    render(){

        const coachExpertise = this.props.userTypeId.value == '3' ? <UserCoachExpertise setExpertiseProp={this.passExpertiseProp}  validation={this.props.valdation} /> : <div></div>
        const coachResourceProvider = this.props.userTypeId.value == '3' ? <ResourceProviderModal setResourceProp={this.passResourceProp}  /> : <div></div>

        return (
            <div>
                <FormGroup>
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                        className={this.props.firstName.input && (validation.name(this.props.firstName.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="firstName"
                        value={this.props.firstName.value}
                        onChange={this.props.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.props.firstName.input && !validation.name(this.props.firstName.value) ? <HelpBlock style={{position: "absolute"}}>First name is required</HelpBlock> : null}
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                        className={this.props.lastName.input && (validation.name(this.props.lastName.value) ? 'is-valid' : 'is-invalid')}
                        type= "text"
                        name= "lastName"
                        value={this.props.lastName.value}
                        onChange={this.props.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.props.lastName.input && !validation.name(this.props.lastName.value) ? <HelpBlock style={{position: "absolute"}}>Last name is required</HelpBlock> : null }
                </FormGroup>  
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        className={this.props.email.input && (validation.email(this.props.email.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="email"
                        value={this.props.email.value}
                        onChange={this.props.onChange}
                    />
                    <FormControl.Feedback />
                    <i className="form-group__bar"></i>
                    {this.props.email.input && !validation.email(this.props.email.value) ? <HelpBlock style={{position: "absolute"}}>Email is required</HelpBlock> : null}
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        className={this.props.password.input && (validation.password(this.props.password.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="password"
                        value={this.props.password.value}
                        onChange={this.props.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.props.password.input && !validation.password(this.props.password.value)? <HelpBlock style={{position: "absolute"}}>Password is required</HelpBlock> : null}
                </FormGroup>  
                <FormGroup>
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        className={this.props.passwordConfirm.input && (validation.confirmPassword(this.props.password.value, this.props.passwordConfirm.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="passwordConfirm"
                        value={this.props.passwordConfirm.value}
                        onChange={this.props.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.props.passwordConfirm.input && !validation.confirmPassword(this.props.password.value, this.props.passwordConfirm.value)? <HelpBlock style={{position: "absolute"}}>Must match password</HelpBlock> : null}
                </FormGroup>

                    {/* Calling Child component UsertypesDropdown.js */}
                    <UserTypesDropdown userTypeId={this.props.userTypeId} onChange = {this.props.onChange} validation={this.props.validation}></UserTypesDropdown>
                    {coachExpertise}

                <FormGroup>
                    <ControlLabel>Referral Source</ControlLabel>
                    <FormControl
                        className={this.props.referralSource.input && (validation.name(this.props.referralSource.value) ? 'is-valid' : 'is-invalid')}
                        type="text"
                        name="referralSource"
                        value={this.props.referralSource.value}
                        onChange={this.props.onChange}
                    />
                    <i className="form-group__bar"></i>
                    <FormControl.Feedback />
                    {this.props.referralSource.input && !validation.name(this.props.referralSource.value) ? <HelpBlock style={{position: "absolute"}}>Referral Source is required</HelpBlock> : null}                
                </FormGroup> 
                <label className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" onChange={this.props.onChange} name="isConfirmed" checked={this.props.isConfirmed} />
                    <span className="custom-control-indicator"></span>
                    <span className="custom-control-description">Confirmed?</span>
                </label>
                <br /> <br />
                <div>
                {coachResourceProvider} 
                <span value={this.state.resourcesId}> {this.state.resourceLabel}</span>
                </div>
            </div>
        )
    }
}

export default UserFormTemplate;