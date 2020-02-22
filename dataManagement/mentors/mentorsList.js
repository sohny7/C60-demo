import React from 'react'; 
import * as mentorsService from "../../../services/mentorsService.js"

class MentorsList extends React.Component { 
    constructor(props) {
        super(props)

        this.state = {
            data: [], 
            checkAll: null
        }

        this.onChange = this.onChange.bind(this); 
        this.onSubmit = this.onSubmit.bind(this); 
        this.onClickStatusChange = this.onClickStatusChange.bind(this); 
        this.onCheckAll = this.onCheckAll.bind(this); 
    }

    componentDidMount() {
        mentorsService.getAll()
            .then(response => {
                this.setState({
                    data: response.item
                })
            })
    }

    onChange(event, index) {
        let obj = JSON.parse(JSON.stringify(this.state.data))

        if (event.target.id === "approve") {
            obj[index].isCheckedApproved = event.target.checked
        } else if (event.target.id === "deny") {
            obj[index].isCheckedDenied = event.target.checked
        }

        this.setState({
            data: obj
        })
    }

    onClickStatusChange(event, id, index) {
        let obj = JSON.parse(JSON.stringify(this.state.data))
        if (event.target.id === "denyBtn" && (obj[index].isMentorApproved === true || obj[index].isMentorApproved === null)) {
            obj[index].isMentorApproved = false
        } else if (event.target.id === "approveBtn" && (obj[index].isMentorApproved === false || obj[index].isMentorApproved === null)) {
            obj[index].isMentorApproved = true
        }
        mentorsService.updateById(obj[index], id)
        .then(
            this.setState({
                data: obj
            })
        )
    }

    onCheckAll() {
        for (var i = 0, item = this.state.data; i < item.length; i++) {
            if (item[i].isMentorApproved === null) {
                item[i].isCheckedApproved = true
            }
        }

        this.setState({
            checkAll: true
        })
    }

    onSubmit() {
        for (var i = 0, item = this.state.data; i < item.length; i++) {
            var itemId = item[i].id;

            if (this.state.data[i].isCheckedApproved === true || this.state.data[i].isCheckedDenied === true) {
                let itemData = this.state.data

                if (itemData[i].isCheckedApproved) {
                    itemData[i].isMentorApproved = true
                } else if (itemData[i].isCheckedDenied) {
                    itemData[i].isMentorApproved = false
                }
                
                mentorsService.updateById(itemData[i], itemId)
                this.setState({
                    data: itemData
                })
            } 
        }
    }

    render() {
        const pending = this.state.data ? this.state.data.map((item, index) => {
            if (item.isMentorApproved === null) {
            return (
                <tbody className="col-xs-6">
                <tr>
                    <td>{item.firstName}</td> 
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td>
                        <label className="custom-control custom-radio">
                            <input type="radio" name={"radio-inline-multiple" + index} className="custom-control-input" id="approve" checked={this.state.checkAll} onChange={e => this.onChange(e, index)} />
                            <span className="custom-control-indicator"></span>
                        </label>
                    </td>
                    <td>
                        <label className="custom-control custom-radio">
                            <input type="radio" name={"radio-inline-multiple" + index} className="custom-control-input" id="deny" onChange={e => this.onChange(e, index)} />
                            <span className="custom-control-indicator"></span>
                        </label>
                    </td>
                    <td>
                        <button className="btn btn-outline-danger" id="denyBtn" onClick={e => this.onClickStatusChange(e, item.id, index)}>Deny</button>
                    </td>
                    <td> 
                        <button className="btn btn-outline-success" id="approveBtn" onClick={e => this.onClickStatusChange(e, item.id, index)}>Approve</button>
                    </td> 
                </tr>
            </tbody>
            )}
        })
        : "is loading"

        const approved = this.state.data ? this.state.data.map((item, index)=> {
            if (item.isMentorApproved === true) {
            return (
                <tbody className="col-xs-6">
                <tr>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td>
                        <button className="btn btn-outline-danger" id="denyBtn" onClick={e => this.onClickStatusChange(e, item.id, index)}>Deny</button>
                    </td>
                </tr>
            </tbody>
            )}
        })
        : "is loading"; 

        const denied = this.state.data ? this.state.data.map((item, index) => {
            if (item.isMentorApproved === false) {
            return (
                <tbody className="col-xs-6">
                <tr>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td> 
                        <button className="btn btn-outline-success" id="approveBtn" onClick={e => this.onClickStatusChange(e, item.id, index)}>Approve</button>
                    </td> 
                </tr>
            </tbody>
            )}
        })
        : "is loading"

        return(
            <React.Fragment> 
            <header className="content__title">
              <h1>Mentors Approval Status</h1>
              <div className="actions">
                <a className="actions__item zmdi zmdi-plus-circle" onClick={this.onAddQuestion} value={this.state.id}></a>
              </div>
            </header>

                <div className="card">
                    <div className="card-body">
                        <div className="tab-container">
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" data-toggle="tab" href="#pending">Pending</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#approved">Approved</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#denied">Denied</a>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="pending" role="tabpanel">
                                    <table className="table table-inverse mb-0">
                                            <thead>
                                                <tr>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Email</th>
                                                    <th>Approve</th>
                                                    <th>Deny</th>
                                                </tr>
                                            </thead>
                                            {pending}
                                    </table>
                                    <br></br>
                                    <button className="btn btn-light btn--icon-text" onClick={this.onSubmit}>Update</button>
                                    <button className="btn btn-light btn--icon-text pull-right" name="checkAll" onClick={this.onCheckAll}>Select All For Approval</button>
                                </div>
                                <div className="tab-pane fade" id="approved" role="tabpanel">
                                    <table className="table table-inverse mb-0">
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Change Status</th>
                                            </tr>
                                        </thead>
                                        {approved}
                                    </table>
                                </div>

                                <div className="tab-pane fade" id="denied" role="tabpanel">
                                    <table className="table table-inverse mb-0" >
                                        <thead>
                                            <tr>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Email</th>
                                                <th>Change Status</th>
                                            </tr>
                                        </thead>
                                        {denied}
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
          </React.Fragment>
        )
    }
}

export default MentorsList 