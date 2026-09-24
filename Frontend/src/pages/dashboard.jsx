import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate, useRouter } from "@/lib/router";
import DashboardFeatures from "./dashboardFeatures";
import "./dashboard.css";

const featureNav = [
  ["overview", "Overview", "dashboard"],
  ["courses", "Courses", "book"],
  ["schedule", "Schedule", "calendar"],
  ["assignments", "Assignments", "clipboard"],
  ["attendance", "Attendance", "check"],
  ["grades", "Grades & Reviews", "award"],
  ["events", "Events", "calendar"],
  ["announcements", "Announcements", "megaphone"],
  ["leave", "Requests & Leave", "plane"],
  ["placement", "Placement", "building"],
  ["people", "People", "users"],
  ["reports", "Reports", "folder"],
];

const roleMenus = {
  student: ["overview", "courses", "schedule", "assignments", "attendance", "grades", "events", "announcements", "leave"],
  faculty: ["overview", "courses", "schedule", "assignments", "attendance", "grades", "announcements", "leave", "people"],
  hod: ["overview", "courses", "schedule", "assignments", "attendance", "grades", "events", "announcements", "leave", "people", "reports"],
  placement: ["overview", "events", "announcements", "placement", "people", "reports"],
  admin: ["overview", "people", "reports", "events", "announcements"],
};

const iconPaths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4V21a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4H3a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4V3a1.7 1.7 0 0 0 1.1 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.36.36.7.6 1 .27.27.64.4 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6.6Z" /></>,
  analytics: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
  folder: <><path d="M3 6h7l2 2h9v11H3Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  book: <><path d="M4 5a3 3 0 0 1 3-3h5v18H7a3 3 0 0 0-3 3Z" /><path d="M20 5a3 3 0 0 0-3-3h-5v18h5a3 3 0 0 1 3 3Z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  award: <><circle cx="12" cy="8" r="5" /><path d="M8.5 12 7 22l5-3 5 3-1.5-10" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 10h6M9 14h6" /></>,
  megaphone: <><path d="m3 11 18-5v12L3 14ZM11 16l2 5H8l-2-6" /></>,
  plane: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  wallet: <><path d="M3 6h16v14H3Z" /><path d="M16 11h5v4h-5a2 2 0 0 1 0-4ZM7 6V4h13" /></>,
  building: <><path d="M4 21V5l8-3 8 3v16M8 9h2M14 9h2M8 13h2M14 13h2M10 21v-4h4v4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17v.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
};

function timeLabel(value) { const [rawHour, rawMinute = "00"] = String(value || "").split(":"); const hour = Number(rawHour); if (!Number.isFinite(hour)) return value || "—"; const suffix = hour >= 12 ? "PM" : "AM"; return `${String(hour % 12 || 12).padStart(2, "0")}:${rawMinute} ${suffix}`; }

function Icon({ name, size = 18 }) {
  return <svg className="portal-icon" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">{iconPaths[name] || iconPaths.dashboard}</svg>;
}

