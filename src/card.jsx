import React from 'react'

function Card(props) {
    return (
        <div id="card-wrapper" >
            <div className="card-top" >{props.size}</div>
            <div className="card-content" style={{fontSize:props.size}} >{props.face}</div>
            <div className="card-foot" >
                <span id="price" >${props.price}</span>
                <span id="time" >{props.date}</span>
            </div>
        </div>
    )
}

export default Card
