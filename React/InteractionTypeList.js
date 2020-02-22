import React from "react";
import swal from "sweetalert2";
import * as interactionTypeService from "../../../services/interactionTypeService";

class InteractionTypeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      selectedItem: null,
      show: false
    };

    this.addType = this.addType.bind(this);
    this.deleteType = this.deleteType.bind(this);
    this.getList = this.getList.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick(id, e) {
    this.setState({ selectedItem: id });
    console.log(id);
    this.onClick(id);
  }

  onClick(id, e) {
    this.props.history.push("/data-management/interactionType/edit/" + id);
  }

  addType() {
    this.props.history.push("/data-management/interactionType/edit");
  }

  deleteType(id) {
    swal({
      title: "Are you sure you want to delete this interaction type?",
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
        interactionTypeService
          .del(id)
          .then(() => {
            swal({
              title: "Deleted!",
              text: "Iteraction type has been deleted.",
              type: "success",
              background: '#0f2940',
              confirmButtonColor: '#7ac7f6'
            });
          })
          .then(() => {
            this.getList();
          })
          .catch(console.log("error"));
      } 
    });
  }

  editButton(item) {
    return (
      <button
        className="btn btn-light btn--icon"
        style={{ marginRight: "3px" }}
      >
        <span>
          <i
            name="edit"
            key={item.id}
            className="actions__item zmdi zmdi-edit zmdi-hc-fw"
            onClick={e => this.onItemClick(item.id, e)}
          />
        </span>
      </button>
    );
  }

  deleteButton(item) {
    return (
      <button className="btn btn-light btn--icon">
        <span>
          <i
            name="delete"
            key={item.id}
            className="actions__item zmdi zmdi-delete zmdi-hc-fw"
            onClick={e => this.deleteType(item.id)}
          />
        </span>
      </button>
    );
  }

  getList() {
    interactionTypeService.getAll().then(data => {
      this.setState({
        list: data.items
      });
    });
  }

  componentDidMount() {
    interactionTypeService.getAll().then(data => {
      this.setState({
        list: data.items
      });
    });
  }

  render() {
    const list = this.state.list
      ? this.state.list.map(item => {
          return (
            <tr key={item.id}>
              <th scope="row">{item.id}</th>
              <td>{item.typeName}</td>
              <td>
                {this.editButton(item)}
                {this.deleteButton(item)}
              </td>
            </tr>
          );
        })
      : "is loading";
    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Interaction Type List</h1>
          <div className="actions">
            <a
              className="actions__item zmdi zmdi-plus-circle"
              onClick={this.addType}
            />
          </div>
        </header>
        <div className="card">
          <div className="card-body">
            <table className="table table-inverse mb-0">
              <thead>
                <tr>
                  <th>Id#</th>
                  <th>Interaction Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{list}</tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default InteractionTypeList;
