import React from "react";
import { withRouter } from "react-router-dom";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from "react-bootstrap";
import * as userService from "../../../services/userService";
import * as validation from "../../../utils/validation";
import { withCookies } from "react-cookie";
import * as userProfileService from "../../../services/userProfileInfoService";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: {
        input: false,
        value: ""
      },
      lastName: {
        input: false,
        value: ""
      },
      email: {
        input: false,
        value: ""
      },
      password: {
        input: false,
        value: ""
      },
      passwordConfirm: {
        input: false,
        value: ""
      },
      referralSource: {
        input: false,
        value: ""
      }
    };
    this.submitButton = this.submitButton.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toLogin = this.toLogin.bind(this);
    this.toPasswordReset = this.toPasswordReset.bind(this);
  }

  componentDidMount() {
    let cookie = this.props.cookies.get("tempuser");
    this.setState({
      userId: parseInt(cookie)
    });
  }

  toLogin() {
    this.props.history.push("/login");
  }

  toPasswordReset() {
    this.props.history.push("/resetPassword");
  }

  checkValidation() {
    return (
      validation.name(this.state.firstName.value) &&
      validation.name(this.state.lastName.value) &&
      validation.email(this.state.email.value) &&
      validation.password(this.state.password.value) &&
      validation.confirmPassword(
        this.state.password.value,
        this.state.passwordConfirm.value
      ) &&
      validation.name(this.state.referralSource.value)
    );
  }

  onChange(e) {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : { value: e.target.value, input: true };
    this.setState({
      [e.target.name]: value
    });
  }

  submitButton() {
    if (this.state.userId && this.checkValidation()) {
      const data = {
        firstName: this.state.firstName.value,
        lastName: this.state.lastName.value,
        email: this.state.email.value,
        password: this.state.password.value,
        referralSource: this.state.referralSource.value,
        id: this.state.userId
      };
      userService
        .update(data)
        .then(() => {
          const profileData = {
            userId: this.state.userId,
            bio: "Insert bio here",
            imageUrl:
              "https://www.shareicon.net/data/128x128/2017/05/09/885769_user_512x512.png",
            dob: "2000-01-01",
            raceEthnicityId: 0,
            levelOfEducationId: 0,
            householdIncome: 0,
            yearsInBusiness: 0
          };

                    return userProfileService.create(profileData)
                })
                .then(() => this.props.history.push('/login'))
                .then(this.clearForm)
                .catch(error => {
                    console.log(error)
                    // alert("Error: Email Already Exists!")
                })
        }
        else if (this.checkValidation()) {
            const data = {
                firstName: this.state.firstName.value,
                lastName: this.state.lastName.value,
                email: this.state.email.value,
                password: this.state.password.value,
                referralSource: this.state.referralSource.value,
            }
            userService.register(data)
                .then(() => this.props.history.push('/login'))
                .then(this.clearForm)
                .catch(console.error)
        }
    }

  render() {
    const regStyle = {
      position: "absolute",
      left: "50%",
      marginLeft: "-165px",
      transform: "translate(-50%, -50%)"
    };

    return (
      <div
        className="login__block active register"
        id="l-register"
        style={regStyle}
      >
        <div className="login__block__header">
          <i className="zmdi zmdi-account-circle" />
          Create an account
          <hr className="header-line-login mx-auto" />
          <div className="actions actions--inverse login__block__actions">
            <div className="dropdown">
              <i
                data-toggle="dropdown"
                className="zmdi zmdi-more-vert actions__item"
              />

              <div className="dropdown-menu dropdown-menu-right">
                <a
                  onClick={this.toLogin}
                  className="dropdown-item"
                  data-sa-action="login-switch"
                  data-sa-target="#l-login"
                  href=""
                >
                  Already have an account?
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
          <FormGroup>
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              className={
                this.state.firstName.input &&
                (validation.name(this.state.firstName.value)
                  ? "is-valid"
                  : "is-invalid")
              }
              type="text"
              name="firstName"
              value={this.state.firstName.value}
              onChange={this.onChange}
            />
            <i className="form-group__bar" />
            <FormControl.Feedback />
            {this.state.firstName.input &&
            !validation.name(this.state.firstName.value) ? (
              <HelpBlock>First name is required</HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              className={
                this.state.lastName.input &&
                (validation.name(this.state.lastName.value)
                  ? "is-valid"
                  : "is-invalid")
              }
              type="text"
              name="lastName"
              value={this.state.lastName.value}
              onChange={this.onChange}
            />
            <i className="form-group__bar" />
            <FormControl.Feedback />
            {this.state.lastName.input &&
            !validation.name(this.state.lastName.value) ? (
              <HelpBlock>Last name is required</HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              className={
                this.state.email.input &&
                (validation.email(this.state.email.value)
                  ? "is-valid"
                  : "is-invalid")
              }
              type="text"
              name="email"
              value={this.state.email.value}
              onChange={this.onChange}
            />
            <FormControl.Feedback />
            <i className="form-group__bar" />
            {this.state.email.input &&
            !validation.email(this.state.email.value) ? (
              <HelpBlock>Email is required</HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              className={
                this.state.password.input &&
                (validation.password(this.state.password.value)
                  ? "is-valid"
                  : "is-invalid")
              }
              type="password"
              name="password"
              value={this.state.password.value}
              onChange={this.onChange}
            />
            <i className="form-control__bar" />
            <FormControl.Feedback />
            {this.state.password.input &&
            !validation.password(this.state.password.value) ? (
              <HelpBlock>
                Password must be at least 8 characters and include capital,
                lowercase, number, and symbol.
              </HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              className={
                this.state.passwordConfirm.input &&
                (validation.confirmPassword(
                  this.state.password.value,
                  this.state.passwordConfirm.value
                )
                  ? "is-valid"
                  : "is-invalid")
              }
              type="password"
              name="passwordConfirm"
              value={this.state.passwordConfirm.value}
              onChange={this.onChange}
            />
            <i className="form-group__bar" />
            <FormControl.Feedback />
            {this.state.passwordConfirm.input &&
            !validation.confirmPassword(
              this.state.password.value,
              this.state.passwordConfirm.value
            ) ? (
              <HelpBlock>Must match password</HelpBlock>
            ) : null}
          </FormGroup>
          <FormGroup>
            <ControlLabel>Referral Source</ControlLabel>
            <FormControl
              className={
                this.state.referralSource.input &&
                (validation.name(this.state.referralSource.value)
                  ? "is-valid"
                  : "is-invalid")
              }
              type="text"
              name="referralSource"
              value={this.state.referralSource.value}
              onChange={this.onChange}
            />
            <i className="form-group__bar" />
            <FormControl.Feedback />
            {this.state.referralSource.input &&
            !validation.name(this.state.referralSource.value) ? (
              <HelpBlock>Referral Source is required</HelpBlock>
            ) : null}
          </FormGroup>
          <br />
          <br />
          <button
            type="button"
            className="btn btn-light btn-block"
            onClick={this.submitButton}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(withCookies(RegisterForm));
