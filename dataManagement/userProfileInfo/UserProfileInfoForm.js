import React from 'react';
import { FormControl, HelpBlock, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Addresses from './../../Addresses';
import BusinessVentureEdit from '../businessVentures/businessVenturesEdit';
import ImageUploader from '../../ImageUploader';
import RaceEthnicityDropdown from '../../RaceEthnicityDropdown';
import LevelOfEducationDropdown from '../../LevelOfEducationDropdown';
import * as moment from 'moment';
import * as fileUploadService from '../../../services/fileUploadService';
import * as currentUserProfileService from '../../../services/currentUserProfileService';
import * as businessVentureService from '../../../services/businessVentureService';
import * as addressesService from '../../../services/addressesService';
import * as userProfileInfoService from '../../../services/userProfileInfoService'; 
class UserProfileInfoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: {
        value: ''
        , touched: false
      }
      , bio: {
        value: ''
        , touched: false
      }
      , imageUrl: {
        value: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        , touched: false
      }
      , dob: {
        value: ''
        , touched: false
      }
      , raceEthnicityId: {
        value: ''
        , touched: false
      }
      , levelOfEducationId: {
        value: ''
        , touched: false
      }
      , householdIncome: {
        value: ''
        , touched: false
      }
      , yearsInBusiness: {
        value: ''
        , touched: false
      }
      , id: ''
      , isClicked: true,   
      businessVentureId: 0
      , addressList: []
      , businessVentureList: []
      , show: false
      , disable: false
      , onEdit: false
      , profileBool: true
      , signedURL: false     

    };

    this.handleChange = this.handleChange.bind(this);
    this.levelOfEducationValue = this.levelOfEducationValue.bind(this);
    this.raceEthnicityValue = this.raceEthnicityValue.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this); // event handler for File Upload Modal Component
    this.onAddAddress = this.onAddAddress.bind(this)
    this.onDeleteAddress = this.onDeleteAddress.bind(this)
    this.onCroppedImage = this.onCroppedImage.bind(this);
    this.onDeleteBusinessVenture = this.onDeleteBusinessVenture.bind(this)
  }

  componentDidMount() {  
  //grabs url id and returns items /userformlist
  let id = this.props.userId
  //DO NOT DELETE - DSONG
  if(this.props.profileData) {
      let data = this.props.profileData  
      this.setState({
        userId: this.convertToObj(parseInt(data.userId))
        , bio: this.convertToObj(data.bio)
        //, imageUrl: this.convertToObj(data.imageUrl)
        , dob: this.convertToObj(moment(data.dob).utc().format('MM/DD/YYYY'))
        , raceEthnicityId: this.convertToObj(parseInt(data.raceEthnicityId))
        , levelOfEducationId: this.convertToObj(parseInt(data.levelOfEducationId))
        , householdIncome: this.convertToObj(parseInt(data.householdIncome))
        , yearsInBusiness: this.convertToObj(parseInt(data.yearsInBusiness))
        , id: this.props.match.params.userId
        , onEdit: true
      })
  }
  //DO NOT DELETE ABOVE - DSONG
  else if (id) { 
    const promise1 = currentUserProfileService.readById(id)
    promise1.then(responseData => {             
        this.setState({
             userId: {value: id}           
             , bio: {value:responseData.items[0].bio}
             , imageUrl: {value: responseData.items[0].imageUrl}
             , dob: {value:moment(responseData.items[0].dob).utc().format('MM/DD/YYYY')}
             , raceEthnicityId: {value: responseData.items[0].raceEthnicityId}
             , levelOfEducationId: {value: responseData.items[0].levelOfEducationId}
             , householdIncome: {value: responseData.items[0].householdIncome}
             , yearsInBusiness: {value: responseData.items[0].yearsInBusiness}
             , id: responseData.items[0].id
             , isClicked: false
             , disable: true
             , onEdit: true   
        })
    })

    const promise2 = addressesService.readByUserId(id);
    promise2.then(responseData => {
      this.setState({
        addressList: responseData.items
      })
    })
    
    const promise3 = businessVentureService.getUserId(id)
    promise3.then(responseData => {
      this.setState({
        businessVentureList: responseData.items
      })
    })
    .catch(console.error);
  }
}

