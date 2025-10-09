import React from "react";
import { useColorModes } from "@coreui/react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaPlay, FaSpinner, FaUserCog } from "react-icons/fa";

const Timeline = ({ vehicleId, jobcardId }) => {
  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme');

  const isDark = colorMode === "dark";

  // Background and text colors for readability
  const bgColor = isDark ? "#2b2c2d" : "#f9f9f9";           // Slightly lighter/darker for card contrast
  const textColor = isDark ? "#f1f1f1" : "#222";            // High contrast text
  const iconBg = isDark ? "#4b8cff" : "#1976d2";            // Vibrant icon colors for visibility
  const iconColor = "#fff";

  const initial_timeline = {
    date: "12/09/24",
    fault: "Engine",
    assigned: "Sathya",
    spare: "Eng5678"
  };

  const second_timeline = {
    date: "19/09/24",
    engineer: "Sathya",
    approved_by: "Jhony"
  };

  const vehicleLogs = [
    { date: "13/10/24", Status: "Pending Inspection", Action_taken: "Vehicle received — visual check scheduled", Engineer: "Ravi Kumar" },
    { date: "13/10/24", Status: "Parts Ordered", Action_taken: "Ordered brake pads & oil filter (ETA 3 days)", Engineer: "Aisha Patel" },
    { date: "12/10/24", Status: "In Progress", Action_taken: "Removed wheel, inspected brake rotor — awaiting replacement", Engineer: "S. Mehta" },
    { date: "11/10/24", Status: "Completed", Action_taken: "Replaced brake pads, changed oil, performed road test — ok", Engineer: "Karan Singh" },
    { date: "10/10/24", Status: "Repaired & Released", Action_taken: "Fixed electrical fault in headlamp circuit; customer collected", Engineer: "Priya Sharma" }
  ];

  return (
    <div style={{ backgroundColor: isDark ? "#121212" : "#e5e5e5", minHeight: "100vh", padding: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: textColor, marginBottom: "20px" }}>
        <p>VehicleId: {vehicleId}</p>
        <p>JobcardId: {jobcardId}</p>
      </div>

      <VerticalTimeline>
        {/* Initial Timeline */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2024 - present"
          iconStyle={{ background: iconBg, color: iconColor }}
          contentStyle={{ background: bgColor, color: textColor, boxShadow: isDark ? "0 0 15px #000" : "0 0 15px #ccc" }}
          contentArrowStyle={{ borderRight: `7px solid ${iconBg}` }}
          icon={<FaPlay />}
        >
          <ul style={{ color: textColor }}>
            <li>Date: {initial_timeline.date}</li>
            <li>Fault: {initial_timeline.fault}</li>
            <li>Assigned: {initial_timeline.assigned}</li>
            <li>Spare: {initial_timeline.spare}</li>
          </ul>
        </VerticalTimelineElement>

        {/* Second Timeline */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2024-2025"
          iconStyle={{ background: iconBg, color: iconColor }}
          contentStyle={{ background: bgColor, color: textColor, boxShadow: isDark ? "0 0 15px #000" : "0 0 15px #ccc" }}
          contentArrowStyle={{ borderRight: `7px solid ${iconBg}` }}
          icon={<FaSpinner />}
        >
          <ul style={{ color: textColor }}>
            <li>Date: {second_timeline.date}</li>
            <li>Engineer: {second_timeline.engineer}</li>
            <li>Approved_by: {second_timeline.approved_by}</li>
          </ul>
        </VerticalTimelineElement>

        {/* Vehicle Logs */}
        {vehicleLogs.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            date={item.date}
            iconStyle={{ background: iconBg, color: iconColor }}
            contentStyle={{ background: bgColor, color: textColor, boxShadow: isDark ? "0 0 15px #000" : "0 0 15px #ccc" }}
            contentArrowStyle={{ borderRight: `7px solid ${iconBg}` }}
            icon={<FaUserCog />}
          >
            <ul style={{ color: textColor }}>
              <li>Status: {item.Status}</li>
              <li>Action_taken: {item.Action_taken}</li>
              <li>Engineer: {item.Engineer}</li>
            </ul>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
