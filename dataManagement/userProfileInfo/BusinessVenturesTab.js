import React from 'react'
import * as businessVentureService from '../../../services/businessVentureService';

export default class BusinessVenturesTab extends React.Component{
    constructor(props){
        super(props);

        this.state={
            businessVentureList:[]
        }
        this.isMentored = this.isMentored.bind(this);
    }

    componentDidMount() {
        businessVentureService.getUserId(this.props.userId)
            .then(response => {
                this.setState({
                    businessVentureList: response.items
                })

            })
            .catch(console.error);
    }
    isMentored(item) {
        return item.isMentored === true
            ? <span className="badge badge-info">Mentored</span>
            : '';
    }
    render(){
                    
        const businessVenture = this.state.businessVentureList.map(item => {
            return (
                <div className="card" key={item.id}>
                    <div className="card-body">
                        <h2 className="card-body__title mb-4">Name: {item.name}</h2>
                        <h6 className="card-body__subtitle mb-4">Industry: {item.industry}</h6>
                        <br />

                        <h6 className="card-body__subtitle mb-4">Information:</h6>
                        <ul className="icon-list">
                            {/* <li><i className="zmdi zmdi-account-o zmdi-hc-fw"></i>User Id: {item.userId}</li>
                            <li><i className="zmdi zmdi-email"></i>Status Id: {item.statusId}</li> */}
                            <li><i className="zmdi zmdi-accounts-outline zmdi-hc-fw"></i>{this.isMentored(item)}</li>
                            <li><i className="zmdi zmdi-money-box zmdi-hc-fw"></i>Annual Business Income: {item.annualBusinessIncome}</li>
                            <li><i className="zmdi zmdi-calendar zmdi-hc-fw"></i>Years In Business: {item.yearsInBusiness}</li>
                        </ul>
                    </div>
                </div>
            )
        })
        return(
            <div>
                {businessVenture}
            </div>
        )
    }
}