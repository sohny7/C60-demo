import React from 'react'
import * as UserService from '../../../services/userService';
import { connect } from 'react-redux'

class UserMentorMatch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            typeId: 5,
            mentorList: [],
            userId: 0,
            mentorId: 0,
            mentorFilterList:[]

        }
        this.onSubmit = this.onSubmit.bind(this);
        this.loadPage = this.loadPage.bind(this);
    }

    componentDidMount() {
        this.loadPage();

    }

    loadPage(){
        this.setState({})

        UserService.getBytypeId(this.state.typeId)
            .then(response => {
                this.setState({
                    mentorList: response.items,
                    userId: this.props.userProfiles.userId
                });
            })
            .catch(console.error);

        UserService.usersMentors_GetByUserId(this.props.userProfiles.userId)
            .then(response => {
                this.setState({
                    mentorFilterList: response.items
                })
            })
            .catch(console.error);
    }

    onSubmit(e) {
         console.log(e.target.id);
        const data = {
            mentorId: parseInt(e.target.id),
            userId: this.state.userId
        };
        UserService.matchUserMentor(data)
        .then(()=>this.loadPage());
    }


    render() {
        const listTypes = this.state.mentorList.map(userType => {
            
            if(!this.state.mentorFilterList.includes(userType.id)){
            return (
                <tr key={userType.id}>
                    <td> {userType.id}</td>
                    <td> {userType.firstName}</td>
                    <td> {userType.lastName}</td>
                    <td> {userType.userTypeId}</td>
                    <span>
                        <button className="btn btn-light" id={userType.id} onClick={this.onSubmit}>Select</button>
                    </span>
                </tr>
            )
            }
        })

        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>Users Mentors Match</h1>
   
                                <table className="table table-inverse mb-0" >

                                    <thead>
                                        <tr>
                                            <th>Id</th><th>First</th><th>Last</th><th>TypeId</th><th>Button</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {listTypes}
                                    </tbody>
                                </table>
                </header>
                <div className="card">
                    <div className="card-body">
                    
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    userProfiles: state.userProfiles
})
export default connect(mapStateToProps)(UserMentorMatch);