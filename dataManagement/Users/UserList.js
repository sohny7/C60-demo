import React from 'react';
import * as userService from '../../../services/userService';
import UserTemplate from './UserTemplate';
import swal from 'sweetalert2';

class UserList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            data : '',
            totalPages: 0,
            counter : 0
        }

        this.editButton = this.editButton.bind(this);
        this.deleteButton = this.deleteButton.bind(this);
        this.toForm = this.toForm.bind(this);
        this.getList = this.getList.bind(this);
        this.nextIndex = this.nextIndex.bind(this);
        this.prevIndex = this.prevIndex.bind(this);
        this.lastIndex = this.lastIndex.bind(this);
        this.firstIndex = this.firstIndex.bind(this)
    }
    componentDidMount(){
        this.getList(this.state.counter);
    }

    toForm(){
        this.props.history.push('/user/form/')
    }

    getList(index, size = 20){
        const promise = userService.readAllPaged(index, size)

        promise
            .then(response => {
                let totalPages = Math.ceil(response.items[0].totalPages / size)
                this.setState({
                    data: response.items,
                    totalPages: totalPages - 1
                })
            })
            .catch(console.log)
    }

    firstIndex(){
        if(this.state.counter > 0){
            let counter = 0
            this.updateList(counter);
        }
    }

    lastIndex(){
        if(this.state.counter < this.state.totalPages){
            let counter = this.state.totalPages
            this.updateList(counter);
        }
    }

    nextIndex(){
        if(this.state.counter < this.state.totalPages){
            let counter = this.state.counter + 1
            this.updateList(counter);
        }
    }

    prevIndex(){
        if(this.state.counter > 0){
            let counter = this.state.counter - 1
            this.updateList(counter);
        }
    }

    updateList(counter){
        this.getList(counter)
        this.setState({
            counter : counter
        })
    }

    editButton(id){
        this.props.history.push('/user/form/'+ id)
    }

    deleteButton(id){      
        swal({
            title: "Are you sure you want to delete this user?",
            text: "You won't be able to recover this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            cancelButtonColor: '#7ac7f6',
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it!",
            background: '#0f2940'
          }).then((result) => {
            if (result.value) {
                swal({
                    title: "Deleted!",
                    text: "User has been deleted.",
                    type: "success",
                    background: '#0f2940',
                    confirmButtonColor: '#7ac7f6'
                })
                userService.deleteById(id)
                    .then(() => this.getList(this.state.counter))
                    .catch(console.error)
            }
          })
    }

    render(){
        const firstButton = this.state.counter > 0
        ? <li className="page-item pagination-first" onClick={this.firstIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-first disabled" onClick={this.firstIndex}><a className="page-link"></a></li>

        const prevButton = this.state.counter > 0
        ? <li className="page-item pagination-prev" onClick={this.prevIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-prev disabled" onClick={this.prevIndex}><a className="page-link"></a></li>

        const nextButton = this.state.counter < this.state.totalPages
        ? <li className="page-item pagination-next" onClick={this.nextIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-next disabled" onClick={this.nextIndex}><a className="page-link"></a></li>

        const lastButton = this.state.counter < this.state.totalPages
        ? <li className="page-item pagination-last" onClick={this.lastIndex}><a className="page-link"></a></li>
        : <li className="page-item pagination-last disabled" onClick={this.lastIndex}><a className="page-link"></a></li>
        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>User List</h1>

                    <div className="actions">

                        <a className="actions__item zmdi zmdi-plus-circle" onClick={this.toForm}></a>
                    </div>
                </header>

                <div className="card">
                    <div className="card-body row">
                        <div className="row col-md-12">
                            <table className="table table-inverse">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>User Type</th>
                                        <th>Is Confirmed</th>
                                        <th>Referral Source</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <UserTemplate data={this.state.data} deleteButton={this.deleteButton} editButton={this.editButton} />
                            </table>
                        </div>
                    </div>
                    <ul className="pagination justify-content-center">
                        {firstButton}
                        {prevButton}
                        {nextButton}
                        {lastButton}
                    </ul>
                </div>

            </React.Fragment>
        )
    }
}

export default UserList;