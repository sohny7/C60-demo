import React from 'react';

class UserProfileAddressTemplate extends React.Component {
    render() {
        const mappedList = this.props.list && this.props.list.map(item => {
            return (
                <div className="card text-center" key={item.id}>
                    <p>{item.line1}
                        {item.line2}</p>
                    <p><span>{item.city}</span>, <span>{item.state}</span> <span>{item.zip}</span></p>
                </div>    
            )
        })
        return (
            <div className="card-body">
                {mappedList}
            </div>
        )
    }
}

export default UserProfileAddressTemplate
