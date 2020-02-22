import React from 'react'
import * as addressesService from '../../../services/addressesService';

export default class AddressTab extends React.Component{
    constructor(props){
        super(props);

        this.state={
            addressList:[]
        }
    }

    componentDidMount() {
        addressesService.readByUserId(this.props.userId)
        .then(response => {
            this.setState({
                addressList: response.items || []
            })
        })
        .catch(console.error);
    }

    render(){
                    

        const address = this.state.addressList.map(item => {
            return (
                <div className="card" key={item.id}>
                    <div className="card-body">
                        <h2 className="card-body__title mb-4">Contact Info</h2>
                        <br />

                        <ul className="icon-list">
                            {/* <li><i className="zmdi zmdi-account-o zmdi-hc-fw"></i>User Id: {item.userId}</li>
                            <li><i className="zmdi zmdi-email"></i>Status Id: {item.businessVentureId}</li> */}
                            <li><i className="zmdi zmdi-pin zmdi-hc-fw"></i>Address Line 1: {item.line1}</li>
                            <li><i className="zmdi zmdi-pin zmdi-hc-fw"></i>Address Line 2: {item.line2}</li>
                            <li><i className="zmdi zmdi-city zmdi-hc-fw"></i>City: {item.city}</li>
                            <li><i className="zmdi zmdi-pin zmdi-hc-fw"></i>State: {item.state}</li>
                            <li><i className="zmdi zmdi-pin zmdi-hc-fw"></i>Zip: {item.zip}</li>
                        </ul>
                    </div>
                </div>
            )
        })
        return(
            <div>
                {address}
            </div>
        )
    }
}