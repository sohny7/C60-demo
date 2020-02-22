import React from "react";
import swal from "sweetalert2";
import * as entrepreneurServices from "../../../services/entrepreneurialInfoServices";

class EntrepreneurialList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      show: false
    };
    this.onEditIconClick = this.onEditIconClick.bind(this);
    this.onDeleteIconClick = this.onDeleteIconClick.bind(this);
    this.onAddIconClick = this.onAddIconClick.bind(this);
  }

  onAddIconClick(e) {
    e.preventDefault();
    this.props.history.push("entrepreneurial-form");
  }

  onEditIconClick(id, e) {
    e.preventDefault();
    console.log(id);
    this.props.history.push("/entrepreneurial-form/" + id);
  }

  onDeleteIconClick(id, e) {
    e.preventDefault();
    console.log(id);
    swal({
      title: "Are you sure you want to delete this entrepreneur?",
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
        entrepreneurServices
          .del(id)
          .then(response => {
            console.log(response);
            return entrepreneurServices.readAll();
          })
          .then(response => {
            let arr = response.items;
            this.setState({
              list: arr
            });
          })
          .catch(console.log("error"));
        swal({
          title: "Deleted!",
          text: "Entrepreneur has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        });
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal("Cancelled");
      }
    });
  }

  componentDidMount() {
    entrepreneurServices
      .readAll()
      .then(response => {
        let arr = response.items;
        this.setState({ list: arr });
      })
      .catch();
  }

  render() {
    const overflowSettings = {
      whiteSpace: "nowrap",
      maxWidth: "85px",
      overflow: "hidden",
      textOverflow: "ellipsis"
    };
    const data = this.state.list;
    var listItems = data.map(d => {
      return (
        <tr>
          <th scope="row" style={overflowSettings}>
            {d.id}
          </th>
          <td style={overflowSettings}>
            {d.businessIndustryId === 1
              ? "Retail"
              : d.businessIndustryId === 2
                ? "Finance"
                : d.businessIndustryId === 3
                  ? "Transportation"
                  : d.businessIndustryId === 4
                    ? "Construction"
                    : "Other"}
          </td>
          <td style={overflowSettings}>
            {d.mentor === 1 ||
            d.mentor === true ||
            d.mentor === "true" ||
            d.mentor === "1"
              ? "YES"
              : "NO"}
          </td>
          <td style={overflowSettings}>
            {d.trainingMilestonesId === 1
              ? "Workshops."
              : d.trainingMilestonesId === 2
                ? "Training Programs."
                : d.trainingMilestonesId === 3
                  ? "Pitched Business."
                  : "Obtained Funding"}
          </td>
          <td style={overflowSettings}>
            {d.businessStatusId === 1
              ? "I need help."
              : d.businessStatusId === 2
                ? "Beta Tested"
                : d.businessStatusId === 3
                  ? "MVP"
                  : d.businessStatusId === 4
                    ? "Generating Revenue."
                    : "Growth"}
          </td>
          <td style={overflowSettings}>{d.userId}</td>
          <td style={overflowSettings}>
            {d.hasSecurityClearence === true ||
            d.hasSecurityClearence === "true" ||
            d.hasSecurityClearence === 1 ||
            d.hasSecurityClearence === "1"
              ? "YES"
              : "NO"}
          </td>
          <td style={overflowSettings}>
            {d.hasInsurance === true ||
            d.hasInsurance === "true" ||
            d.hasInsurance === 1 ||
            d.hasInsurance === "1"
              ? "YES"
              : "NO"}
          </td>
          <td style={overflowSettings}>
            {d.hasBonds === true ||
            d.hasBonds === "true" ||
            d.hasBonds === 1 ||
            d.hasBonds === "1"
              ? "YES"
              : "NO"}
          </td>
          <td style={overflowSettings}>{d.specializedEquipment}</td>
          <td style={overflowSettings}>{d.skills}</td>
          <td style={{ padding: "0" }}>
            <button
              class="btn btn-light btn--icon"
              data-name="edit"
              data-code="f158"
              onClick={e => this.onEditIconClick(d.id, e)}
            >
              <i class="zmdi zmdi-edit zmdi-hc-fw" />
            </button>
            <button
              class="btn btn-light btn--icon"
              data-name="delete"
              data-code="f154"
              onClick={e => this.onDeleteIconClick(d.id, e)}
              id="sa-warning"
              style={{ marginRight: "3px" }}
            >
              <i class="zmdi zmdi-delete zmdi-hc-fw" />
            </button>
          </td>
        </tr>
      );
    });
    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Entrepreneurial List</h1>

          <div className="actions">
            <a
              className="actions__item zmdi zmdi-plus-circle"
              onClick={this.onAddIconClick}
            />
          </div>
        </header>

        <div class="card">
          <div class="card-body">
            <table class="table table-inverse mb-0">
              <thead>
                <tr>
                  <th style={overflowSettings}>#</th>
                  <th style={overflowSettings}>Industry</th>
                  <th style={overflowSettings}>Mentor</th>
                  <th style={overflowSettings}>Training</th>
                  <th style={overflowSettings}>Status</th>
                  <th style={overflowSettings}>User ID</th>
                  <th style={overflowSettings}>Cleared</th>
                  <th style={overflowSettings}>Insured</th>
                  <th style={overflowSettings}>Bonds</th>
                  <th style={overflowSettings}>Specialized Equipment</th>
                  <th style={overflowSettings}>Skills</th>
                  <th style={overflowSettings}>Action</th>
                </tr>
              </thead>
              <tbody>{listItems}</tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default EntrepreneurialList;
