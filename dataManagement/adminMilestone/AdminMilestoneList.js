import React from "react";
import * as milestoneService from "../../../services/milestoneService";
import swal from "sweetalert2";

class AdminMilestoneList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      milestones: []
    };
    this.onAddClick = this.onAddClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onAddClick(e) {
    e.preventDefault();
    this.props.history.push("/data-management/admin-milestone/form/");
  }

  onItemClick(userId, e) {
    this.props.history.push(`/data-management/admin-milestone/form/${userId}`);
  }

  componentDidMount() {
    const promise = milestoneService.readAllMilestones();
    return promise.then(response => {
      this.setState({
        milestones: response.items
      });
    });
  }

  onDelete(id, e) {
    const promise = swal({
      title: "Are you sure you want to delete this milestone?",
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
          text: "Milestone has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        })
          .then(() => {
            return milestoneService.deleteMilestoneById(id, e);
          })
          .then(() => {
            return milestoneService.readAllMilestones();
          })
          .then(response => {
            this.setState({ milestones: response.items });
          })
          .catch(console.log);
      }
    });
    return promise;
  }

  render() {
    const milestoneList =
      this.state.milestones &&
      this.state.milestones.map(item => {
        if (!item.isCustomCreateByMentor) {
          return (
            <tbody key={item.id}>
              <tr style={{ whiteSpace: "nowrap" }}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-light btn--icon"
                    onClick={e => {
                      this.onItemClick(item.id, e);
                    }}
                    style={{ marginRight: "3px" }}
                  >
                    <i className="zmdi zmdi-edit zmdi-hc-fw" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn--icon"
                    onClick={e => {
                      this.onDelete(item.id, e);
                    }}
                  >
                    <i className="zmdi zmdi-delete zmdi-hc-fw" />
                  </button>
                </td>
              </tr>
            </tbody>
          );
        }
      });

    const mentorMilestoneList =
      this.state.milestones &&
      this.state.milestones.map(item => {
        if (item.isCustomCreateByMentor) {
          return (
            <tbody key={item.id}>
              <tr style={{ whiteSpace: "nowrap" }}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-light btn--icon"
                    onClick={e => {
                      this.onItemClick(item.id, e);
                    }}
                    style={{ marginRight: "3px" }}
                  >
                    <i className="zmdi zmdi-edit zmdi-hc-fw" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn--icon"
                    onClick={e => {
                      this.onDelete(item.id, e);
                    }}
                  >
                    <i className="zmdi zmdi-delete zmdi-hc-fw" />
                  </button>
                </td>
              </tr>
            </tbody>
          );
        }
      });

    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Milestone List</h1>
          <div className="actions">
            <a
              onClick={this.onAddClick}
              className="actions__item zmdi zmdi-plus-circle"
            />
          </div>
        </header>

        <div className="card">
          <div className="card-profile">
            <div className="tab-container">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#about"
                    role="tab"
                    aria-expanded="true"
                  >
                    Admin Milestones
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#photos"
                    role="tab"
                    aria-expanded="false"
                  >
                    Mentor Milestones
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div
                  className="tab-pane fade active show"
                  id="about"
                  role="tabpanel"
                  aria-expanded="true"
                >
                  <div className="card-body">
                    <table className="table table-inverse mb-0">
                      <thead>
                        <tr>
                          <th>Milestone Id</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      {milestoneList}
                    </table>
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="photos"
                  role="tabpanel"
                  aria-expanded="false"
                >
                  <div className="card-body">
                    <table className="table table-inverse mb-0">
                      <thead>
                        <tr>
                          <th>Milestone Id</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      {mentorMilestoneList}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default AdminMilestoneList;
