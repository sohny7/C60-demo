import React from 'react';
import queryString from 'qs';
import * as surveyInstanceService from "../../../services/surveyInstanceService";
import * as surveyTemplateService from "../../../services/surveyTemplateService";
import * as userService from '../../../services/userService';
import { QUESTION_TYPES } from "../../../enums/questionTypes";
import { withCookies } from 'react-cookie';
import DropzoneComponent from "../../Dropzone";
import MentorCheckBox from '../../MentorCheckBox';
import MentorSignUpHeader from '../../MentorSignUpHeader';
import { connect } from 'react-redux';
import swal from "sweetalert2";


class SurveyInstance extends React.Component {
    constructor(props) {
        super(props);

        const str = this.props.location.pathname.split('/');

        this.state = {
            survey: {},
            userId: '',
            userProfile: {},
            imageUrl: '',
            surveyInstance: [],
            version: '',
            surveyId: '',
            isPreview: false,
            dateCreated: '',
            url: str[1]
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
    }

    componentDidMount() {
        if (this.state.url == 'survey-template') {
            surveyTemplateService.getById(this.props.match.params.id)
                .then(response => {
                    this.setState({
                        survey: response.item,
                        surveyId: response.item.id,
                        version: response.item.version,
                        userId: this.props.userProfile.userId
                    })
                })
                .catch(console.log)
        } else {
            surveyInstanceService.getInstanceId(this.props.match.params.id)
                .then(response => {
                    this.setState({
                        surveyId: response.item[0].surveyTemplateId,
                        isPreview: true,
                        surveyInstance: response.item,
                        dateCreated: new Date(response.item[0].dateCreated).toString(),
                        userId: response.item[0].userId
                    })
                    return this.state.surveyId;
                })
                .then(surveyTemplateService.getById)
                .then(response => {
                    const surveyObj = response.item;
                    let answerRows = this.state.surveyInstance;
                    for (let answerIndex = 0; answerIndex < answerRows.length; answerIndex++) {
                        let answerRow = answerRows[answerIndex];
                        let sectionIndex = answerRow.surveySectionSortOrder;
                        let questionIndex = answerRow.surveyQuestionSortOrder;

                        if (surveyObj.sections[sectionIndex].questions[questionIndex].questionTypeId === 0 && surveyObj.sections[sectionIndex].questions[questionIndex].isMultipleAllowed == false ) {
                            surveyObj.sections[sectionIndex].questions[questionIndex].answerInt = answerRow.answerInt;
                        } 
                        else if (surveyObj.sections[sectionIndex].questions[questionIndex].questionTypeId === 0 && surveyObj.sections[sectionIndex].questions[questionIndex].isMultipleAllowed == true ) {
                            if(surveyObj.sections[sectionIndex].questions[questionIndex].multAnswerInt){  
                                surveyObj.sections[sectionIndex].questions[questionIndex].multAnswerInt.push(answerRow.answerOptionId)}
                             else{
                                surveyObj.sections[sectionIndex].questions[questionIndex].multAnswerInt = [answerRow.answerOptionId]
                             }   

                        }
                        else if (surveyObj.sections[sectionIndex].questions[questionIndex].questionTypeId === 1 || 2 || 3) {
                            surveyObj.sections[sectionIndex].questions[questionIndex].textAnswer = answerRow.answer;
                        }
                    }
                    const resultsObj = {
                        survey: surveyObj,
                        surveyId: response.item.id,
                        version: response.item.version
                    };
                    return resultsObj;
                    
                })
                .then(resultsObj => {
                    userService.readById(this.state.userId)
                        .then(response => {
                            this.setState({
                                userProfile: response.items,
                                survey: resultsObj.survey,
                                surveyId: resultsObj.surveyId,
                                version: resultsObj.version
                            })
                        })
                })
                .catch(console.log)
        }
    }

    getAnswersArray() {
        let survey = this.state.survey;
        const answersArr = [];
        for (let i = 0; i < survey.sections.length; i++) {
          let section = survey.sections[i];
          for (let j = 0; j < section.questions.length; j++) {
            const question = survey.sections[i].questions[j];
    
            if (
              question.questionTypeId === 0 &&
              question.isMultipleAllowed == true
            ) {
              for (let k = 0; k < question.answer.length; k++) {
                const questionObj = {
                  questionId: question.id
                };
                questionObj.answerInt = parseInt(question.answer[k]);
                questionObj.answerOptionId = parseInt(question.answerOptionId[k]);
                answersArr.push(questionObj);
              }
            } else if (
              question.questionTypeId === 0 &&
              question.isMultipleAllowed == false
            ) {
              const questionObj = {
                questionId: question.id
              };
              questionObj.answerInt = parseInt(question.answer);
              questionObj.answerOptionId = parseInt(question.answerOptionId);
              answersArr.push(questionObj);
            } else {
              const questionObj = {
                questionId: question.id
              };
              questionObj.answer = question.answer;
              questionObj.answerOptionId = parseInt(question.answerOptionId);
              answersArr.push(questionObj);
            }
          }
        }
        return answersArr;
      }

    onChange(e, sectionIndex, questionIndex) {
        const newQuestionObj = JSON.parse(JSON.stringify(this.state.survey.sections[sectionIndex].questions[questionIndex]))
        newQuestionObj.answer = e.target.value;
        newQuestionObj.answerOptionId = e.target.id;


        const newState = JSON.parse(JSON.stringify(this.state.survey))
        newState.sections[sectionIndex].questions[questionIndex] = newQuestionObj

        this.setState({
            survey: newState
        })
    }

    onCheckChange(e, sectionIndex, questionIndex) {
        if (
          !this.state.survey.sections[sectionIndex].questions[questionIndex].answer
        ) {
          const newQuestionObj = JSON.parse(
            JSON.stringify(
              this.state.survey.sections[sectionIndex].questions[questionIndex]
            )
          );
          newQuestionObj.answer = [e.target.value];
          newQuestionObj.answerOptionId = [e.target.id];
    
          const newState = JSON.parse(JSON.stringify(this.state.survey));
          newState.sections[sectionIndex].questions[questionIndex] = newQuestionObj;
    
          this.setState({
            survey: newState
          });
        } else {
          const newQuestionObj = JSON.parse(
            JSON.stringify(
              this.state.survey.sections[sectionIndex].questions[questionIndex]
            )
          );
          newQuestionObj.answer.push(e.target.value);
          newQuestionObj.answerOptionId.push(e.target.id);
    
          const newState = JSON.parse(JSON.stringify(this.state.survey));
          newState.sections[sectionIndex].questions[questionIndex] = newQuestionObj;
    
          this.setState({
            survey: newState
          });
        }
      }

    onSubmit() {
            const values = {}
            values.answers = this.getAnswersArray();
            values.surveyTemplateId = this.state.surveyId;
            swal({
                title: "Are you sure you want to submit survey?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#7ac7f6",
                cancelButtonColor: 'red',
                confirmButtonText: "Yes, submit!",
                cancelButtonText: "Not yet!",
                background: '#0f2940'
              }).then(result => {
                if (result.value) {
            surveyInstanceService.postAnswer(values)
            .then(() => {
                swal({
                  title: "Submitted!",
                  text: "Survey has been submitted.",
                  type: "success",
                  background: '#0f2940',
                  confirmButtonColor: '#7ac7f6'
                });
              })
                .then(() => {this.props.history.goBack()})
                .catch(console.error)
                }
    })
    }

    onFileUpload(uploadedImage, sectionIndex, questionIndex, ansOptId) {
        const newQuestionObj = JSON.parse(JSON.stringify(this.state.survey.sections[sectionIndex].questions[questionIndex]))
        newQuestionObj.answer = uploadedImage;
        newQuestionObj.answerOptionId = ansOptId

        const newState = JSON.parse(JSON.stringify(this.state.survey))
        newState.sections[sectionIndex].questions[questionIndex] = newQuestionObj

        this.setState({
            survey: newState
        })
    }

    questionType(question, sectionIndex, questionIndex) {
        let answer;
        switch (question.questionTypeId) {
            case QUESTION_TYPES.YES_NO_I_DONT_KNOW:
                if (question.answerOptions) {
                    if (question.answerOptions && question.isMultipleAllowed == false){
                    {
                        answer = question.answerOptions.map((answer, answerIndex) => {
                            return (
                                <div className='row col-sm-12'>
                                    {this.props.location.search ? <MentorCheckBox answerOptionId={this.state.surveyInstance[3].answerOptionId} /> : null}
                                    <div className='col-sm-10'>
                                        <div className="form-group" key={answer.id} onChange={e => this.onChange(e, sectionIndex, questionIndex)}>
                                            <div>
                                                <label className="custom-control custom-radio">
                                                    <span className="custom-control-description">{answer.text}</span>
                                                    <input type="radio" disabled={this.state.isPreview} checked={this.state.isPreview == true ? answerIndex + 1 === question.answerInt : null} value={answerIndex + 1} name={answer.questionId} id={answer.id} className="custom-control-input" />
                                                    <span className="custom-control-indicator" />
                                                </label>
                                                <div className="clearfix mb-2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                }
                else {
                    answer = question.answerOptions.map((answer, answerIndex) => {
                      return (
                        <div className='row col-sm-12'>
                        {this.props.location.search ? <MentorCheckBox answerOptionId={this.state.surveyInstance[3].answerOptionId} /> : null}
                        <div className='col-sm-10'>
                        <div className="form-group" key={answer.id} onChange={e => this.onCheckChange(e, sectionIndex, questionIndex)}>
                          <div>
                            <label className="custom-control custom-checkbox">
                              <span className="custom-control-description">{answer.text}</span>
                              <input type="checkbox" disabled={this.state.isPreview} checked={this.state.isPreview == true ? question.multAnswerInt.includes(answer.id) : null} value={answerIndex + 1} name={answer.questionId} id={answer.id} className="custom-control-input"/>
                              <span className="custom-control-indicator" />
                            </label>
                            <div className="clearfix mb-2" />
                          </div>
                        </div>
                        </div>
                        </div>
                      );
                    });
                  }
                }
                break;
            case QUESTION_TYPES.SHORT_TEXT:
                if (question.answerOptions) {
                    answer = question.answerOptions.map((answer, answerIndex) => {
                        return (
                            <div className='row col-sm-12'>
                                {this.props.location.search ? <MentorCheckBox answerOptionId={this.state.surveyInstance[3].answerOptionId} /> : null}
                                <div key={answer.id}>
                                    {/* <p className="card-subtitle">{answerIndex + 1}. {answer.text}</p> */}
                                    <div className="form-group">
                                        <input type="text" disabled={this.state.isPreview} value={question.textAnswer} id={answer.id} className="form-control" onChange={e => this.onChange(e, sectionIndex, questionIndex)} name={answer}></input>
                                        <i className="form-group__bar" style={{ position: "absolute" }}></i>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                break;
            case QUESTION_TYPES.LONG_TEXT:
                if (question.answerOptions) {
                    answer = question.answerOptions.map((answer, answerIndex) => {
                        return (
                            <div className='row col-sm-12'>
                                {this.props.location.search ? <MentorCheckBox answerOptionId={this.state.surveyInstance[3].answerOptionId} /> : null}
                                <div key={answer.id}>
                                    <p className="card-subtitle">{answerIndex + 1}. {answer.text}</p>
                                    <div className="form-group">
                                        <textarea className="form-control textarea-autosize" disabled={this.state.isPreview} value={question.textAnswer} id={answer.id} onChange={e => this.onChange(e, sectionIndex, questionIndex)} style={{ overflow: "hidden", overflowWrap: "break-word", height: "49px" }}></textarea>
                                        <i className="form-group__bar"></i>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                break;
            case QUESTION_TYPES.UPLOAD:
                if (question.answerOptions) {
                    let image = question.textAnswer 
                    answer = question.answerOptions.map(answer => {
                        let dropzone;
                        if(!image){
                            dropzone = <DropzoneComponent getUrl={url => { this.onFileUpload(url, sectionIndex, questionIndex, answer.id) }} />
                        } else {
                            dropzone = <img className="img-responsive" style={{ height: "75%", width: "75%" }} src={image} />
                        }
                        return (
                            <div className='row col-sm-12'>
                                <div key={answer.id}>
                                    <p className="card-subtitle" id={answer.id}>{answer.text}</p>
                                    {dropzone}
                                </div>
                            </div>
                        )
                    })
                }
                break;
            default:
                console.log("error")
        }
        return answer
    }

    render() {
        const survey = this.state.survey;
        const assessment = this.state.url == 'assessment' ? true : false
        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <h1 className="card-title">{survey.name}</h1>
                        {this.props.location.search ? <MentorSignUpHeader /> : null}
                        <br />
                        {!assessment && this.state.userProfile &&
                            <React.Fragment>
                                <p className="card-subtitle">Created by {this.state.userProfile.firstName} {this.state.userProfile.lastName}</p>
                                <p className="card-subtitle">on {this.state.dateCreated}</p>
                                <p className="card-subtitle">{survey.description}</p>
                            </React.Fragment>}
                        <div>
                            {survey && survey.sections && survey.sections.map((section, sectionIndex) => {
                                return (
                                    <div key={section.id}>
                                        {!assessment &&
                                            <React.Fragment>
                                                <h4 className="card-title">{section.title}</h4>
                                                <p className="card-subtitle">{section.description}</p>
                                            </React.Fragment>}
                                        <div>
                                            {section.questions && section.questions.map((question, questionIndex) => {
                                                return (
                                                    <div className="card" key={question.id}>
                                                        <div className="card-body">
                                                            <p>Question {questionIndex + 1}</p>
                                                            <p>{question.question}</p>
                                                            <div>
                                                                <br></br>
                                                                {this.questionType(question, sectionIndex, questionIndex)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                            <button type="button" className="btn btn-light btn-block" disabled={this.state.isPreview} onClick={this.onSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    userProfile: state.userProfiles
  })

export default withCookies(connect(mapStateToProps)(SurveyInstance))