import React from 'react';
import * as userTypeService from '../../../services/userTypeService';
import { FormGroup, HelpBlock, ControlLabel, FormControl } from 'react-bootstrap';

class UserTypesEdit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            typeName: {
                value:''
                ,touched:false
            }
            ,editMode: false
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        const obj = {
            touched: true
            ,value: e.target.value
        }
        this.setState({
            [e.target.name]: obj
        })
    }

    onSubmit() {
        let promise = {}
        const data = {typeName: this.state.typeName.value}
        if(this.state.editMode){
            const id = this.props.match.params.id
            promise = userTypeService.update(id, data)
        }else{
            promise = userTypeService.create(data)
        }
         promise.then((response) => {
                 console.log(response)
                 this.props.history.push('/data-management/user-type/list/')
             })
             .catch(console.error)
    }

    componentDidMount() {
        const data = this.props.match.params.id;
        if(data) {
            userTypeService.readById(data)
            .then((response) => {
                this.setState({
                    id: data
                    ,typeName: {
                        value: response.item.typeName
                    }
                    ,editMode: true
                })
                console.log(response)
            })
            .catch((err) => {
                console.error(err)
            })
        }
    }

    getValidationState(userTypeValidate) {
        if(userTypeValidate.length >= 0 && userTypeValidate.length <= 50){
            return true;
        }else{ 
            return false;
        }
    }

    render() {
        const button = this.state.editMode
        ? <button className="btn btn-light" type="button" value="Submit" onClick={this.onSubmit}>Update</button>
        : <button className="btn btn-light" type="button" value="Submit" onClick={this.onSubmit}>Submit</button>


        return (

            <React.Fragment>
                <header className="content__title">
                    <h1>User Types Edit</h1>

                   
                </header>

                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">User Types</h4>
                        <h6 className="card-subtitle">Submit Your Type!</h6>
                        <FormGroup
                            controlId="formInput"
                        >
                            <ControlLabel>User Type</ControlLabel>
                            <FormControl
                                type="text"
                                className={this.state.typeName.touched && (this.getValidationState(this.state.typeName.value) ? "is-valid" : "is-invalid")}
                                placeholder="i.e Business Owner"
                                onChange={this.onChange}
                                value={this.state.typeName.value}
                                name="typeName" />
                            <i className="form-group_bar"></i>
                            <FormControl.Feedback/>
                            {this.state.typeName.touched && (this.getValidationState(this.state.typeName.value) ? null : <HelpBlock>Cant be more then 50 characters!</HelpBlock>)}
                        </FormGroup>
                        <br /><br />
                        {button}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default UserTypesEdit;