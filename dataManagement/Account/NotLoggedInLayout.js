import React from 'react';
import Register from './Register';
import Login from './Login';
import { Route, Switch } from 'react-router-dom'
import ResetPassword from './ResetPassword';
import PasswordChange from './PasswordChange';
import PasswordChangeSuccess from './PasswordChangeSuccess';
import KeyExpireDate from './KeyExpireDate';
import LandingPage from '../../LandingPage';
import PreRegisterRecommendations from '../../PreRegisterRecommendations';
import Assessment from '../../AssessmentWizard';
import ErrorPage from '../../ErrorPage';
import ResourceProviderProfile from '../../ResourceProviderProfile';

class NotLoggedInLayout extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route path="/" exact component={LandingPage} />
                    <Route path="/recommendations" exact component={PreRegisterRecommendations} />
                    <Route path="/assessment" component={Assessment} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/resetPassword" component={ResetPassword} />
                    <Route path="/passwordreset/:id?" component={PasswordChange} />
                    <Route path="/passwordresetsuccess" component={PasswordChangeSuccess} />
                    <Route path="/expire-check/:key?" component={KeyExpireDate} />
                    <Route path="/error" component={ErrorPage} />
                    <Route path="/resource-provider-profile/:id?" exact component={ResourceProviderProfile} />
                    <Route path="/data-management/userCoachChecklist" component={Login} />
                    <Route component={ErrorPage} />
                </Switch>
            </React.Fragment>
        )
    }
}

export default NotLoggedInLayout