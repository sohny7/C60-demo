import React from 'react';
import * as userService from '../../../services/userService';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert2';
import { connect } from 'react-redux'
import * as currentUserProfileServices from '../../../services/currentUserProfileService';
import { setRoutes } from '../../../actions/userRoutes'
import { setUserProfile } from '../../../actions/userProfiles'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        input: false,
        value: ""
      },
      password: {
        input: false,
        value: ""
      }
    };

    this.submitButton = this.submitButton.bind(this);
    this.onChange = this.onChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.toRegister = this.toRegister.bind(this);
    this.toPasswordReset = this.toPasswordReset.bind(this);
  }

  keyPressed(event) {
    let code = event.keyCode || event.which;
    if (code === 13) {
      this.submitButton();
    }
  }

    submitButton(){
        if(this.state.password.value === ''){
            swal({
                title: 'Missing Password',
                text: "Please enter your password.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#7ac7f6',
                confirmButtonText: 'Close',
                background: '#0f2940'
            })
        }
        else if(this.state.email.value === ''){
            swal({
                title: 'Missing Email',
                text: "Please enter your email address.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#7ac7f6',
                confirmButtonText: 'Close',
                background: '#0f2940'
            })
        }
        else{
        const data = {
            email: this.state.email.value,
            password: this.state.password.value
        }
        userService.login(data)
            .then(() => {
                return currentUserProfileServices.readById()
            })
            .then((response) => {
                this.props.setUserProfile(response.items[0]);
                this.props.setRoutes(response.items[0].userTypeId)
                this.props.history.push("/")
            })
            .catch((error) => {
                if(error.response.status === 400){
                    swal({
                        title: 'Incorrect Password',
                        text: "Password does not match the entered email. If you forgot your password please use the menu option to reset password.",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#7ac7f6',
                        confirmButtonText: 'Close',
                        background: '#0f2940'
                    }) 
                }
         
                else if(error.response.status === 401){
                    swal({
                        title: 'Pending Approval',
                        text: "We are currently reviewing your account for approval. Please contact your local office for questions regarding your account",
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#7ac7f6',
                        confirmButtonText: 'Close',
                        background: '#0f2940'
                    })
                } 
                
                else if(error.response.status === 500){
                    swal({
                        title: 'Email Not Found',
                        text: 'Email not found, if you would like to register please use the menu option to travel to the Registration page.',
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#7ac7f6',
                        confirmButtonText: 'Close',
                        background: '#0f2940'
                    })
                }
                else {
                    console.log(error)

                }
            })
        }
    }

  onChange(e) {
    const value = { value: e.target.value, input: true };
    this.setState({
      [e.target.name]: value
    });
  }

  toRegister() {
    this.props.history.push("/register");
  }

  toPasswordReset() {
    this.props.history.push("/resetPassword");
  }

  render() {
    const loginStyle = {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-169px",
      marginLeft: "-165px",
      transform: "translate(-50%, -50%)"
    };
    return (
      <div
        className="login__block active login"
        id="l-login"
        style={loginStyle}
      >
        <div className="login__block__header">
          <i className="zmdi zmdi-account-circle" />
          <p>Welcome to LA Pathways</p>
          <p>Please Log in</p>
          <hr className="header-line-login mx-auto" />
          <div className="actions actions--inverse login__block__actions">
            <div className="dropdown">
              <i
                data-toggle="dropdown"
                className="zmdi zmdi-more-vert actions__item"
              />

              <div className="dropdown-menu dropdown-menu-right">
                <a
                  onClick={this.toRegister}
                  className="dropdown-item"
                  data-sa-action="login-switch"
                  data-sa-target="#l-register"
                  href=""
                >
                  Create an account
                </a>
                <a
                  className="dropdown-item"
                  onClick={this.toPasswordReset}
                  data-sa-action="login-switch"
                  data-sa-target="#l-forget-password"
                  href=""
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="login__block__body">
          <div className="form-group">
            <input
              type="text"
              className="form-control text-center"
              placeholder="Email Address"
              name="email"
              onChange={this.onChange}
              onKeyPress={this.keyPressed}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control text-center"
              placeholder="Password"
              name="password"
              onChange={this.onChange}
              onKeyPress={this.keyPressed}
            />
          </div>
          <button
            type="button"
            className="btn btn-light"
            disabled={!this.state.email.input || !this.state.password.input}
            onClick={this.submitButton}
          >
            Log in
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    setUserProfile: userProfile => dispatch(setUserProfile(userProfile)),
    setRoutes: userType => dispatch(setRoutes(userType))
})

export default withRouter(connect(null, mapDispatchToProps)(Login))