import React from "react";
import { withRouter } from "react-router-dom";
import * as moment from "moment";

class ListTemplate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.contractsList);

    const ContractsList = this.props.contractsList.map(item => {
      return (
        <tr key={item.id}>
 		    <th scope="row">{item.id}</th>
            <td>{item.name}</td>
            <td>${item.budget.toFixed(2)}</td>
            <td>{item.description}</td>
            {/* <td>{item.contractTypeId}</td>
            <td>{item.projectStageId}</td> */}
            <td>{moment(item.projectStartDate).format("M/DD/YYYY")}</td>
            <td>{moment(item.projectDueDate).format("M/DD/YYYY")}</td> 
            {/* <td>{item.bidMethodTypeId}</td>  */}
            <td>{item.contactName}</td>
            <td>{item.phone}</td> 
            {/* <td>{item.onSiteRequired ? 1 : 0}</td> */}
            <td>{item.industry}</td>
            {/* <td>{item.addressId}</td>
            <td>{item.businessTypeId}</td>
            <td>{item.insuranceTypeId}</td>
            <td>{item.securityClearanceId}</td>
            <td>{item.isOngoing ? 1 : 0}</td>  */}
            <td>{item.laborRequirements}</td>
            <td>{item.hasLicenses ? 1 : 0}</td> 
          <td style={{ padding: "0" }}>
            <button
              className="btn btn-light btn--icon"
              style={{ marginRight: "3px" }}
              onClick={e => this.props.editBtn(item.id, e)}
            >
              <i className="zmdi zmdi-edit zmdi-hc-fw" />
            </button>
            <button
              className="btn btn-light btn--icon"
              onClick={e => this.props.deleteBtn(item.id, e)}
            >
              <i className="zmdi zmdi-close" />
            </button>
          </td>
        </tr>
      );
    });

    return <tbody>{ContractsList}</tbody>;
  }
}

export default withRouter(ListTemplate);
