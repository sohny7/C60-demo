import React from 'react';
import { withRouter } from 'react-router-dom';

class PasswordChangeSuccess extends React.Component {
    constructor(props) {
        super(props);
        this.loginButton = this.loginButton.bind(this);
    }
    loginButton() {
        this.props.history.push('/');
    }
    render() {
        const passwordResetStyle = { position: 'absolute', top: '50%', left: '50%', marginTop: '-169px', marginLeft: '-165px', transform: 'translate(-50%, -50%)' };
        return (
            <div className="login__block active" style={passwordResetStyle}>
                <div className="login__block__header">
                    <i className="zmdi zmdi-account-circle"></i>
                    <h3>Password Change Successful!</h3>
                </div>
                <div className="login__block__body">
                    <button type='button' className='btn btn-primary btn-lg btn-block' onClick={this.loginButton}>Click here to login</button>
                </div>
            </div>
        )
    }
}

export default withRouter(PasswordChangeSuccess);