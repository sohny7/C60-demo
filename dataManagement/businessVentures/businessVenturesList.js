import React, { Component } from "react";
import * as businessVentureService from "../../../services/businessVentureService";
import swal from "sweetalert2";

class BusinessVenturesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onToEditForm = this.onToEditForm.bind(this);
  }

  componentDidMount() {
    businessVentureService.read().then(response => {
      let arr = response.items;
      this.setState({
        list: arr
      });
    });
  }

  onEdit(id) {
    businessVentureService.getById(id);
    this.props.history.push("/data-management/businessVentures/edit/" + id);
  }

  onDelete(id) {
    swal({
      title: "Are you sure you want to delete this business venture?",
      text: "You won't be able to recover this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: '#7ac7f6',
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it!",
      background: '#0f2940'
    }).then(result => {
      if (result.value) {
        swal({
          title: "Deleted!",
          text: "Business venture has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        });
        businessVentureService
          .del(id)
          .then(businessVentureService.read)
          .then(response => {
            this.setState({
              list: response.items
            });
          })
          .catch(console.error);
      }
    });
  }

  onToEditForm() {
    this.props.history.push("/data-management/businessVentures/edit");
  }

  isMentored(item) {
    return item.isMentored === true ? (
      <span className="badge badge-info">Mentored</span>
    ) : (
      ""
    );
  }

  render() {
    const list = this.state.list.map(item => {
      return (
        <tbody key={item.id}>
          <tr>
            <td>{item.userId}</td>
            <td>{item.statusId}</td>
            <td>{item.name}</td>
            <td>{this.isMentored(item)}</td>
            <td>{item.annualBusinessIncome}</td>
            <td>{item.yearsInBusiness}</td>
            <td>{item.industry}</td>
            <td style={{ padding: "0" }}>
              <button
                onClick={e => this.onEdit(item.id, e)}
                className="btn btn-light btn--icon"
                style={{ marginRight: "3px" }}
              >
                <i className="zmdi zmdi-edit" />
              </button>

              <button
                onClick={e => this.onDelete(item.id, e)}
                className="btn btn-light btn--icon"
              >
                <i className="zmdi zmdi-delete" />
              </button>
            </td>
          </tr>
        </tbody>
      );
    });

    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Business Venture List</h1>
          <div className="actions">
            <a
              className="actions__item zmdi zmdi-plus-circle"
              onClick={this.onToEditForm}
            />
            {/* <div className="col-sm-4" style={{float: "left", fontSize: 25}} onClick={e => this.onToEditForm(e)} data-name="plus-circle-o" data-code="f275"><span><i className="zmdi zmdi-plus-circle-o zmdi-hc-fw"></i></span></div> */}
          </div>
        </header>

        <div className="card">
          <div className="card-body">
            <h4 className="card-title" />
            <h6 className="card-subtitle" />

            <table className="table table-inverse mb-0">
              <thead>
                <tr>
                  <th>User Id</th>
                  <th>Status Id</th>
                  <th>Name</th>
                  <th>Mentored</th>
                  <th>Annual Business Income</th>
                  <th>Years In Business</th>
                  <th>Industry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {list}
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BusinessVenturesList;
