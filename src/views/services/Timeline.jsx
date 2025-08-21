import React from 'react'
import './Timeline.css'
import { useParams } from 'react-router-dom'

const Timeline = () => {

    const { vehicleid, jobcardid } = useParams()
    console.log(vehicleid, jobcardid)
    return (
        <div className='timeline_container'>
         <div className="timeline_headers">
                <h4>VehicleNo:{vehicleid}</h4>
                <h4>Jobcardid:{jobcardid}</h4>
            </div>
        <div className="timeline">
           



            <div className="container left">
                <div className="content">
                    <h2>2017</h2>
                    <p>Lorem ipsum..</p>
                </div>
            </div>

            <div className="container right">
                <div className="content">
                    <h2>2016</h2>
                    <p>Lorem ipsum..</p>
                </div>
            </div>
        </div>
        </div>
    );

}

export default Timeline
