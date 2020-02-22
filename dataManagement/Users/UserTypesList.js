import React, {Component} from 'react';
import * as userTypeService from '../../../services/userTypeService';
import swal from 'sweetalert2'

class UserTypesList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userList: []
        }

        this.onEdit = this.onEdit.bind(this)
        this.onToAddNewUser = this.onToAddNewUser.bind(this)
        this.onDel = this.onDel.bind(this)
    }

    componentDidMount() {
        userTypeService.readAll()
            .then(response => {
                console.log(response)
                let userListArr = response.items
                this.setState({
                    userList: userListArr
                })
            })
            .catch(console.error)
    }

    onEdit(id) {
        userTypeService.readById(id)        
        this.props.history.push("/data-management/user-type/edit/" + id)
    }

    onToAddNewUser() {
        this.props.history.push("/data-management/user-type/edit/")
    }

    onDel(id) {
        swal({
            title: "Are you sure you want to delete this user type?",
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
                text: "User type has been deleted.",
                type: "success",
                background: '#0f2940',
                confirmButtonColor: '#7ac7f6'
              })
              userTypeService.del(id)
              .then(userTypeService.readAll)
              .then((response) => {
                  this.setState({
                      userList: response.items
                    })
                })    
                .catch(console.error)
            }
          })
    }

    render() {
        const userList = this.state.userList.map(item => {
            return <tbody key={item.id}>
                <tr>
                    <td>{item.id}</td>
                    <td>{item.typeName}</td>
                    <td>
                    <button onClick={e => this.onEdit(item.id, e)} className="btn btn-light btn--icon"><i className="zmdi zmdi-edit"></i></button>
                    &nbsp;<button onClick={e => this.onDel(item.id, e)} className="btn btn-light btn--icon"><i className="zmdi zmdi-delete"></i></button>
                    </td>
                </tr>
            </tbody>
        })
        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>User Types List</h1>
                    <div className="actions">

                    <a className="actions__item zmdi zmdi-plus-circle" onClick={this.onToAddNewUser}></a>
                    </div>
                   
                </header>

                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title"></h4>
                        <h6 className="card-subtitle"></h6>

                        <table className="table table-inverse mb-0">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>User Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {userList}
                        </table>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default UserTypesList;