import React from 'react';
import * as userService from '../../../services/userService'
import { connect } from 'react-redux'
import { clearState } from '../../../actions/logout'

class Logout extends React.Component {
    componentDidMount(){
        userService.logout()
            .then(() => this.props.clearState())
            .then(() => this.props.history.push('/'))
    }
    render(){
        return null
    }
}

const mapDispatchToProps = dispatch => ({
    clearState: (val) => dispatch(clearState(val))
})

export default connect(null, mapDispatchToProps)(Logout);