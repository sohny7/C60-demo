import React from "react";
import * as entrepreneurialInfoSkillService from "../../../services/entrepreneurialInfoSkillService";
import swal from "sweetalert2";

class EntrepreneurialInfoSkillsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skill: "",
      listData: []
    };

    this.onChange = this.onChange.bind(this);
    this.editButton = this.editButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.addSkill = this.addSkill.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.value);
  }

  componentDidMount() {
    entrepreneurialInfoSkillService
      .readAll()
      .then(data => {
        this.setState({ listData: data.item });
      })
      .catch(console.log);
  }

  addSkill() {
    this.props.history.push("./edit");
  }

  editButton(id, e) {
    this.props.history.push("./edit/" + id);
  }

  deleteButton(id, e) {
    swal({
      title: "Are you sure you want to delete this entrepreneur skill?",
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
          text: "Entrepreneur skill has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        });
        entrepreneurialInfoSkillService
          .del(id)
          .then(this.getList)
          .catch(console.error);
      }
    });
  }

  render() {
    var mapTheList = this.state.listData.map(item => {
      return (
        <tr key={item.id}>
          <td>{item.skill} </td>
          <td>
            <button
              className="btn btn-light btn--icon"
              onClick={e => this.editButton(item.id, e)}
              style={{ marginRight: "3px" }}
            >
              <span>
                <i className="zmdi zmdi-edit zmdi-hc-fw" />
              </span>
            </button>
            <button
              className="btn btn-light btn--icon"
              onClick={e => this.deleteButton(item.id, e)}
            >
              <span>
                <i className="zmdi zmdi-delete zmdi-hc-fw" />
              </span>
            </button>
          </td>
        </tr>
      );
    });

    return (
      <React.Fragment>
        <section>
          <header className="content__title">
            <h1>Entrepreneurial Info Skills List</h1>
            <div className="actions">
              <a
                classNameName="actions__item zmdi zmdi-plus-circle"
                onClick={this.addSkill}
              />
            </div>
          </header>

          <div className="card">
            <div className="card-body">
              <table className="table table-inverse">
                <thead>
                  <tr>
                    <th> Skills</th>
                    <th> Action</th>
                  </tr>
                </thead>
                <tbody>{mapTheList}</tbody>
              </table>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default EntrepreneurialInfoSkillsList;
