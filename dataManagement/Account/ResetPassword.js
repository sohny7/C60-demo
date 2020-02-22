import React from 'react';
import * as sendGridService from '../../../services/sendGridService'
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert2'

class ResetPassword extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: ''
        }

        this.submitButton = this.submitButton.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toRegister = this.toRegister.bind(this);
        this.toLogin = this.toLogin.bind(this);
    }

    submitButton(){

        const data = {
            email: this.state.email,
        }

        sendGridService.sendEmail(data)
        .then(()=> swal({
            title:'Email Sent!',
            text: 'Please check your email.',
            type:'success',
            confirmButtonColor: '#7ac7f6',
            confirmButtonText: 'Close',
            background: '#0f2940'
        }))
            .then(() => this.toLogin())
            .catch(console.error)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    toRegister(){
        this.props.history.push('/register');
    }

    toLogin(){
        this.props.history.push('/');
    }

    render(){
        const loginStyle = {position: 'absolute', top: '50%', left: '50%', marginTop: '-169px', marginLeft: '-165px', transform: 'translate(-50%, -50%)'}
        return (
            <div className="login__block active" id="l-login" style={loginStyle}>
                <div className="login__block__header">
                    <i className="zmdi zmdi-account-circle"></i>
                    Enter your email to reset password

                    <div className="actions actions--inverse login__block__actions">
                        <div className="dropdown">
                            <i data-toggle="dropdown" className="zmdi zmdi-more-vert actions__item"></i>

                            <div className="dropdown-menu dropdown-menu-right">
                                <a onClick={this.toRegister}className="dropdown-item" data-sa-action="login-switch" data-sa-target="#l-register" href="">Don't have an account?</a>
                                <a className="dropdown-item" onClick={this.toLogin} data-sa-action="login-switch" data-sa-target="#l-forget-password" href="">Remembered your password?</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login__block__body">
                    <div className="form-group">
                        <input value = {this.state.email} type="text" className="form-control text-center" placeholder="Email Address" name="email" onChange={this.onChange} />
                    </div>

                    <button type="button" className="btn btn-light" onClick={this.submitButton}>Send verification</button>
                </div>
            </div>
        )
    }
}

export default withRouter(ResetPassword)