const roleViews = {
  admin: {
    portal: "ADMIN CONSOLE",
    title: "System Overview",
    subtitle: "CampusFlow Admin Console",
    nav: [["dashboard", "Dashboard"], ["users", "User Management"], ["settings", "System Settings"], ["analytics", "Analytics Hub"], ["folder", "Reports"], ["clipboard", "Audit Logs"], ["bell", "Notifications", 3]],
    stats: [["TOTAL USERS", "3,240", "Students & Staff", "users", "blue"], ["FACULTY MEMBERS", "186", "Across 12 departments", "book", "purple"], ["ACTIVE STUDENTS", "2,890", "Registered this term", "award", "green"], ["SYSTEM UPTIME", "99.7%", "AWS Hosted Cloud", "clock", "green"], ["PENDING ISSUES", "12", "Support Tickets Open", "alert", "red"]],
  },
  faculty: {
    portal: "FACULTY PORTAL",
    title: "Welcome back, Dr. Anderson",
    subtitle: "You have 2 classes today and 12 pending assignments to grade.",
    nav: [["dashboard", "Dashboard"], ["book", "My Courses"], ["users", "Attendance"], ["clipboard", "Grading", 12], ["calendar", "Schedule"], ["megaphone", "Announcements"], ["plane", "Leave Requests"]],
    stats: [["TOTAL STUDENTS", "142", "Active in 3 courses", "users", "blue"], ["HOURS/WEEK", "18.5", "Lecture & office hours", "clock", "green"], ["GRADING RATE", "94%", "Target rate is 90%", "clipboard", "green"], ["STUDENT RATING", "4.7", "From past course reviews", "star", "orange"]],
  },
  hod: {
    portal: "HOD DASHBOARD · CS DEPARTMENT",
    title: "Department Overview",
    subtitle: "Academic Year 2025-26 · Semester 2",
    nav: [["dashboard", "Overview"], ["users", "Faculty Management"], ["award", "Student Insights"], ["calendar", "Timetable Manager"], ["wallet", "Budget & Resources"], ["clipboard", "Leave Approvals", 4]],
    stats: [["STUDENT PERFORMANCE", "82.4%", "+2.1% average CGPA", "analytics", "green"], ["FACULTY ATTENDANCE", "96.8%", "-0.4% rolling average", "check", "blue"], ["COURSE COMPLETION", "74.2%", "Syllabus progress for Sem 2", "book", "orange"]],
  },
  placement: {
    portal: "PLACEMENT & HR",
    title: "Placement Analytics",
    subtitle: "Recruitment Cycle 2025-26 · Ongoing",
    nav: [["dashboard", "Analytics"], ["building", "Corporate Partners"], ["megaphone", "Recruitment Drives"], ["users", "Student Database"], ["award", "Offers & CTC", 24], ["clipboard", "Interviews"]],
    stats: [["STUDENTS PLACED", "78%", "Target Goal: 85% by June", "check", "green"], ["VISITING COMPANIES", "124", "32 premium partners", "building", "blue"], ["AVG PACKAGE PA", "14.2L", "Lakhs per annum average", "wallet", "purple"], ["HIGHEST OFFER", "42.0L", "Atlassian International", "award", "orange"]],
  },
  student: {
    portal: "STUDENT PORTAL",
    title: "Good morning, Elena",
    subtitle: "Here is your campus overview for today",
    nav: [["dashboard", "Dashboard"], ["book", "My Courses"], ["calendar", "Schedule"], ["award", "Grades"], ["clipboard", "Assignments", 3], ["users", "Clubs & Groups"], ["settings", "Support"]],
    stats: [["ATTENDANCE", "85%", "Minimum req: 75%", "clock", "green"], ["CUMULATIVE GPA", "3.80", "Top 5% of cohort", "award", "blue"], ["CREDITS EARNED", "64", "Of 120 required", "check", "green"], ["LIBRARY DUES", "$0.00", "No outstanding holds", "book", "orange"]],
  },
};

function StatCard({ label, value, detail, icon, tone }) {
  return <article className="portal-stat"><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div><i className={`portal-stat-icon ${tone}`}><Icon name={icon} size={22} /></i></article>;
}

function Panel({ title, action, children, className = "" }) {
  return <section className={`portal-card ${className}`}><header className="portal-card-header"><h2>{title}</h2>{action}</header>{children}</section>;
}

function LineChart({ values, labels, bars = false, color = "#3b82f6" }) {
  const width = 640;
  const height = 210;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => `${30 + index * ((width - 60) / (values.length - 1))},${height - 28 - ((value - min) / Math.max(max - min, 1)) * 130}`).join(" ");
  return <div className="portal-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trend chart"><line x1="28" y1="35" x2={width - 25} y2="35" /><line x1="28" y1="90" x2={width - 25} y2="90" /><line x1="28" y1="145" x2={width - 25} y2="145" />{bars && values.map((value, index) => <rect key={labels[index]} x={48 + index * 125} y={height - 25 - value / max * 130} width="52" height={value / max * 130} rx="8" />)}<polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{values.map((value, index) => <circle key={`${value}-${index}`} cx={30 + index * ((width - 60) / (values.length - 1))} cy={height - 28 - ((value - min) / Math.max(max - min, 1)) * 130} r="4" fill="#fff" stroke={color} strokeWidth="3" />)}</svg><div className="portal-chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div></div>;
}

