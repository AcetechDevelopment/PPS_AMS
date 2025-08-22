import React from "react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaPlay, FaSpinner, FaUserCog, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";



const Timeline = ({ vehicleId, jobcardId }) => {
    console.log(vehicleId, jobcardId)

    const initial_timeline = {
        date: "12/09/24",
        fault: "Engine",
        assigned: "Sathya",
        spare: "Eng5678"
    }

    const second_timeline = {
        date: "19/09/24",
        engineer: "Sathya",
        approved_by: "Jhony"
    }


    const vehicleLogs = [
        { date: "13/10/24", Status: "Pending Inspection", Action_taken: "Vehicle received — visual check scheduled", Engineer: "Ravi Kumar" },
        { date: "13/10/24", Status: "Parts Ordered", Action_taken: "Ordered brake pads & oil filter (ETA 3 days)", Engineer: "Aisha Patel" },

        // extra examples you can use
        { date: "12/10/24", Status: "In Progress", Action_taken: "Removed wheel, inspected brake rotor — awaiting replacement", Engineer: "S. Mehta" },
        { date: "11/10/24", Status: "Completed", Action_taken: "Replaced brake pads, changed oil, performed road test — ok", Engineer: "Karan Singh" },
        { date: "10/10/24", Status: "Repaired & Released", Action_taken: "Fixed electrical fault in headlamp circuit; customer collected", Engineer: "Priya Sharma" }
    ];

    return (

        <div style={{ backgroundColor: "#C9CBCF" }}>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <p>VehicleId:{vehicleId}</p>
                <p>JobcardId:{jobcardId}</p>
            </div>
            <VerticalTimeline>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    // contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    // contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
                    date="2024 - present"
                    iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                 icon={<FaPlay/>}
                >
                    <ul>
                        <li>Date:{initial_timeline.date}</li>
                        <li>Fault:{initial_timeline.fault}</li>
                        <li>Assigned:{initial_timeline.assigned}</li>
                        <li>Spare:{initial_timeline.spare}</li>
                    </ul>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2024-2025"
                    iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                 icon={<FaSpinner />}
                >
                    <ul>
                        <li>Date:{second_timeline.date}</li>
                        <li>Engineer:{second_timeline.engineer}</li>
                        <li>Aproved_by:{second_timeline.approved_by}</li>
                    </ul>
                </VerticalTimelineElement>
                { vehicleLogs.map((item)=>(<VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date="2024-2025"
                    iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                 icon={<FaUserCog />}
                >
                   <ul>
                        <li>Date:{item.date}</li>
                        <li>Status:{item.Status}</li>
                        <li>Action_taken:{item.Action_taken}</li>
                        <li>Engineer:{item.Engineer}</li>

                    </ul> 
                </VerticalTimelineElement>))}
                

                
                {/* <VerticalTimelineElement iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }} icon={<StarIcon />} /> */}
            </VerticalTimeline>
        </div>
    );
};

export default Timeline;