//DO NOT DELETE - DSONG
convertToObj(val) {
  return {
    value: val
    , touched: true
  }
}
//DO NOT DELETE - DSONG

  validateBirthdate(dob) {
    if(!dob.touched) return null
    else return 'is-valid'
  }

  getIntValidationState(intId) {
    function numberVal(intId) {
      var re = /^\d+$/g;
      return re.test(intId);
    }
    if (!intId.touched) return null
    else if (!numberVal(intId.value)) return 'is-invalid'
    else return 'is-valid'
  }

  // https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url  answered by Matthew O'Riordan
  getUrlValidationState(url) {
    function urlVal(url) {
      var re = /^((https?|ftp):)?\/\/.*(jpeg|jpg|png|gif|bmp)$/;
      return re.test(String(url).toLowerCase());
    }
    if (!url.touched) return null
    else if (!urlVal(url.value)) {
      return 'is-invalid'
    }
    else return 'is-valid'
  }

  getStrValidationState(str) {
    if (!str.touched) return null;

    if (str.value.length < 20) return 'is-invalid'
    else return 'is-valid'
  }

  handleChange(event) {
    const newValidationObject = {
      touched: true
      , value: event.target.value
    };
    this.setState({
      [event.target.name]: newValidationObject
    });
  }

onFileUpload() {
    const imgData = this.state.imgCropped;
    if(imgData) {
      return fileUploadService.getSignedUrl(imgData)
       .then((response) => {
         const promise1 = fileUploadService.upload(response.url, imgData)
         this.setState({
           imageUrl: {
             value: response.url,
             touched: true
            },
            signedUrl: true
          })          
          return response.url;
        })
        .catch(console.error);
    }
    else {  
    const promise2 = Promise.resolve();
    return promise2
  }
}

  onCroppedImage(imgCropped){
    this.setState({ imgCropped: imgCropped })
  }
    
    onClear() {
      this.setState({
        userId: {
          value: ''
          , touched: false
        }
        , bio: {
          value: ''
          , touched: false
        }
        , imageUrl: {
          value: ''
          , touched: false
        }
        , dob: {
          value: ''
          , touched: false
        }
        , raceEthnicityId: {
          value: ''
          , touched: false
        }
        , levelOfEducationId: {
          value: ''
          , touched: false
        }
        , householdIncome: {
          value: ''
          , touched: false
        }
        , yearsInBusiness: {
          value: ''
          , touched: false
        }
      })
    }
    
    raceEthnicityValue(value) {
      let raceEthnicityId = Object.assign({}, this.state.raceEthnicityId);
      raceEthnicityId.value = value
      this.setState({
        raceEthnicityId
      })
    }

    levelOfEducationValue(value) {
      let levelOfEducationId = Object.assign({}, this.state.levelOfEducationId);
      levelOfEducationId.value = value
      this.setState({
        levelOfEducationId
      })
    }

    onClick() {
      this.setState({ isClicked: false })
    }    
    
    onSave() {
      this.onFileUpload()
      .then((response)=>{
      let profileImage = ""
      if (response) {
        profileImage = response
      } else {
        profileImage = ""
      }
      const data = {
        userId: this.state.userId.value
        , bio: this.state.bio.value
        , imageUrl: profileImage
        , dob: this.state.dob.value
        , raceEthnicityId: this.state.raceEthnicityId.value
        , levelOfEducationId: this.state.levelOfEducationId.value
        , householdIncome: this.state.householdIncome.value
        , yearsInBusiness: this.state.yearsInBusiness.value
      }

      let onEdit = this.state.onEdit  

      let userId = this.props.userId 
      userProfileInfoService.update(data, userId)
      if(this.state.isClicked)
      {
        this.props.modalData(data, onEdit)
        this.props.hideModal()  
      } 
      else if (!this.state.isClicked && onEdit) 
      {  
        this.props.modalData(data, onEdit)
        this.props.hideModal()  
      }
  })
  .catch((error) => console.log(error))

}

  onAddAddress() {
    let addressList = this.state.addressList
    let addressClone = [...addressList, {}]
    this.setState({
      addressList: addressClone
    })
  }

  onDeleteAddress(addressId) {
    const addressList = this.state.addressList;
    const newAddressList = addressList.filter(address => address.id != addressId)
    this.setState({
      addressList: newAddressList
    })
  }

  onAddBusinessVenture() {
    let businessVentureList = this.state.businessVentureList;
    let businessVentureClone = [...businessVentureList, {}]
    this.setState({
      businessVentureList: businessVentureClone
    })
  }

  onDeleteBusinessVenture(businessVentureId) {
    let businessVentureList = this.state.businessVentureList;
    let newBusinessVentureList = businessVentureList.filter(business => business.id != businessVentureId)
    this.setState({
      businessVentureList: newBusinessVentureList
    })
  }

  hideModal(){
    this.setState({
       show: false 
    })
  }
      
  render() {
    const address = this.state.addressList.map(item => {
      return (
        <div key={item.id}>
          <Addresses name="addressList"
            id={item.id}
            userId={this.props.userId}
            onDeleteAddress={this.onDeleteAddress}
          />
          <br />
          <hr />
          <br />
        </div>
      )
    })  

    const businessVenture = this.state.businessVentureList.map(item => {
      return (
        <div key={item.id}>
          <BusinessVentureEdit name="businessVenture"
            id={item.id}
            onDeleteBusinessVenture={this.onDeleteBusinessVenture}
            userId={this.props.userId}
          />
          <br />
          <hr />
          <br />
        </div>
      )
    })

    return (
      <React.Fragment>
        <header className="content__title">
          <h1>User Profile Information Form</h1>

        </header>

        <div className="card">
          <div className="card-profile">
            <div className="tab-container">

              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#userProfile" role="tab" aria-expanded="true">User Profile Form</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#address" role="tab" aria-expanded="false">Contact Info</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#businessVenture" role="tab" aria-expanded="false">Business Ventures</a>
                </li>
              </ul>

              <div className="tab-content">
                {/* user profile form */}
                <div className="tab-pane fade active show" id="userProfile" role="tabpanel" aria-expanded="true">
                  <div className="card-body">
                    <h4 className="card-title">User Profile Information</h4>
                    <h6 className="card-subtitle">Please fill out the form.</h6>
                    <form>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <FormControl
                              type="number"
                              id="yearsInBusiness"
                              name="yearsInBusiness"
                              className={this.getIntValidationState(this.state.yearsInBusiness)}
                              value={this.state.yearsInBusiness.value}
                              placeholder="Enter Years in Business"
                              onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Enter years in business</HelpBlock>
                          </div>
                        </div>

                        <div className="col-sm-4">
                          <div className="form-group">
                            <FormControl
                              type="number"
                              id="householdIncome"
                              name="householdIncome"
                              className={this.state.householdIncome}
                              value={this.state.householdIncome.value}
                              placeholder="Enter Household Income"
                              onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Enter household income *Optional</HelpBlock>
                          </div>
                        </div>

                        <div className="col-sm-4">
                          <div className="form-group">
                            <FormControl
                              type="date"
                              id="dob"
                              name="dob"
                              className={this.validateBirthdate(this.state.dob)}
                              value={this.state.dob.value}
                              placeholder="Enter Date of Birth"
                              onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Enter date of birth (MM/DD/YYYY)</HelpBlock>
                          </div>
                        </div>


                        <div className="col-sm-4">
                          <div className="form-group">
                          <RaceEthnicityDropdown selectedOption={this.state.raceEthnicityId ? this.state.raceEthnicityId.value : null} onChange={this.raceEthnicityValue} />
                            <FormControl.Feedback />
                            <HelpBlock>Race/Ethnicity</HelpBlock>
                          </div>
                        </div>

                        <div className="col-sm-4">
                          <div className="form-group">
                          <LevelOfEducationDropdown selectedOption={this.state.levelOfEducationId ? this.state.levelOfEducationId.value : null} onChange={this.levelOfEducationValue} />
                            <HelpBlock>Level of education</HelpBlock>
                            <FormControl.Feedback />
                          </div>
                        </div>

                        <div className="col-sm-12">
                          <div className="form-group">
                            <FormControl
                              componentClass="textarea"
                              id="bio"
                              name="bio"
                              className={this.getStrValidationState(this.state.bio)}
                              value={this.state.bio.value}
                              placeholder="Enter Bio"
                              onChange={this.handleChange}
                            />
                            <HelpBlock>Enter at least 20 characters</HelpBlock>
                          </div>
                        </div>

                      </div>                    
               
                      <ImageUploader onCropped={this.onCroppedImage} profileBool={this.state.profileBool} onEdit={this.state.onEdit} />

                      </form>
                      <div>               
                      {this.state.isClicked
                        ? [<br/>, <button className="btn btn-light" type="button" onClick={this.onSave}>Submit</button>]
                        : [<br/>, <button className="btn btn-light" type="button" onClick={this.onSave}>Update</button>]}
                    </div>
                  </div>
                </div>

                {/* Address Component */}
                <div className="tab-pane fade" id="address" role="tabpanel" aria-expanded="false">
                  <div className="card-body">
                    {address}
                  </div>
                  <Button className="btn btn-light" type="button" onClick={this.hideModal}>Close</Button>
                  <Button
                    className="btn btn-light"
                    onClick={e => this.onAddAddress(e)}
                    style={{ float: "right" }}
                    >
                    <span>Add More Contact Info</span>
                  </Button>
                </div>

                {/* Business Venture Component */}
                <div className="tab-pane fade" id="businessVenture" role="tabpanel" aria-expanded="false">
                  <div className="card-body">
                    {businessVenture}
                  </div>
                  <Button
                    className="btn btn-light"
                    onClick={e => this.onAddBusinessVenture(e)}
                    style={{ float: "right"}}>
                    <span>Add Business Venture</span>
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({ 
  userId: state.userProfiles.userId
})

export default withRouter(connect(mapStateToProps)(UserProfileInfoForm));