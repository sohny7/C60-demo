import React from 'react'
import UserCoachChecklist from '../../UserCoachChecklist';

class ChecklistTab extends React.Component {
    constructor(props) {
        super(props)
            this.state = {
                userChecklist: true
            }
    }

    render() {
        return (
            <div>
                <UserCoachChecklist clientId={this.props.clientId} userChecklist={this.state.userChecklist} />
            </div>
        )
    }
}

export default ChecklistTab
