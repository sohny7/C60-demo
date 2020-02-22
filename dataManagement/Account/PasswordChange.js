import React from 'react';
import * as passwordReset from '../../../services/passwordResetService';
import { withRouter } from 'react-router-dom';
import { FormControl, ControlLabel, FormGroup, HelpBlock, Button } from 'react-bootstrap';
import * as validation from '../../../utils/validation';

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: {
                value: '',
                touched: false
            },
            confirmPassword: {
                value: '',
                touched: false
            },
            buttonToggle: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.buttonToggle = this.buttonToggle.bind(this);
    }
    handleChange(e) {
        const value = { value: e.target.value, touched: true };
        this.setState({ [e.target.name]: value });
    }
    validation(input) {
        return validation.password(input);
    }
    onSubmit() {
        const data = {
            password: this.state.confirmPassword.value
        }
        passwordReset.edit(this.props.match.params.id, data)
            .then(() => {
                setTimeout(() => {
                    this.props.history.push('/passwordresetsuccess');
                }, 500);
            })
            .catch(console.error)
    }
    buttonToggle() {
        return validation.password(this.state.password.value) && validation.confirmPassword(this.state.password.value, this.state.confirmPassword.value);
    }
    render() {
        const passwordResetStyle = { position: 'absolute', top: '50%', left: '50%', marginTop: '-169px', marginLeft: '-165px', transform: 'translate(-50%, -50%)' };
        return (
            <div className="login__block active" style={passwordResetStyle}>
                <div className="login__block__header">
                    <i className="zmdi zmdi-account-circle"></i>
                    Reset Your Password
                </div>
                <div className="login__block__body">
                    <FormGroup>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            className={this.state.password.touched && (validation.password(this.state.password.value) ? 'is-valid' : 'is-invalid')}
                            type="password"
                            name="password"
                            value={this.state.password.value}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        {this.state.password.touched && !validation.password(this.state.password.value) ? <HelpBlock style={{ left: '0' }}>Password must have a minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.</HelpBlock> : null}
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl
                            className={this.state.confirmPassword.touched && (validation.confirmPassword(this.state.password.value, this.state.confirmPassword.value) ? 'is-valid' : 'is-invalid')}
                            type="password"
                            name="confirmPassword"
                            value={this.state.confirmPassword.value}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        {this.state.confirmPassword.touched && !validation.confirmPassword(this.state.password.value, this.state.confirmPassword.value) ? <HelpBlock style={{ left: '0' }}>Your password and confirm password do not match.</HelpBlock> : null}
                    </FormGroup>
                    <br />
                    <Button bsStyle='success' block disabled={!this.buttonToggle()} onClick={this.onSubmit}>Submit</Button>
                </div>

            </div>
        )
    }
}

export default withRouter(PasswordReset);