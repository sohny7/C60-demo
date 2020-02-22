import React from "react";
import { Pagination } from "react-bootstrap";
import * as workshopEventsServices from "../../../services/workshopEventsServices";
import swal from "sweetalert2";

class WorkshopEventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsArray: props.eventsArray.pagedItems,
      pageIndex: props.eventsArray.pageIndex,
      totalPages: props.eventsArray.totalPages,
      deleteNotice: false,
      id: ""
    };
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNextPageList = this.onNextPageList.bind(this);
    this.onLastPageList = this.onLastPageList.bind(this);
    this.onPrevPageList = this.onPrevPageList.bind(this);
    this.onFirstPageList = this.onFirstPageList.bind(this);
    this.onNumberPageList = this.onNumberPageList.bind(this);
    this.toForm = this.toForm.bind(this);
  }

  toForm() {
    this.props.history.push("/data-management/workshopevents/edit");
  }
  onEdit(id, e) {
    this.props.history.push("/data-management/workshopevents/edit/" + id);
  }

  onDelete(id, e) {
    swal({
      title: "Are you sure you want to delete this workshop event?",
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
          text: "Workshop event has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        });
    workshopEventsServices
      .deleteWorkshopEvent(id)
      .then(() => {
        return workshopEventsServices.getAll()})
      .then(response => {
            this.setState({
              eventsArray: response.pagedItems
            });
          })
        }})
      .catch(console.error);
    
  }


  onNextPageList() {
    let pageIndex = this.state.pageIndex;
    let pageSize = 5;
    pageIndex++;
    workshopEventsServices
      .getAllPagination(pageIndex, pageSize)
      .then(response => {
        this.setState({
          eventsArray: response.pagedItems,
          pageIndex: response.pageIndex
        });
      })
      .catch(console.error);
  }

  onLastPageList() {
    let pageIndex = this.state.totalPages - 1;
    let pageSize = 5;
    workshopEventsServices
      .getAllPagination(pageIndex, pageSize)
      .then(response => {
        this.setState({
          eventsArray: response.pagedItems,
          pageIndex: response.pageIndex
        });
      })
      .catch(console.error);
  }

  onPrevPageList() {
    let pageIndex = this.state.pageIndex;
    let pageSize = 5;
    pageIndex--;
    workshopEventsServices
      .getAllPagination(pageIndex, pageSize)
      .then(response => {
        this.setState({
          eventsArray: response.pagedItems,
          pageIndex: response.pageIndex
        });
      })
      .catch(console.error);
  }

  onFirstPageList() {
    let pageIndex = 0;
    let pageSize = 5;
    workshopEventsServices
      .getAllPagination(pageIndex, pageSize)
      .then(response => {
        this.setState({
          eventsArray: response.pagedItems,
          pageIndex: response.pageIndex
        });
      })
      .catch(console.error);
  }

  onNumberPageList(pageNumber) {
    let pageIndex = pageNumber - 1;
    let pageSize = 5;
    workshopEventsServices
      .getAllPagination(pageIndex, pageSize)
      .then(response => {
        this.setState({
          eventsArray: response.pagedItems,
          pageIndex: response.pageIndex
        });
      })
      .catch(console.error);
  }

  render() {
    const overflowSettings = {
      whiteSpace: "nowrap",
      maxWidth: "50px",
      overflow: "hidden",
      textOverflow: "ellipsis"
    };
    let items = [];
    for (let number = 1; number <= this.state.totalPages; number++) {
      items.push(
        <li className="page-item" key={number}>
          <a
            className="page-link"
            onClick={e => {
              this.onNumberPageList(number, e);
            }}
          >
            {number}
          </a>
        </li>
      );
    }
    const paginationTemplate = (
      <div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item pagination-first">
              <a className="page-link" onClick={this.onFirstPageList} />
            </li>
            <li className="page-item pagination-prev">
              <a className="page-link" onClick={this.onPrevPageList} />
            </li>
            {items}
            <li className="page-item pagination-next">
              <a className="page-link" onClick={this.onNextPageList} />
            </li>
            <li className="page-item pagination-last">
              <a className="page-link" onClick={this.onLastPageList} />
            </li>
          </ul>
        </nav>
      </div>
    );
    const eventsList = this.state.eventsArray
      ? this.state.eventsArray.map(events => {
          return (
            <tr key={events.id}>
              <th scope="row">{events.id}</th>
              <th style={overflowSettings}>{events.title}</th>
              <th style={overflowSettings}>{events.host}</th>
              <th style={overflowSettings}>{events.description}</th>
              <th style={overflowSettings}>{events.addressId}</th>
              <th style={overflowSettings}>{events.startTime}</th>
              <th style={overflowSettings}>{events.endTime}</th>
              <th style={overflowSettings}>{events.url}</th>
              <th style={overflowSettings}>{events.imageUrl}</th>
              <th style={overflowSettings}>
                {events.isRegistered ? "True" : "False"}
              </th>
              <th style={overflowSettings}>{events.dateCreated}</th>
              <th style={overflowSettings}>{events.dateModified}</th>
              <th style={{ textAlign: "center", padding: "0" }}>
                <button
                  className="btn btn-light btn--icon"
                  style={{ marginRight: "3px" }}
                >
                  <i
                    className="zmdi zmdi-edit zmdi-hc-lg"
                    onClick={e => {
                      this.onEdit(events.id, e);
                    }}
                  />
                </button>
                <button className="btn btn-light btn--icon">
                  <i
                    className="zmdi zmdi-delete zmdi-hc-lg"
                    onClick={e => {this.onDelete(events.id, e)}}
                  />
                </button>
              </th>
            </tr>
          );
        })
      : "is loading...";
    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Workshops/Events</h1>

          <div className="actions">
            <a
              className="actions__item zmdi zmdi-plus-circle"
              onClick={this.toForm}
            />
          </div>
        </header>
        <div className="card">
          <div className="card-body">
            <table className="table table-inverse mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Host</th>
                  <th>Description</th>
                  <th>Address Id</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>URL</th>
                  <th>Image URL</th>
                  <th>Is Registered?</th>
                  <th>Date Created</th>
                  <th>Date Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsList}
              </tbody>
            </table>
          </div>
          {paginationTemplate}
        </div>
      </React.Fragment>
    );
  }
}

export default WorkshopEventsList;
