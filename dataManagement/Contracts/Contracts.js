import React from "react";
import * as contractService from "../../../services/contracts/contractsService";
import ListTemplate from "./ListTemplate";
import swal from "sweetalert2";

class Contracts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      returnData: [],
      pageSize: 5,
      pageIndex: 0,
      totalCount: 0,
      totalPages: 0
    };

    this.deleteBtn = this.deleteBtn.bind(this);
    this.editBtn = this.editBtn.bind(this);
    this.addContract = this.addContract.bind(this);
    this.nextBtn = this.nextBtn.bind(this);
    this.prevBtn = this.prevBtn.bind(this);
    this.firstBtn = this.firstBtn.bind(this);
    this.lastBtn = this.lastBtn.bind(this);
  }

  prevBtn() {
    let index = this.state.pageIndex - 1;
    if (!this.state.pageIndex == 0) {
      this.setState({
        pageIndex: index
      });
      this.readAllPaged(index, this.state.pageSize);
    }
  }

  firstBtn() {
    this.setState({
      pageIndex: 0
    });
    this.readAllPaged(0, this.state.pageSize);
  }

  lastBtn() {
    this.setState({
      pageIndex: this.state.totalPages
    });
    this.readAllPaged(this.state.totalPages, this.state.pageSize);
  }

  nextBtn() {
    let index = this.state.pageIndex + 1;
    if (index < this.state.totalPages) {
      this.setState({
        pageIndex: index
      });
      this.readAllPaged(index, this.state.pageSize);
    }
  }

  componentDidMount() {
    this.readAllPaged(this.state.pageIndex, this.state.pageSize);
  }

  readAllPaged(pageIndex, pageSize) {
    contractService
      .pagination(pageIndex, pageSize)
      .then(responseData => {
        let totalCount = responseData.items[0].totalCount;
        let totalPages = Math.ceil(totalCount / pageSize);
        this.setState({
          returnData: responseData.items,
          totalCount: totalCount,
          totalPages: totalPages - 1
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  addContract() {
    this.props.history.push("/data-management/Contracts/ContractsForm");
  }

  editBtn(id, e) {
    this.props.history.push("/data-management/Contracts/ContractsForm/" + id);
  }

  deleteBtn(id, e) {
    swal({
      title: "Are you sure you want to delete this contract?",
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
        contractService
          .deleteById(id)
          .then(() => {
            swal({
              title: "Deleted!",
              text: "Contract has been deleted.",
              type: "success",
              background: '#0f2940',
              confirmButtonColor: '#7ac7f6'
            });
            contractService
              .pagination(this.state.pageIndex, this.state.pageSize)
              .then(responseData => {
                this.setState({ returnData: responseData.items });
              })
              .catch(console.error);
          })

          .catch(error => {
            alert(error);
          });
      }
    });
  }

  render() {
    const firstButton =
      this.state.pageIndex > 0 ? (
        <li className="page-item pagination-first" onClick={this.firstBtn}>
          <a className="page-link" />
        </li>
      ) : (
        <li
          className="page-item pagination-first disabled"
          onClick={this.firstBtn}
        >
          <a className="page-link" />
        </li>
      );

    const prevButton =
      this.state.pageIndex > 0 ? (
        <li className="page-item pagination-prev" onClick={this.prevBtn}>
          <a className="page-link" />
        </li>
      ) : (
        <li
          className="page-item pagination-prev disabled"
          onClick={this.prevBtn}
        >
          <a className="page-link" />
        </li>
      );

    const nextButton =
      this.state.pageIndex < this.state.totalPages ? (
        <li className="page-item pagination-next" onClick={this.nextBtn}>
          <a className="page-link" />
        </li>
      ) : (
        <li
          className="page-item pagination-next disabled"
          onClick={this.nextBtn}
        >
          <a className="page-link" />
        </li>
      );

    const lastButton =
      this.state.pageIndex < this.state.totalPages ? (
        <li className="page-item pagination-last" onClick={this.lastBtn}>
          <a className="page-link" />
        </li>
      ) : (
        <li
          className="page-item pagination-last disabled"
          onClick={this.lastBtn}
        >
          <a className="page-link" />
        </li>
      );
    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Available Contracts</h1>

          <div className="actions">
            <a
              className="actions__item zmdi zmdi-plus-circle"
              onClick={this.addContract}
            />
          </div>
        </header>

        <table
          className="table table-inverse"
          style={{ backgroundColor: "#0f2940", paddingRight: "20px" }}
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Budget</th>
              <th>Description</th>
              {/* <th>Contract Type</th> */}
              {/* <th>Project Stage</th> */}
              <th>Start Date</th>
              <th>Due Date</th>
              {/* <th>Bid Method</th> */}
              <th>Contact Name</th>
              <th>Phone</th>
              {/* <th>On Site</th> */}
              <th>Industry</th>
              {/* <th>Address</th> */}
              {/* <th>Business Type</th> */}
              {/* <th>Insurance Type</th> */}
              {/* <th>Security Clearance</th> */}
              {/* <th>Is Ongoing</th> */}
              <th>Labor Requirements</th>
              <th>Has Licenses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <ListTemplate
            contractsList={this.state.returnData}
            deleteBtn={this.deleteBtn}
            editBtn={this.editBtn}
          />
        </table>

        <ul className="pagination justify-content-center">
          {firstButton}
          {prevButton}
          {nextButton}
          {lastButton}
        </ul>
      </React.Fragment>
    );
  }
}

export default Contracts;
