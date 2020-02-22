import React from "react";

class UserTemplate extends React.Component {
  render() {
    const users = this.props.data
      ? this.props.data.map(val => {
          let confirmation;
          if (val.isConfirmed === true) {
            confirmation = <td style={{ color: "green" }}>Confirmed</td>;
          } else {
            confirmation = <td style={{ color: "red" }}>Not Confirmed</td>;
          }
          return (
            <tr key={val.id}>
              <th scope="row">{val.id}</th>
              <td>{val.firstName}</td>
              <td>{val.lastName}</td>
              <td>{val.email}</td>
              <td>{val.userTypeId}</td>
              {confirmation}
              <td>{val.referralSource}</td>
              <td>
                <button
                  className="btn btn-light btn--icon pull-left"
                  onClick={e => this.props.editButton(val.id)}
                  style={{ marginRight: "3px" }}
                >
                  <i className="zmdi zmdi-edit" id={val.id} />
                </button>
                <button
                  className="btn btn-light btn--icon pull-left"
                  onClick={e => this.props.deleteButton(val.id)}
                >
                  <i className="zmdi zmdi-delete" id={val.id} />
                </button>
              </td>
            </tr>
          );
        })
      : null;
    return <tbody>{users}</tbody>;
  }
}

export default UserTemplate;
