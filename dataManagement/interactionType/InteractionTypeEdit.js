import React from "react";
import * as interactionTypeService from "../../../services/interactionTypeService";
import * as validation from '../../../utils/validation';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

class InteractionTypeEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            typeName: {
                value: '',
                input: false
            },
            id: '',
            updateType: false
        };
    
    this.onChange = this.onChange.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    };

    checkValidation(){
        return validation.interactionType(this.state.typeName.value)     
    }

    onChange(event) {
        console.log(event.target.name)
        console.log(event.target.value)
        const value = { value: event.target.value, input: true };
        this.setState({
            [event.target.name]: value
        })
    }

    onEdit() { 
        const editType = {
            typeName: this.state.typeName.value,
            id: this.state.id
        };
        if(this.checkValidation()){
            let promise = {}
            if(this.state.updateType){
                promise = interactionTypeService.put(this.props.match.params.id, editType)
            }
            promise
            .then(() => {this.props.history.push('/data-management/interactionType/list')})
            .catch(console.error)
        } else {
            console.log("Invalid Information")
        }
    } 

    onSubmit() {
        const data = {
            typeName: this.state.typeName.value
        }
        if(this.checkValidation()){
            let promise = {}
            if(this.state.updateType){
                data.id = this.state.id
                promise = interactionTypeService.put(data)
            } else {
                promise = interactionTypeService.post(data)
            }
            promise
            .then(() => {this.props.history.push('/data-management/interactionType/list')})
            .catch(console.error)
        } else {
            console.log("Invalid Information")
        }
    }
    
    componentDidMount() {
        if (this.props.match.params.id) {
            interactionTypeService.getById(this.props.match.params.id)   
            .then(response => {
                let editData = response.items[0]
                    this.setState(
                        {
                            id: editData.id,
                            typeName: this.makeObj(editData.typeName),
                            updateType: true
                        }
                    )
                    console.log(response)
                })
                .catch(console.error);
        }
        else {
            return null
        }
    }

    makeObj(val){
        const obj = {
            input: true,
            value: val
        }
        return obj
    }

    render() {
        return (
            <React.Fragment>
                <header className="content__title">
                    <h1>Interaction Type Edit</h1>
                </header>
                <div className="card col-sm-12">
                    <div className="card-body">
                        <div className="col-sm-12">
                            <form>
                                <div className="row">
                                <div className="col-sm-6">
                                        <FormGroup
                                            controlId="formBasicText"
                                        >
                                        <ControlLabel>Add Interaction Type</ControlLabel>
                                            <FormControl
                                                className={this.state.typeName.input && (validation.interactionType(this.state.typeName.value) ? 'is-valid' : 'is-invalid')}
                                                type="text"
                                                name="typeName"
                                                value={this.state.typeName.value}
                                                onChange={this.onChange}
                                            />
                                            <i className="form-group__bar"></i>
                                            <FormControl.Feedback />
                                            {this.state.typeName.input && !validation.interactionType(this.state.typeName.value) ? <HelpBlock style={{ position: "absolute" }}>Please enter an Interaction Type</HelpBlock> : null}
                                        </FormGroup>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {this.state.updateType ?
                        <Button
                            type="button"
                            className='btn btn-light'
                            onClick={this.onEdit}>
                            UPDATE
                        </Button>
                        :
                        <Button
                            type="button"
                            className='btn btn-light'
                            onClick={this.onSubmit}>
                            SUBMIT
                    </Button>}
                </div>
            </React.Fragment>
        )
    }
}
export default InteractionTypeEdit;

