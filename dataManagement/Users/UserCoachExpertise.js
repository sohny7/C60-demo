import React from 'react';
import * as userCoachExpertiseService from '../../../services/userCoachExpertise.Service';
import Select from 'react-select';
import { withRouter } from 'react-router-dom'

class UserCoachExpertise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expertiseList: []
            , coachExpertiseWithName: []
        
        }
    this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if(this.props.userId) {
            let userId = this.props.userId
            userCoachExpertiseService.readByUserId(userId)
                .then((response) => {
                    const expertiseNameArr = response.items.map(item => {
                        return ({
                            value: item.coachExpertiseId
                            , label: item.expertise
                            , id: item.id
                        })
                    });
                    this.setState({
                        coachExpertiseWithName: expertiseNameArr
                    })
                })
                .catch(console.log)
            }
        userCoachExpertiseService.readAll()
            .then(responseData => {
                const coachExpertise = responseData.items.map(item => {
                    return {
                        value: item.id
                        , label: item.expertise
                    }
                })
                this.setState({
                    expertiseList: coachExpertise
                })
            })
            .catch(console.log);
            this.props.setExpertiseProp(this.state.coachExpertiseWithName)    
    }

    handleChange(event) {
        this.setState({
            coachExpertiseWithName: event
        })
        this.props.setExpertiseProp(event)
    }

    // onSelectedChange(value) {
    //     debugger;
    //     if (this.state.coachExpertiseWithName.length < value.length) {
    //         this.setState(({
    //             coachExpertiseWithName: value
    //         }), this.setExpertise(this.state.coachExpertiseWithName))
            
    //     } else {
    //         let difference = this.state.coachExpertiseWithName.filter(x => !value.includes(x))
    //         console.log('Removed: ', difference)
    //         this.setState(({
    //             coachExpertiseWithName: value
    //         }), this.setExpertise(this.state.coachExpertiseWithName))
    //         let deletedId = difference[0].id 
    //         const promise = userCoachExpertiseService.del(deletedId)
    //         return promise
    //     }
    // }

    render() {
        const customStyles = {
            option: (base, state) => ({
                borderBottom: '1px dotted gray',
                padding: 8,
                ...base,
                color: state.isFocused ? 'blue' : 'black',
            }),
        }

        return (
            <div>
        <label>Select Area(s) of Coach Expertise</label>
    
        <Select
        isMulti
        name="expertise"
        className="basic-multi-select"
        classNamePrefix="select"
        value={this.state.coachExpertiseWithName} 
        options={this.state.expertiseList} 
        styles={customStyles}
        onChange={this.handleChange}
      />
      </div>

        )
    }
}

export default withRouter(UserCoachExpertise)