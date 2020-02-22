import React, { Component } from 'react'
import * as surveySectionsService from "../../../services/surveySectionsService";
import swal from "sweetalert2";

class SurveySectionList extends Component {
  constructor(props) {
    super(props)

    this.state= {
      surveys: [],
      pageIndex: 0, //default page 
      pageSize: 8, //default size
      totalPages: 0,
    }

    this.onEditClick = this.onEditClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.delModal = this.delModal.bind(this);
    this.addForm = this.addForm.bind(this);
    this.pagination = this.pagination.bind(this);
  }

  componentDidMount() {
    this.showListPaged(this.state.pageIndex, this.state.pageSize)
  }

  showListPaged(index, size) {
    const pageSize = this.state.pageSize;
    surveySectionsService.readAll_Paged(index, pageSize)
      .then(response => {
        const totalCount = response.items[0].totalCount;
        const totalPages = Math.ceil(totalCount / pageSize - 1);
        this.setState({ surveys: response.items, pageIndex: index, totalPages: totalPages})
      })
      .catch(response => console.log(response))
  }

  pagination(e) {
    let pageClick = e.target.id; 
    let pageIndex = this.state.pageIndex; 
    let lastPage = this.state.totalPages;
    let pageDefault = 0; 

    if (pageClick === "first") {
      pageIndex = pageDefault
      this.setState({ pageIndex: pageDefault })
    } else if (pageClick === "next") {
      pageIndex = pageIndex + 1;
      if (pageIndex >= lastPage) pageIndex = lastPage;
      this.setState({ pageIndex: pageIndex })
    } else if (pageClick === "prev") {
      pageIndex = pageIndex - 1;
      if (pageIndex <= 0) pageIndex = pageDefault;
      this.setState({ pageIndex: pageIndex })
    } else if (pageClick === "last") {
      pageIndex = lastPage;
      this.setState({ pageIndex: pageIndex })
    }
    this.showListPaged(pageIndex, this.state.pageSize)
  }

  onEditClick(e, id) {
    e.preventDefault();
    this.props.history.push("/data-management/survey-section/edit/" + id)
  }

  onDelete(e, id) {
    surveySectionsService.del(id)
      .then(response => { console.log("You have deleted entry #" + id, response) })
      .then(this.showListPaged(this.state.pageIndex, this.state.pageSize))
      .catch(response => console.log(response))
  }

  delModal(e, id) {
    swal({
      title: "Are you sure you want to delete this survey section?",
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
        this.onDelete(e, id)
        swal({
          title: "Deleted!",
          text: "Survey section has been deleted.",
          type: "success",
          background: '#0f2940',
          confirmButtonColor: '#7ac7f6'
        })
      }
    })
  }

  addForm() { this.props.history.push("/data-management/survey-section/edit");  }
  
  render() {
    const surveyList = this.state.surveys.map(item => {
      return (
          <tr key={item.id}>
            <th scope="row" id={item.id}>{item.survey}</th>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{item.sortOrder}</td>
            <td>
              <div className="btn inline">
              <button onClick={e => this.onEditClick(e, item.id)} className="btn btn-light btn--icon"><i className="zmdi zmdi-edit"></i></button>
              &nbsp;<button onClick={e => this.delModal(e, item.id)} className="btn btn-light btn--icon"><i className="zmdi zmdi-delete"></i></button>
            </div>
            </td>
          </tr>
      )
    })
    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Home</h1>

          <div className="actions">
            <a className="actions__item zmdi zmdi-plus" onClick={this.addForm}></a>
          </div>
        </header>

        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Title goes here</h4>
            <h6 className="card-subtitle">Subtitle goes here</h6>
            {/* -------------------------------------------------------- */}
            <div>
              <div className="card">
                <div className="card-body" >
                  <table className="table table-inverse mb-0">
                    <thead>
                      <tr>
                        <th>Survey</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Sort Order</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        {surveyList}
                    </tbody>
                  </table>
                  <br/><br/>
                  <nav>
                    <ul className ="pagination justify-content-center">
                      <li className ="page-item pagination-first"><span className="page-link" id="first" onClick={e => this.pagination(e)}></span></li>
                      <li className ="page-item pagination-prev"><span className="page-link" id="prev" onClick={e => this.pagination(e)}></span></li>
                      {/* <li className ="page-item"><span className="page-link" href="#">1</span></li> */}
                      <li className ="page-item"><span className="page-link" href="#">{this.state.pageIndex+1}</span></li>
                      {/* <li className ="page-item"><span className="page-link" href="#">3</span></li> */}
                      <li className ="page-item pagination-next"><span className="page-link" id="next" onClick={e => this.pagination(e)}></span></li>
                      <li className ="page-item pagination-last"><span className="page-link" id="last" onClick={e => this.pagination(e)}></span></li>
                    </ul>
                  </nav>

                </div>
              </div>
            </div>
          </div>
        </div>

      </React.Fragment>
    )
  }
}

export default SurveySectionList;