function Donut({ segments, total, center }) {
  const stops = segments.reduce((result, segment) => { const start = result.cursor; const end = start + segment.value; result.stops.push(`${segment.color} ${start}% ${end}%`); result.cursor = end; return result; }, { cursor: 0, stops: [] }).stops.join(",");
  return <div className="portal-donut-wrap"><div className="portal-donut" style={{ background: `conic-gradient(${stops})` }}><span><strong>{center || total}</strong><small>{total ? "Total" : ""}</small></span></div><ul>{segments.map((segment) => <li key={segment.label}><i style={{ background: segment.color }} />{segment.label} <b>{segment.value}%</b></li>)}</ul></div>;
}

function Progress({ label, value, color = "#3b82f6" }) {
  return <div className="portal-progress"><div><span>{label}</span><b>{value}%</b></div><i><em style={{ width: `${value}%`, background: color }} /></i></div>;
}

function StudentContent({ curriculum, action }) {
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
  const periods = curriculum?.weeklySchedule?.find((item) => item.day === day)?.periods?.filter((period) => period.subject !== "Lunch").slice(0, 3) || [];
  return <><div className="portal-grid portal-grid-wide"><Panel title="Today's Timetable" action={<button onClick={() => action("Full schedule")}>View Full Schedule</button>}><div className="portal-list portal-timetable">{periods.length ? periods.map((period, index) => <button key={`${period.subject}-${index}`} className={index === 1 ? "is-live" : ""} onClick={() => action(period.subject)}><time>{period.time}</time><div><strong>{period.subject}</strong><small>{period.room || "CampusFlow classroom"}</small></div>{index === 1 && <em>Live now</em>}</button>) : <div className="portal-empty">No classes scheduled today.</div>}</div></Panel><Panel title="Recent Announcements"><div className="portal-list portal-announcements">{[["Dean's Office", "Registrations open for Summer internship credits.", "Today"], ["Library Support", "Database maintenance on Sunday. Catalog offline 2-4 AM.", "Yesterday"], ["Sports HOD", "Inter-college registration opened.", "2 days ago"]].map(([source, copy, time]) => <button key={source} onClick={() => action(source)}><small>{source}<i>{time}</i></small><span>{copy}</span></button>)}</div></Panel></div><div className="portal-grid portal-grid-wide"><Panel title="Upcoming Assignments" action={<button onClick={() => action("All assignments")}>All Assignments</button>}><div className="portal-list portal-assignments">{[["Linked List Lab Report", "Data Structures", "due tomorrow", "Urgent"], ["Data Visualization Notebook", "Data Visualization Lab", "due Friday", "In progress"]].map(([title, course, due, status]) => <button key={title} onClick={() => action(title)}><span><strong>{title}</strong><small>{course}</small></span><i>{due}</i><em>{status}</em></button>)}</div></Panel><Panel title="Enrolled Courses Progress"><div className="portal-progress-list"><Progress label="Data Structures" value={82} /><Progress label="Database Systems" value={91} color="#10b981" /><Progress label="Machine Learning" value={74} color="#8b5cf6" /></div></Panel></div></>;
}

