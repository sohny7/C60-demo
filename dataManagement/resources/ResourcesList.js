import React, { Component } from "react";
import swal from "sweetalert2";
import * as resourceService from "../../../services/resourceService";

const img = {
  width: "25px",
  height: "25px"
};

const overflowSettings = {
  whiteSpace: "nowrap",
  maxWidth: "120px",
  paddingLeft: "10px",
  paddingRight: "10px",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

class ResourcesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      selectedItem: null,
      show: false,
      pageIndex: 0,
      pageSize: 8,
      totalCount: 0,
      id: ""
    };

    this.addAccount = this.addAccount.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
    this.getList = this.getList.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onPagination = this.onPagination.bind(this);
  }

  toProfilePage(id, e) {
    this.props.history.push("/resource-provider-profile/" + id);
    console.log(id);
  }

  imgNullCheck(item) {
    return item.imageUrl === null
      ? "http://www.bsmc.net.au/wp-content/uploads/No-image-available.jpg"
      : item.imageUrl;
  }

  onItemClick(id, e) {
    e.stopPropagation();
    this.setState({ selectedItem: id });
    console.log(id);
    this.onClick(id);
  }

  onClick(id, e) {
    this.props.history.push("/data-management/resources/form/" + id);
  }

  addAccount() {
    this.props.history.push("/data-management/resources/form");
  }

  getList() {
    resourceService.getAll().then(data => {
      this.setState({
        list: data.items
      });
    });
  }

  onPagination(e) {
    let pageClick = e.target.id;
    let pageIndex = this.state.pageIndex;
    let lastPage = this.state.totalPages;
    let pageDefault = 0;

    if (pageClick === "first") {
      pageIndex = pageDefault;
      this.setState({ pageIndex: pageDefault });
    } else if (pageClick === "next") {
      pageIndex = pageIndex + 1;
      if (pageIndex >= lastPage) pageIndex = lastPage;
      this.setState({ pageIndex: pageIndex });
    } else if (pageClick === "prev") {
      pageIndex = pageIndex - 1;
      if (pageIndex <= 0) pageIndex = pageDefault;
      this.setState({ pageIndex: pageIndex });
    } else if (pageClick === "last") {
      pageIndex = lastPage;
      this.setState({ pageIndex: pageIndex });
    }
    this.showListPaged(pageIndex, this.state.pageSize);
  }

  showListPaged(index, size) {
    const pageSize = this.state.pageSize;
    resourceService
      .getByPage(index, pageSize)
      .then(response => {
        const totalCount = response.items[0].totalCount;
        const totalPages = Math.ceil(totalCount / pageSize - 1);
        this.setState({
          resources: response.items,
          pageIndex: index,
          totalPages: totalPages
        });
      })
      .catch(response => console.log(response));
  }

  deleteProfile(id, e) {
    e.stopPropagation();
    swal({
      title: "Are you sure you want to delete this resource?",
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
        resourceService
          .del(id)
          .then(() => {
            swal({
              title: "Deleted!",
              text: "Resource has been deleted.",
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

  deleteButton(item, e) {
    return (
      <button className="btn btn-light btn--icon">
        <span>
          <i
            name="delete"
            key={item.id}
            className="actions__item zmdi zmdi-delete zmdi-hc-fw"
            onClick={e => this.deleteProfile(item.id, e)}
          />
        </span>
      </button>
    );
  }

  componentDidMount() {
    this.showListPaged(this.state.pageIndex, this.state.pageSize);
  }

  showListPaged(index, size) {
    const pageSize = this.state.pageSize;
    resourceService
      .getByPage(index, pageSize)
      .then(response => {
        const totalCount = response.items[0].totalCount;
        const totalPages = Math.ceil(totalCount / pageSize - 1);
        this.setState({
          list: response.items,
          pageIndex: index,
          totalPages: totalPages
        });
      })
      .catch(response => console.log(response));
  }

  render() {
    const list = this.state.list
      ? this.state.list.map(item => {
          return (
            <tr
              style={overflowSettings}
              key={item.id}
              onClick={e => this.toProfilePage(item.id, e)}
            >
              <th style={{ maxWidth: "50px" }} scope="row">
                {item.id}
              </th>
              <td style={overflowSettings}>{item.companyName}</td>
              <td style={overflowSettings}>{item.description}</td>
              <td style={overflowSettings}>{item.contactName}</td>
              <td style={overflowSettings}>{item.contactEmail}</td>
              <td style={overflowSettings}>{item.businessTypeId}</td>
              <td style={overflowSettings}>
                <img
                  style={img}
                  className="mr-3 pull-left"
                  src={this.imgNullCheck(item)}
                  alt=""
                />
              </td>
              <td style={overflowSettings}>
                <a href={item.siteUrl}>{item.siteUrl}</a>
              </td>
              <td style={overflowSettings}>{item.phone}</td>
              <td style={overflowSettings}>
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
          <h1>Resources</h1>
          <div className="actions">
            <i
              className="actions__item zmdi zmdi-plus-circle"
              onClick={this.addAccount}
            />
          </div>
        </header>
        <div className="card">
          <div className="card-body">
            <table class="table table-inverse mb-0">
              <thead>
                <tr>
                  <th>Id#</th>
                  <th>CompanyName</th>
                  <th>Description</th>
                  <th>Contact Name</th>
                  <th>Contact Email</th>
                  <th>Business Type</th>
                  <th>Image</th>
                  <th>Website</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{list}</tbody>
            </table>
            <br />
            <br />
            <nav>
              <ul className="pagination justify-content-center">
                <li className="page-item pagination-first">
                  <span
                    className="page-link"
                    id="first"
                    onClick={e => this.onPagination(e)}
                  />
                </li>
                <li className="page-item pagination-prev">
                  <span
                    className="page-link"
                    id="prev"
                    onClick={e => this.onPagination(e)}
                  />
                </li>
                <li className="page-item">
                  <span className="page-link" href="#">
                    {this.state.pageIndex + 1}
                  </span>
                </li>
                <li className="page-item pagination-next">
                  <span
                    className="page-link"
                    id="next"
                    onClick={e => this.onPagination(e)}
                  />
                </li>
                <li className="page-item pagination-last">
                  <span
                    className="page-link"
                    id="last"
                    onClick={e => this.onPagination(e)}
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ResourcesList;
