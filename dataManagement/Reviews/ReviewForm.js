import React, { Component } from "react";
import * as userService from "../../../services/userService";
import { connect } from "react-redux";
import Select from "react-select";
import ReviewModal from "../../dataManagement/Reviews/ReviewModal";
import "./ReviewForm.css";

const customStyle = {
  control: styles => ({ ...styles, backgroundColor: "#eff3f9" })
};
class ReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewerId: "",
      selectedOption: null,
      selectedName: "",
      coaches: [{ coachId: null, coachName: "" }],
      mentors: [{ mentorId: null, mentorName: "" }],
      showModal: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    const userId = this.props.currentUser.userId;
    this.getCoachesAndMentors(userId);
  }

  getCoachesAndMentors(userId) {
    userService
      .getCoachByUserId(userId)
      .then(response => {
        let coaches = [];
        let temp = response.items;
        temp.map(item => {
          coaches.push({
            value: item.coachId,
            label: `${item.firstName} ${item.lastName}`
          });
        });
        this.setState({ coaches: coaches });
      })
      .catch(error => {
        console.log(error);
      });

    userService
      .usersMentors_GetByUserId(userId)
      .then(response => {
        let mentors = [];
        let temp = response.items;
        temp.map(item => {
          mentors.push({
            value: item.mentorId,
            label: `${item.firstName} ${item.lastName}`
          });
        });
        this.setState({ mentors: mentors });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCoachMentorOption = selectedOption => {
    this.setState({
      reviewerId: selectedOption.value,
      selectedName: selectedOption.label
    });
    this.toggleModal();
    console.log(selectedOption);
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <React.Fragment>
        <header className="content__title">
          <h1>Review Form</h1>
        </header>

        <div className="card">
          <div className="card-body">
            <form>
              <div className="form-group">
                <h1 className="card-body__title">User Information</h1>
                <div className="container">
                  <div style={{ paddingBottom: "30px" }} className="row">
                    <div className="col-sm-3">
                      <br />
                      <h5>Who do you want to rate?</h5>
                      <br />
                    </div>
                    <div className="col-sm-4">
                      <h4 style={{ fontSize: "1rem" }}>COACHES</h4>
                      <Select
                        style={{ backgroundColor: "#000" }}
                        className="drop_style"
                        value={selectedOption}
                        onChange={this.handleCoachMentorOption}
                        options={this.state.coaches}
                      />
                    </div>
                    <div className="col-sm-4">
                      <h4 style={{ fontSize: "1rem" }}>MENTORS</h4>
                      <Select
                        className="drop_style"
                        value={selectedOption}
                        onChange={this.handleCoachMentorOption}
                        options={this.state.mentors}
                      />
                    </div>
                    <ReviewModal
                      show={this.state.showModal}
                      key={this.state.showModal}
                      coachOrMentorId={this.state.reviewerId}
                      coachOrMentorName={this.state.selectedName}
                      close={this.toggleModal}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.userProfiles
});

export default connect(mapStateToProps)(ReviewForm);