function FacultyContent({ action }) {
  return <><div className="portal-grid portal-grid-faculty"><Panel title="Today's Lectures" action={<span>Spring '26</span>}><div className="portal-lecture-grid">{[["09:00 - 10:30", "Advanced Data Structures", "CS-401 · Section B", "Room 312", true], ["14:00 - 15:30", "Algorithm Analysis", "CS-302 · Section A", "Lab B", false]].map(([time, title, course, room, active]) => <article key={title}><div><time>{time}</time><span>{room}</span></div><strong>{title}</strong><small>{course}</small><button onClick={() => action(title)}>{active ? "Mark Attendance" : "Schedule Lab Session"}</button></article>)}</div></Panel><Panel title="Department Activity"><div className="portal-list portal-activity"><button onClick={() => action("HOD meeting")}><i className="blue" /><span><strong>HOD Meeting at 4:00 PM</strong><small>Annual Curriculum Review for 2026 in 3 hours</small></span></button><button onClick={() => action("Examiner list")}><i className="red" /><span><strong>External Examiner List</strong><small>Submit the final batch panel list.</small></span></button><button onClick={() => action("Course materials")}><i className="green" /><span><strong>New Course Materials</strong><small>12 new resources for CS-401.</small></span></button></div></Panel></div><div className="portal-grid portal-grid-faculty"><Panel title="Pending Submissions" action={<button onClick={() => action("All submissions")}>Grade All (12)</button>}><div className="portal-list portal-people">{[["Sarah Miller", "Graph Theory Quiz", "NEW"], ["James Wilson", "Data Structures Lab", "2h ago"], ["Anita Rao", "Algorithm Analysis", "Yesterday"]].map(([name, task, time]) => <button key={name} onClick={() => action(name)}><i>{name.split(" ").map((part) => part[0]).join("")}</i><span><strong>{name}</strong><small>{task}</small></span><em>{time}</em><b>Grade</b></button>)}</div></Panel><Panel title="Section Overview" className="portal-dark-card"><div className="portal-dark-progress"><Progress label="Attendance avg" value={92} /><Progress label="Syllabus completion" value={68} color="#ef4444" /></div></Panel></div></>;
}

function HodContent({ action }) {
  return <><div className="portal-grid portal-grid-hod"><Panel title="Department Performance Trend" action={<button onClick={() => action("Academic year filter")}>Academic Year 2025âŒ„</button>}><LineChart values={[78, 79, 80, 81]} labels={["2022", "2023", "2024", "2025"]} bars /></Panel><Panel title="Pending Approvals"><div className="portal-approvals">{[["LEAVE REQUEST", "Dr. Robert Chen", "Emergency Medical Leave · 2 Days", "Approve"], ["BUDGET REQUEST", "Lab Inventory Update", "20 High-End Workstations", "Review"]].map(([label, title, copy, actionLabel]) => <article key={title}><small>{label}</small><strong>{title}</strong><p>{copy}</p><button onClick={() => action(title)}>{actionLabel}</button></article>)}</div></Panel></div><div className="portal-grid portal-grid-hod"><Panel title="Faculty Status Overview" action={<button onClick={() => action("All faculty")}>View All Faculty</button>}><div className="portal-table"><div className="portal-table-head"><span>Faculty member</span><span>Designation</span><span>Assigned load</span><span>Attendance rating</span><span>Status</span></div>{[["Dr. Mark Anderson", "Associate Professor", "18 Hrs/Wk", "98%", "On campus"], ["Prof. Elena Rossi", "Assistant Professor", "14 Hrs/Wk", "92%", "In class"], ["Dr. Robert Chen", "Professor", "12 Hrs/Wk", "100%", "On leave"]].map((row) => <div key={row[0]}>{row.map((value, index) => <span key={value} className={index === 4 ? value.toLowerCase().replace(" ", "-") : ""}>{value}</span>)}</div>)}</div></Panel><div className="portal-stack"><Panel title="Resource Usage" className="portal-dark-card"><Progress label="Budget spent" value={68} /><Progress label="Lab occupancy" value={88} color="#ef4444" /><button onClick={() => action("Resource request")}>Request More Assets</button></Panel><Panel title="Upcoming Event"><small>Annual Tech Expo 2026</small><p>500+ students and 20+ sponsors.</p></Panel></div></div></>;
}

function PlacementContent({ action }) {
  return <><div className="portal-grid portal-grid-placement"><Panel title="Historical Placement Trends"><LineChart values={[62, 68, 67, 74, 78]} labels={["2021", "2022", "2023", "2024", "2025"]} /></Panel><Panel title="Placements by Department"><Donut total="654" segments={[{ label: "CS", value: 40, color: "#3b82f6" }, { label: "IT", value: 20, color: "#10b981" }, { label: "ECE", value: 15, color: "#f97316" }, { label: "Mech", value: 25, color: "#8b5cf6" }]} /></Panel><Panel title="Live Recruitment Drives"><div className="portal-list portal-drives"><button onClick={() => action("AWS drive")}><small>Live now</small><strong>Amazon AWS SDE Drive</strong><span>Tech Round 2 · 42 active</span></button><button onClick={() => action("Google internship")}><small>Tomorrow</small><strong>Google STEP Internship</strong><span>18 shortlisted candidates</span></button></div></Panel></div><div className="portal-grid portal-grid-placement"><Panel title="Recent Placement Offers" action={<button onClick={() => action("All offers")}>View All Offers</button>}><div className="portal-table four"><div className="portal-table-head"><span>Student</span><span>Company</span><span>Package</span><span>Status</span></div>{[["Elena Vasquez", "Microsoft (SDE-1)", "28.5 LPA", "Accepted"], ["Jordan Smith", "Atlassian (Product)", "32.0 LPA", "Offered"], ["Rahul Mehta", "TCS (Digital)", "7.5 LPA", "Accepted"]].map((row) => <div key={row[0]}>{row.map((value) => <span key={value}>{value}</span>)}</div>)}</div></Panel><div className="portal-stack"><Panel title="Placement Eligibility" className="portal-dark-card"><Progress label="Eligible students" value={93} /><Progress label="Pre-placement training" value={94} color="#ef4444" /><button onClick={() => action("Placement shortlists")}>Download Shortlists</button></Panel><Panel title="HR Notifications"><div className="portal-list portal-notifications"><button onClick={() => action("Goldman Sachs")}><i className="blue" /><span><strong>Goldman Sachs Confirmation</strong><small>Interview drive for Aug 12-14.</small></span></button><button onClick={() => action("Pending TCS")}><i className="red" /><span><strong>Pending TCS Acceptances</strong><small>12 students have not accepted.</small></span></button></div></Panel></div></div></>;
}

function AdminContent({ action }) {
  return <><div className="portal-grid portal-grid-admin"><Panel title="Daily Active Users (DAU)"><LineChart values={[1100, 1480, 720, 2050, 1900]} labels={["W1", "W2", "W3", "W4", "W5"]} /></Panel><Panel title="Module Daily Usage"><div className="portal-usage"><Progress label="Student Portal" value={92} /><Progress label="Faculty Portal" value={78} color="#8b5cf6" /><Progress label="Placement Desk" value={65} color="#10b981" /></div></Panel><Panel title="Admin Quick Actions"><div className="portal-quick-actions">{[["Generate Reports", "System-wide audit logs", "folder"], ["Manage Roles", "Update user access", "users"], ["Backup Cloud Data", "Perform snapshot archive", "settings"]].map(([title, copy, icon]) => <button key={title} onClick={() => action(title)}><Icon name={icon} /><span><strong>{title}</strong><small>{copy}</small></span></button>)}</div></Panel></div><div className="portal-grid portal-grid-admin"><Panel title="Recent System Activity Logs"><div className="portal-list portal-logs">{[["Database Backup Completed Successfully", "Automated weekly backup. Uptime normal.", "12 mins ago", "check"], ["Role Updated: Dr. Mark Anderson", "Elevated privilege to Lead Administrator.", "1h ago", "users"], ["Minor Latency Spike on HOD Domain", "API threshold warning exceeded.", "2h ago", "alert"]].map(([title, copy, time, icon]) => <button key={title} onClick={() => action(title)}><i className={icon}><Icon name={icon} size={16} /></i><span><strong>{title}</strong><small>{copy}</small></span><em>{time}</em></button>)}</div></Panel><Panel title="Active Sessions by Role" className="portal-dark-card"><Donut total={420} segments={[{ label: "Students", value: 58, color: "#3b82f6" }, { label: "Faculty", value: 25, color: "#10b981" }, { label: "Admin", value: 17, color: "#f97316" }]} /></Panel><Panel title="Diagnostic Summary"><div className="portal-diagnostics">{[["Storage Used (500GB)", "67%"], ["API Calls Today", "12,456"], ["Response Latency", "142ms"]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></Panel></div></>;
}

function LiveToday({ live, role }) {
  const periods = live.periods.filter((period) => period.type !== "break");
  const list = role === "student" ? live.subjects : role === "faculty" || role === "hod" ? live.students : live.faculty;
  const label = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" });
  return <div className="portal-grid portal-grid-wide"><Panel title="Live Timetable" action={<span>{label}</span>}>{periods.length ? <div className="portal-live-list">{periods.map((period, index) => <article key={`${period.subjectinfo?._id || period.subjectCode || "period"}-${index}`}><time>{timeLabel(period.start)} – {timeLabel(period.end)}</time><div><strong>{period.subjectinfo?.name || period.subjectName}</strong><small>{period.subjectinfo?.code || period.subjectCode || "-"} · {period.roominfo?.code || period.roomCode || "Room TBD"}</small></div><em>{period.faculty?.[0]?.user?.username || period.faculty?.[0]?.designation || "Faculty TBD"}</em></article>)}</div> : <div className="portal-empty">No published classes for today.</div>}</Panel><Panel title={role === "student" ? "Enrolled Subjects" : "Faculty Directory"} action={<span>{role === "student" ? `${live.subjects.length} subjects` : `${live.faculty.length} members`}</span>}>{list.length ? <div className="portal-live-list compact">{list.slice(0, 6).map((item) => <article key={item._id}><div><strong>{item.name || item.user?.username || item.username}</strong><small>{item.code || item.designation || item.specialization?.[0] || item.email || "-"}</small></div></article>)}</div> : <div className="portal-empty">No records yet.</div>}</Panel></div>;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { path } = useRouter();
  const [notice, setNotice] = useState("");
  const [curriculum, setCurriculum] = useState(null);
  const [live, setLive] = useState({ periods: [], subjects: [], faculty: [], students: [] });
  const role = ({ teacher: "faculty", "placement-office": "placement" })[user?.role] || user?.role || "student";
  const view = roleViews[role] || roleViews.student;
  const visibleNav = featureNav.filter(([id]) => (roleMenus[role] || roleMenus.student).includes(id));
  const firstName = (user?.username || "CampusFlow").split(" ")[0];
  const active = visibleNav.some(([id]) => id === path.split("/")[2]) ? path.split("/")[2] : "overview";
  const title = active === "overview"
    ? role === "student" ? `Good morning, ${firstName}` : role === "faculty" ? `Welcome back, ${firstName}` : view.title
    : featureNav.find(([id]) => id === active)?.[1];
  const portal = role === "hod" ? `${(user?.department || "CampusFlow").toUpperCase()} DEPARTMENT` : view.portal;
  const statCountClass = view.stats.length === 5 ? "five" : "";

  useEffect(() => {
    if (role !== "student" || user?.branch !== "CSE-DSA" || Number(user?.year) !== 3 || Number(user?.semester) !== 1) {
      setCurriculum(null);
      return undefined;
    }
    let current = true;
    api.get("/subject-api/curriculum/btech-3").then((data) => { if (current) setCurriculum(data.payload); }).catch(() => { if (current) setCurriculum(null); });
    return () => { current = false; };
  }, [role, user?.branch, user?.semester, user?.year]);

  useEffect(() => {
    if (!user) return undefined;
    let current = true;
    const query = new URLSearchParams({ branch: user.branch || "CSE-DSA", year: user.year || 3, semester: user.semester || 1 });
    Promise.all([
      api.get(`/timetable-api/current?${query}`).catch(() => ({ payload: null })),
      api.get("/subject-api/all").catch(() => ({ payload: [] })),
      api.get("/faculty-api/all").catch(() => ({ payload: [] })),
      api.get("/student-api/all").catch(() => ({ payload: [] })),
    ]).then(([timetable, subjects, faculty, students]) => {
      if (!current) return;
      const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const today = (timetable.payload?.days || []).find((day) => day.day === weekday);
      setLive({ periods: today?.periods || [], subjects: subjects.payload || [], faculty: faculty.payload || [], students: students.payload || [] });
    }).catch(() => {});
    return () => { current = false; };
  }, [user?._id, user?.id, user?.branch, user?.semester, user?.year]);

  const initials = (user?.username || "CF").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  if (!user) return null;
  const action = (label) => {
    const routes = {
      "Full schedule": "schedule",
      "All assignments": "assignments",
      "Grade": "grades",
      "Grade All (12)": "grades",
      "Mark Attendance": "attendance",
      "New Recruitment Drive": "placement",
      "Recruitment drive": "placement",
      "Export Report": "reports",
      "Export report": "reports",
      "Generate Reports": "reports",
      "Manage Roles": "people",
    };
    navigate(`/dashboard/${routes[label] || "assignments"}`);
  };
  const signOut = async () => { await logout(); navigate("/"); };
  const overview = <><LiveToday live={live} role={role} />{role === "student" ? <StudentContent curriculum={curriculum} action={action} /> : role === "faculty" ? <FacultyContent action={action} /> : role === "hod" ? <HodContent action={action} /> : role === "placement" ? <PlacementContent action={action} /> : <AdminContent action={action} />}</>;
  const content = active === "overview" ? overview : <DashboardFeatures active={active} role={role} user={user} onNotice={setNotice} />;

  return <div className="portal-dashboard"><aside className="portal-sidebar"><button className="portal-logo" onClick={() => navigate("/")}><i><Icon name={role === "faculty" ? "book" : role === "hod" || role === "admin" ? "settings" : "dashboard"} /></i><span>CampusFlow<small>{portal}</small></span></button><nav>{visibleNav.map(([id, label, icon]) => <button className={active === id ? "active" : ""} key={id} onClick={() => { navigate(`/dashboard/${id}`); setNotice(""); }}><Icon name={icon} /><span>{label}</span></button>)}</nav><div className="portal-sidebar-user"><i>{initials}</i><span><strong>{user.username}</strong><small>{portal}</small></span><button onClick={signOut} aria-label="Sign out"><Icon name="logout" /></button></div></aside><main className="portal-content"><header className="portal-header"><div><h1>{title}</h1><p>{active === "overview" ? view.subtitle : "Live CampusFlow workspace"}</p></div><div className="portal-header-tools">{role === "admin" ? <span className="portal-status"><i />All Systems Operational</span> : role === "placement" ? <button className="portal-primary-action" onClick={() => action("Recruitment drive")}><Icon name="plus" />New Recruitment Drive</button> : role === "hod" ? <button className="portal-primary-action dark" onClick={() => action("Export report")}>Export Report</button> : <label className="portal-search"><Icon name="search" /><input placeholder={role === "faculty" ? "Type to search student, exam..." : "Search course, tasks, etc."} /></label>}<button className="portal-icon-button" onClick={() => setNotice("You have 3 new notifications.")} aria-label="Notifications"><Icon name="bell" /><i /></button><button className="portal-icon-button portal-mobile-logout" onClick={signOut} aria-label="Sign out"><Icon name="logout" /></button></div></header>{notice && <div className="portal-notice" role="status">{notice}<button onClick={() => setNotice("")}>×</button></div>}{active === "overview" && <section className={`portal-stats ${statCountClass}`}>{view.stats.map(([label, value, detail, icon, tone]) => <StatCard key={label} {...{ label, value, detail, icon, tone }} />)}</section>}{content}</main></div>;
}



