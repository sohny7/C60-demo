import React from "react";
import * as userProfileInfoService from "../../../services/userProfileInfoService";
import swal from "sweetalert2";
import * as moment from "moment";

class UserProfileInfoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };

    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteModal = this.onDeleteModal.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onViewProfile = this.onViewProfile.bind(this);
  }
  componentDidMount() {
    userProfileInfoService
      .readAll()
      .then(responseData => {
        console.log(responseData.items);
        this.setState({
          list: responseData.items
        });
      })
      .catch(console.log);
  }

  onDeleteModal(id, e) {
    const promise = swal({
      title: "Are you sure you want to delete this user profile?",
      text: "You won't be able to recover this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: '#7ac7f6',
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it!",
      background: '#0f2940'
    });
    return promise.then(result => {
      if (result.value) {
        swal({
          title: "Deleted!",
          text: "User profile has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        })
          .then(() => {
            const promise = userProfileInfoService.del(id, e);
            return promise;
          })
          .then(() => {
            const promise = userProfileInfoService.readAll();
            return promise;
          })
          .then(responseData => {
            this.setState({ list: responseData.items });
          })
          .catch(console.log);
      }
    });
  }

  onItemClick(userId, e) {
    this.props.history.push("/user/form/" + userId);
    console.log(userId);
  }

  onAddClick(e) {
    e.preventDefault();
    this.props.history.push("/user/form/");
  }

  onViewProfile(id, e) {
    this.props.history.push("/user-profile/" + id);
  }

  render() {
    const list =
      this.state.list &&
      this.state.list.map(item => {
        return (
          <tbody key={item.id}>
            <tr style={{ whiteSpace: "nowrap" }}>
              <td>{item.id}</td>
              <td>{item.userId}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-light btn--icon"
                  onClick={e => {
                    this.onViewProfile(item.userId, e);
                  }}
                >
                  <i className="zmdi zmdi-account zmdi-hc-fw" />
                </button>
              </td>
              <td>
                <img
                  src={`${item.imageUrl}`}
                  height={75}
                  style={{ maxWidth: "75px" }}
                />
              </td>
              <td>
                {moment(item.dob)
                  .utc()
                  .format("MM-DD-YYYY")}
              </td>
              <td>{item.raceEthnicityId}</td>
              <td>{item.levelOfEducationId}</td>
              <td>{item.householdIncome}</td>
              <td>{item.yearsInBusiness}</td>
              <td
                style={{
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {item.bio}
              </td>
              <td>
                <button
                  style={{ marginRight: "3px" }}
                  type="button"
                  className="btn btn-light btn--icon"
                  onClick={e => {
                    this.onItemClick(item.userId, e);
                  }}
                >
                  <i className="zmdi zmdi-edit zmdi-hc-fw" />
                </button>
                <button
                  type="button"
                  className="btn btn-light btn--icon"
                  onClick={e => {
                    this.onDeleteModal(item.id, e);
                  }}
                >
                  <i className="zmdi zmdi-delete zmdi-hc-fw" />
                </button>
              </td>
            </tr>
          </tbody>
        );
      });

    return (
      <React.Fragment>
        <header className="content__title">
          <h1>User Profile Information List</h1>

          <div className="actions">
            <a
              onClick={this.onAddClick}
              className="actions__item zmdi zmdi-plus zmdi-hc-fw"
            />
          </div>
        </header>

        <div className="card">
          <div className="card-body">
            <table className="table table-inverse mb-0">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>User Id</th>
                  <th>View User Profile</th>
                  <th>Image</th>
                  <th>Date of Birth</th>
                  <th>Race Ethnicity</th>
                  <th>Level of Education</th>
                  <th>Household Income</th>
                  <th>Years in Business</th>
                  <th>Bio</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {list.reverse(list)}
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfileInfoList;
