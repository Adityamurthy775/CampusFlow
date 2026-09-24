import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

const sectionNames = {
  courses: "Courses",
  schedule: "Schedule",
  assignments: "Assignments",
  attendance: "Attendance",
  grades: "Grades & Reviews",
  events: "Events",
  announcements: "Announcements",
  leave: "Requests & Leave",
  placement: "Placement",
  people: "People",
  reports: "Reports",
};

function Field({ label, children }) {
  return <label className="portal-field"><span>{label}</span>{children}</label>;
}

function Empty({ children = "No records found." }) {
  return <div className="portal-empty">{children}</div>;
}

function DetailModal({ detail, onClose }) {
  if (!detail) return null;
  const { type, item } = detail;
  const isAssignment = type === "assignment";
  return <div className="portal-modal-backdrop" role="presentation" onClick={onClose}><section className="portal-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="portal-modal-close" onClick={onClose} aria-label="Close">×</button><span className="portal-modal-kicker">{isAssignment ? "Assignment details" : "Announcement details"}</span><h2>{item.name || item.title}</h2><p className="portal-modal-meta">{isAssignment ? `${item.subjectinfo?.name || "Subject"} · Due ${date(item.duedate)}` : `${item.postedby?.username || "CampusFlow"} · ${date(item.createdAt)}`}</p><p>{isAssignment ? item.descp : item.content}</p>{isAssignment && item.instructions && <div className="portal-modal-section"><strong>Instructions</strong><p>{item.instructions}</p></div>}{isAssignment && <div className="portal-modal-facts"><span><b>Maximum marks</b>{item.maxmarks || "-"}</span><span><b>Status</b>{item.status || "-"}</span><span><b>Teacher</b>{item.teacherinfo?.username || "-"}</span></div>}</section></div>;
}

function Table({ headers, rows, empty = "No records found." }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  return <div className="portal-data-table"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.key || index}>{headers.map((header) => <td key={header}>{row[header] ?? "-"}</td>)}</tr>)}</tbody></table></div>;
}

function date(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

function timeLabel(value) {
  if (!value) return "-";
  const [rawHour, rawMinute = "00"] = String(value).split(":");
  const hour = Number(rawHour);
  if (!Number.isFinite(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, "0")}:${rawMinute} ${suffix}`;
}

function downloadCsv(name, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DashboardFeatures({ active, role, user, onNotice }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [detail, setDetail] = useState(null);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let result = {};
      if (active === "courses") {
        const [subjects, curriculum] = await Promise.all([api.get("/subject-api/all"), api.get("/subject-api/curriculum/btech-3")]);
        result = { subjects: subjects.payload || [], curriculum: curriculum.payload };
      }
      if (active === "schedule") {
        const branch = encodeURIComponent(user.branch || "CSE-DSA");
        const year = encodeURIComponent(user.year || 3);
        const semester = encodeURIComponent(user.semester || 1);
        const schedule = await api.get(`/timetable-api/current?branch=${branch}&year=${year}&semester=${semester}`);
        result = { schedule: schedule.payload };
      }
      if (active === "assignments") {
        const query = new URLSearchParams({ branch: user.branch || "CSE-DSA", year: user.year || 3, semester: user.semester || 1 });
        const [assignments, submissions, subjects] = await Promise.all([api.get(`/assignment-api/all?${query}`), api.get("/submission-api/all"), api.get("/subject-api/all")]);
        result = { assignments: assignments.payload || [], submissions: submissions.payload || [], subjects: subjects.payload || [] };
      }
      if (active === "attendance") {
        const [records, subjects, users] = await Promise.all([api.get("/attendance-api/all"), api.get("/subject-api/all"), api.get("/user-api/all")]);
        result = { records: records.payload || [], subjects: subjects.payload || [], users: users.payload || [] };
      }
      if (active === "grades") {
        const [submissions, assignments] = await Promise.all([api.get("/submission-api/all"), api.get("/assignment-api/all")]);
        result = { submissions: submissions.payload || [], assignments: assignments.payload || [] };
      }
      if (active === "events") {
        const events = await api.get("/event-api/all");
        result = { events: events.payload || [] };
      }
      if (active === "announcements") {
        const announcements = await api.get("/announcement-api/all");
        result = { announcements: announcements.payload || [] };
      }
      if (active === "leave") {
        const requests = await api.get("/request-api/all");
        result = { requests: requests.payload || [] };
      }
      if (active === "placement") {
        const [companies, drives] = await Promise.all([api.get("/company-api/all"), api.get("/drive-api/all")]);
        result = { companies: companies.payload || [], drives: drives.payload || [] };
      }
      if (active === "people") {
        const users = await api.get("/user-api/all");
        result = { users: users.payload || [] };
      }
      if (active === "reports") {
        const [assignments, submissions, attendance, events, requests, drives] = await Promise.all([api.get("/assignment-api/all"), api.get("/submission-api/all"), api.get("/attendance-api/all"), api.get("/event-api/all"), api.get("/request-api/all"), api.get("/drive-api/all")]);
        result = { assignments: assignments.payload || [], submissions: submissions.payload || [], attendance: attendance.payload || [], events: events.payload || [], requests: requests.payload || [], drives: drives.payload || [] };
      }
      setData(result);
    } catch (err) {
      setError(err.message);
      setData({});
    } finally {
      setLoading(false);
    }
  }, [active, user._id, user.branch, user.semester, user.year]);

  useEffect(() => {
    setForm({});
    setFile(null);
    setDetail(null);
    load();
  }, [load]);

  async function submit(path, body, success, upload = false, method = "POST") {
    setBusy(true);
    setError("");
    try {
      if (upload) await api.upload(path, body, method);
      else await (method === "PATCH" ? api.patch(path, body) : api.post(path, body));
      setForm({});
      setFile(null);
      await load();
      onNotice(success);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <section className="portal-card portal-workspace-state">Loading {sectionNames[active]}…</section>;
  if (error && !Object.keys(data).length) return <section className="portal-card portal-workspace-state error"><strong>Could not load this feature.</strong><span>{error}</span><button onClick={load}>Retry</button></section>;

  const myId = user._id || user.id;
  const isFaculty = role === "teacher" || role === "faculty";
  const ownedSubjects = isFaculty
    ? (data.subjects || []).filter((subject) => [subject.teacherinfo?._id, ...(subject.additionalFaculty || []).map((member) => member._id)].map(String).includes(String(myId)))
    : (data.subjects || []);

  if (active === "courses") {
    const courses = role === "student" ? data.curriculum?.subjects : data.subjects;
    return <> <div className="portal-workspace"><section className="portal-card"><div className="portal-section-heading"><div><h2>{role === "student" ? "Enrolled Courses" : "Course Catalog"}</h2><p>Live subject and curriculum records.</p></div></div><Table headers={["Code", "Course", "Credits", "Year", "Semester", "Faculty"]} empty="No subjects are available." rows={(courses || []).map((item) => ({ key: item.code || item._id, Code: item.code, Course: item.name, Credits: item.credits, Year: item.year, Semester: item.semester, Faculty: item.faculty?.join?.(", ") || item.teacherinfo?.username || "-" }))} /></section></div></>
  }

  if (active === "schedule") {
    const days = data.schedule?.days || [];
    return <div className="portal-workspace"><section className="portal-card"><div className="portal-section-heading"><div><h2>Weekly Schedule</h2><p>{data.schedule?.branch} · Year {data.schedule?.year} · Semester {data.schedule?.semester}</p></div></div><div className="portal-schedule-days">{days.map((day) => <article key={day.day}><h3>{day.day}</h3>{day.periods.map((period, index) => <div key={`${period.subjectinfo?.code}-${index}`}><time>{timeLabel(period.start)} – {timeLabel(period.end)}</time><strong>{period.subjectinfo?.name || period.subjectName}</strong><small>{period.roominfo?.code || period.roomCode || "Room TBD"} · {period.faculty?.[0]?.designation || "Faculty TBD"}</small></div>)}</article>)}</div></section></div>;
  }

  if (active === "assignments") {
    const canCreate = isFaculty || ["hod", "admin"].includes(role);
    const mySubmission = (assignmentId) => data.submissions?.find((item) => (item.assignment?._id || item.assignment) === assignmentId);
    return <> <div className="portal-workspace"><div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>Assignments</h2><p>Create, download, submit, and track work.</p></div></div><div className="portal-card-list">{data.assignments?.map((assignment) => { const submission = mySubmission(assignment._id); return <article className="portal-clickable-card" onClick={() => setDetail({ type: "assignment", item: assignment })} key={assignment._id}><div><strong>{assignment.name}</strong><small>{assignment.subjectinfo?.name} · Due {date(assignment.duedate)}</small></div><span>{assignment.status}</span><p>{!submission ? "Not submitted" : submission.marksobtained == null ? "Awaiting grade" : `${submission.marksobtained}/${submission.assignment?.maxmarks || "-"}`}</p>{isFaculty && <small className="portal-submission-summary">Submitted by: {data.submissions?.filter((item) => String(item.assignment?._id || item.assignment) === String(assignment._id)).map((item) => item.studentinfo?.username).filter(Boolean).join(", ") || "No student submissions yet"}</small>}<div>{assignment.attachments?.map((attachment, index) => <button key={attachment.storageName} onClick={(event) => { event.stopPropagation(); api.download(`/assignment-api/download/${assignment._id}/${index}`, attachment.originalName); }}>Download brief</button>)}{submission && <button onClick={(event) => { event.stopPropagation(); api.download(`/submission-api/download/${submission._id}/0`, submission.attachments?.[0]?.originalName || "submission"); }}>Download submission</button>}</div></article>; })}</div>{!data.assignments?.length && <Empty />}</section>{canCreate && <section className="portal-card"><div className="portal-section-heading"><div><h2>Upload Assignment</h2><p>Share the brief and deadline with your subject.</p></div></div><form onSubmit={(event) => { event.preventDefault(); const subject = ownedSubjects.find((item) => String(item._id) === String(form.subjectinfo) || item.code?.toLowerCase() === form.subjectinfo?.trim().toLowerCase() || item.name?.toLowerCase() === form.subjectinfo?.trim().toLowerCase()); if (!subject) return setError("Enter a valid assigned subject code or name"); const body = new FormData(); Object.entries({ ...form, subjectinfo: subject._id }).forEach(([key, value]) => body.append(key, value)); if (file) body.append("file", file); submit("/assignment-api/create", body, "Assignment published successfully", true); }}><Field label="Title"><input required value={form.name || ""} onChange={set("name")} /></Field><Field label="Subject"><input required value={form.subjectinfo || ""} onChange={set("subjectinfo")} placeholder="Enter subject code or name" /></Field><Field label="Description"><textarea required value={form.descp || ""} onChange={set("descp")} /></Field><Field label="Instructions"><textarea value={form.instructions || ""} onChange={set("instructions")} /></Field><div className="portal-form-row"><Field label="Due date"><input required type="date" value={form.duedate || ""} onChange={set("duedate")} /></Field><Field label="Maximum marks"><input min="1" type="number" value={form.maxmarks || ""} onChange={set("maxmarks")} /></Field></div><Field label="Assignment file (PDF, Office, image, text, or ZIP upto 10 MB)"><input required type="file" onChange={(event) => setFile(event.target.files[0] || null)} /></Field><button className="portal-primary-action" disabled={busy}>{busy ? "Publishing…" : "Publish assignment"}</button></form></section>}{role === "student" && <section className="portal-card"><div className="portal-section-heading"><div><h2>Submit Assignment</h2><p>Upload your answer file for an open assignment.</p></div></div><form onSubmit={(event) => { event.preventDefault(); if (!file) return setError("Choose a submission file"); const body = new FormData(); body.append("file", file); submit(`/submission-api/create/${form.assignmentId}`, body, "Assignment submitted successfully", true); }}><Field label="Assignment"><select required value={form.assignmentId || ""} onChange={set("assignmentId")}><option value="">Select assignment</option>{data.assignments?.map((assignment) => <option value={assignment._id} key={assignment._id}>{assignment.name}</option>)}</select></Field><Field label="Answer file (upto 10 MB)"><input required type="file" onChange={(event) => setFile(event.target.files[0] || null)} /></Field><button className="portal-primary-action" disabled={busy || !form.assignmentId}>{busy ? "Submitting…" : "Submit assignment"}</button></form></section>}</div></div><DetailModal detail={detail} onClose={() => setDetail(null)} /></>;
  }

  if (active === "attendance") {
    const canMark = isFaculty || ["hod", "admin"].includes(role);
    const markable = isFaculty ? ownedSubjects : data.subjects || [];
    return <div className="portal-workspace"><div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>Attendance Records</h2><p>Live student attendance.</p></div></div><Table headers={["Date", "Student", "Subject", "Status", "Marked by"]} empty="No attendance records." rows={(data.records || []).map((record) => ({ key: record._id, Date: date(record.date), Student: record.studentid?.username, Subject: record.subjectinfo?.name, Status: record.status, "Marked by": record.markedBy?.username }))} /></section>{canMark && <section className="portal-card"><div className="portal-section-heading"><div><h2>Mark Attendance</h2><p>Save a present/absent record for one student.</p></div></div><form onSubmit={(event) => { event.preventDefault(); submit("/attendance-api/mark", { subjectinfo: form.subjectinfo, date: form.date, records: [{ studentid: form.studentid, status: form.status || "present" }] }, "Attendance saved successfully"); }}><Field label="Subject"><select required value={form.subjectinfo || ""} onChange={set("subjectinfo")}><option value="">Select subject</option>{markable.map((subject) => <option value={subject._id} key={subject._id}>{subject.code} · {subject.name}</option>)}</select></Field><Field label="Student"><select required value={form.studentid || ""} onChange={set("studentid")}><option value="">Select student</option>{data.users?.filter((item) => item.role === "student").map((item) => <option value={item._id} key={item._id}>{item.username}</option>)}</select></Field><div className="portal-form-row"><Field label="Date"><input required type="date" value={form.date || new Date().toISOString().slice(0, 10)} onChange={set("date")} /></Field><Field label="Status"><select value={form.status || "present"} onChange={set("status")}><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></Field></div><button className="portal-primary-action" disabled={busy}>{busy ? "Saving…" : "Save record"}</button></form></section>}</div></div>;
  }

  if (active === "grades") {
    const canReview = isFaculty || ["hod", "admin"].includes(role);
    const reviewQueue = (data.submissions || []).filter((submission) => !submission.gradedBy);
    return <div className="portal-workspace"><div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>{role === "student" ? "My Grades" : "Submission Review Queue"}</h2><p>Marks, grades, feedback, and review status.</p></div></div><Table headers={["Assignment", "Student", "Marks", "Grade", "Status", "Feedback"]} empty="No submissions yet." rows={(data.submissions || []).map((submission) => ({ key: submission._id, Assignment: submission.assignment?.name, Student: submission.studentinfo?.username, Marks: submission.marksobtained ?? "-", Grade: submission.grade || "-", Status: submission.status, Feedback: submission.feedback || "-" }))} /></section>{canReview && <section className="portal-card"><div className="portal-section-heading"><div><h2>Review Submission</h2><p>Faculty feedback and marks.</p></div></div><form onSubmit={(event) => { event.preventDefault(); submit(`/submission-api/review/${form.submissionId}`, { marksobtained: form.marksobtained, grade: form.grade, feedback: form.feedback, status: form.status || "graded" }, "Submission reviewed successfully", false, "PATCH"); }}><Field label="Submission"><select required value={form.submissionId || ""} onChange={set("submissionId")}><option value="">Select pending submission</option>{reviewQueue.map((submission) => <option value={submission._id} key={submission._id}>{submission.studentinfo?.username} · {submission.assignment?.name}</option>)}</select></Field><div className="portal-form-row"><Field label="Marks"><input required min="0" step="0.01" type="number" value={form.marksobtained || ""} onChange={set("marksobtained")} /></Field><Field label="Grade"><input value={form.grade || ""} onChange={set("grade")} placeholder="A+" /></Field></div><Field label="Feedback"><textarea value={form.feedback || ""} onChange={set("feedback")} /></Field><Field label="Status"><select value={form.status || "graded"} onChange={set("status")}><option value="graded">Graded</option><option value="returned">Returned for revision</option><option value="under_review">Under review</option></select></Field><button className="portal-primary-action" disabled={busy || !form.submissionId}>{busy ? "Saving…" : "Save review"}</button></form></section>}</div></div>;
  }

  if (active === "events") {
    const canPublish = ["admin", "hod", "placement-office"].includes(role);
    return <div className="portal-workspace"><div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>Campus Events</h2><p>Academic, cultural, sports, placement, and exam events.</p></div></div><div className="portal-card-list">{data.events?.map((event) => { const joined = event.participants?.some((participant) => String(participant?._id || participant) === String(myId)); return <article key={event._id}><div><strong>{event.name}</strong><small>{event.catogery} · {date(event.startdate)} – {date(event.enddate)}</small></div><span>{event.status}</span><p>{event.decp}</p>{role === "student" && event.status === "published" && <button type="button" className="portal-secondary-action" disabled={joined || busy} onClick={(click) => { click.stopPropagation(); submit(`/event-api/join/${event._id}`, {}, joined ? "" : "Event joined successfully"); }}>{joined ? "Joined" : busy ? "Joining…" : "Join event"}</button>}</article>; })}{!data.events?.length && <Empty />}</div></section><section className="portal-card"><div className="portal-section-heading"><div><h2>Create Event</h2><p>Student events enter the review queue.</p></div></div><form onSubmit={(event) => { event.preventDefault(); submit("/event-api/create", { ...form, catogery: form.catogery || "academic", members: Number(form.members) || 0, status: canPublish ? "published" : "pending" }, "Event created successfully"); }}><Field label="Event name"><input required value={form.name || ""} onChange={set("name")} /></Field><Field label="Category"><select required value={form.catogery || "academic"} onChange={set("catogery")}><option value="academic">Academic</option><option value="cultural">Cultural</option><option value="sports">Sports</option><option value="placement">Placement</option><option value="holiday">Holiday</option><option value="exam">Exam</option><option value="seminar">Seminar</option><option value="other">Other</option></select></Field><Field label="Description"><textarea required value={form.decp || ""} onChange={set("decp")} /></Field><div className="portal-form-row"><Field label="Start date"><input required type="date" value={form.startdate || ""} onChange={set("startdate")} /></Field><Field label="End date"><input required type="date" value={form.enddate || ""} onChange={set("enddate")} /></Field><Field label="Members"><input min="0" type="number" value={form.members || 0} onChange={set("members")} /></Field></div><button className="portal-primary-action" disabled={busy}>{busy ? "Publishing…" : "Create event"}</button></form></section></div></div>;
  }

  if (active === "announcements") {
    const canCreate = isFaculty || ["hod", "admin", "placement-office"].includes(role);
    return <> <div className="portal-workspace"><div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>Announcements</h2><p>Campus-wide and role updates.</p></div></div><div className="portal-card-list">{data.announcements?.map((announcement) => <article className="portal-clickable-card" onClick={() => setDetail({ type: "announcement", item: announcement })} key={announcement._id}><div><strong>{announcement.name}</strong><small>{announcement.postedby?.username} · {date(announcement.createdAt)}</small></div><span>{announcement.priority}</span><p>{announcement.content}</p></article>)}{!data.announcements?.length && <Empty />}</div></section><section className="portal-card"><div className="portal-section-heading"><div><h2>Post Announcement</h2><p>Visible to every authenticated role.</p></div></div>{canCreate ? <form onSubmit={(event) => { event.preventDefault(); submit("/announcement-api/create", form, "Announcement published successfully"); }}><Field label="Title"><input required value={form.name || ""} onChange={set("name")} /></Field><Field label="Message"><textarea required value={form.content || ""} onChange={set("content")} /></Field><Field label="Priority"><select value={form.priority || "normal"} onChange={set("priority")}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></Field><button className="portal-primary-action" disabled={busy}>{busy ? "Publishing…" : "Publish announcement"}</button></form> : <Empty>Only faculty, HOD, placement office, and admin can publish announcements.</Empty>}</section></div></div><DetailModal detail={detail} onClose={() => setDetail(null)} /></>;
  }

  if (active === "leave") {
    const canReview = ["admin", "hod"].includes(role);
    return <div className="portal-workspace"><div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>Requests & Leave Letters</h2><p>Submission history and decisions.</p></div></div><div className="portal-card-list">{data.requests?.map((request) => <article key={request._id}><div><strong>{request.title}</strong><small>{request.userinfo?.username} · {date(request.createdAt)}</small></div><span>{request.action}</span><p>{request.subject}{request.fromDate ? ` · ${date(request.fromDate)} - ${date(request.toDate)}` : ""}</p>{request.reviewComment && <blockquote>{request.reviewComment}</blockquote>}{request.attachments?.map((attachment, index) => <button key={attachment.storageName} onClick={() => api.download(`/request-api/download/${request._id}/${index}`, attachment.originalName)}>Download attachment</button>)}</article>)}{!data.requests?.length && <Empty />}</div></section><section className="portal-card"><div className="portal-section-heading"><div><h2>Submit Request</h2><p>Leave letters support an optional file.</p></div></div><form onSubmit={(event) => { event.preventDefault(); const body = new FormData(); Object.entries(form).forEach(([key, value]) => body.append(key, value)); if (file) body.append("file", file); submit("/request-api/create", body, "Request submitted successfully", true); }}><Field label="Category"><select required value={form.catogery || "leave"} onChange={set("catogery")}><option value="leave">Leave letter</option><option value="document_request">Document request</option><option value="fee_related">Fee related</option><option value="course_drop">Course drop</option><option value="subject_change">Subject change</option><option value="project_extension">Project extension</option><option value="grievance">Grievance</option><option value="other">Other</option></select></Field><Field label="Title"><input required value={form.title || ""} onChange={set("title")} /></Field><Field label="Details / Reason"><textarea required value={form.subject || ""} onChange={set("subject")} /></Field>{form.catogery === "leave" && <div className="portal-form-row"><Field label="From"><input required type="date" value={form.fromDate || ""} onChange={set("fromDate")} /></Field><Field label="To"><input required type="date" value={form.toDate || ""} onChange={set("toDate")} /></Field></div>}<Field label="Priority"><select value={form.priority || "normal"} onChange={set("priority")}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></Field><Field label="Attachment (optional, upto 10 MB)"><input type="file" onChange={(event) => setFile(event.target.files[0] || null)} /></Field><button className="portal-primary-action" disabled={busy}>{busy ? "Submitting…" : "Submit request"}</button></form></section>{canReview && <section className="portal-card"><div className="portal-section-heading"><div><h2>Review Requests</h2><p>Approve, reject, or comment on pending requests.</p></div></div><form onSubmit={(event) => { event.preventDefault(); submit(`/request-api/review/${form.requestId}`, { action: form.action || "approved", comment: form.comment || "" }, "Request reviewed successfully", false, "PATCH"); }}><Field label="Request"><select required value={form.requestId || ""} onChange={set("requestId")}><option value="">Select pending request</option>{(data.requests || []).filter((request) => request.action === "submitted").map((request) => <option value={request._id} key={request._id}>{request.userinfo?.username} · {request.title}</option>)}</select></Field><Field label="Decision"><select value={form.action || "approved"} onChange={set("action")}><option value="approved">Approve</option><option value="rejected">Reject</option><option value="escalated">Escalate</option><option value="commented">Comment only</option></select></Field><Field label="Comment"><textarea value={form.comment || ""} onChange={set("comment")} placeholder="Note for the requester" /></Field><button className="portal-primary-action" disabled={busy || !form.requestId}>{busy ? "Saving…" : "Save decision"}</button></form></section>}</div></div>;
  }

  if (active === "placement") {
    const canManage = ["admin", "hod", "placement-office"].includes(role);
    return <div className="portal-workspace"><section className="portal-card"><div className="portal-section-heading"><div><h2>Corporate Partners</h2><p>Recruiting companies and placement drives.</p></div></div><div className="portal-placement-grid"><Table headers={["Company", "Sector", "Industry", "HR", "Recruiting"]} empty="No companies." rows={(data.companies || []).map((company) => ({ key: company._id, Company: company.name, Sector: company.sector, Industry: company.industry, HR: `${company.hrname} · ${company.hremail}`, Recruiting: company.isRecruiting ? "Yes" : "No" }))} /><Table headers={["Drive", "Company", "Role", "Salary", "Apply", "Status"]} empty="No drives." rows={(data.drives || []).map((drive) => ({ key: drive._id, Drive: drive.name, Company: drive.companyinfo?.name, Role: drive.role, Salary: drive.salary, Apply: `${date(drive.applicationStart)} - ${date(drive.applicationEnd)}`, Status: drive.status }))} /></div></section>{canManage && <div className="portal-workspace-grid"><section className="portal-card"><div className="portal-section-heading"><div><h2>Add Company</h2><p>Register a recruiting partner.</p></div></div><form onSubmit={(event) => { event.preventDefault(); submit("/company-api/create", { ...form, hrphno: Number(form.hrphno) }, "Company added successfully"); }}><Field label="Company"><input required value={form.name || ""} onChange={set("name")} /></Field><div className="portal-form-row"><Field label="Sector"><input required value={form.sector || ""} onChange={set("sector")} /></Field><Field label="Industry"><input required value={form.industry || ""} onChange={set("industry")} /></Field></div><Field label="HR name"><input required value={form.hrname || ""} onChange={set("hrname")} /></Field><div className="portal-form-row"><Field label="HR email"><input required type="email" value={form.hremail || ""} onChange={set("hremail")} /></Field><Field label="HR phone"><input required type="tel" value={form.hrphno || ""} onChange={set("hrphno")} /></Field></div><Field label="Description"><textarea required value={form.descp || ""} onChange={set("descp")} /></Field><button className="portal-primary-action" disabled={busy}>{busy ? "Saving…" : "Add company"}</button></form></section><section className="portal-card"><div className="portal-section-heading"><div><h2>Create Drive</h2><p>Announce a recruitment opportunity.</p></div></div><form onSubmit={(event) => { event.preventDefault(); submit("/drive-api/create", { ...form, salary: Number(form.salary), status: form.status || "open", jobType: form.jobType || "full_time", location: form.location || "virtual" }, "Placement drive created successfully"); }}><Field label="Company"><select required value={form.companyinfo || ""} onChange={set("companyinfo")}><option value="">Select company</option>{data.companies?.map((company) => <option value={company._id} key={company._id}>{company.name}</option>)}</select></Field><Field label="Drive name"><input required value={form.name || ""} onChange={set("name")} /></Field><div className="portal-form-row"><Field label="Role"><input required value={form.role || ""} onChange={set("role")} /></Field><Field label="Salary (LPA)"><input required min="0" type="number" value={form.salary || ""} onChange={set("salary")} /></Field></div><Field label="Description"><textarea required value={form.descp || ""} onChange={set("descp")} /></Field><div className="portal-form-row"><Field label="Job type"><select value={form.jobType || "full_time"} onChange={set("jobType")}><option value="full_time">Full time</option><option value="internship">Internship</option><option value="contract">Contract</option><option value="part_time">Part time</option></select></Field><Field label="Mode"><select value={form.location || "virtual"} onChange={set("location")}><option value="virtual">Virtual</option><option value="in-office">In office</option></select></Field></div><div className="portal-form-row"><Field label="Applications open"><input required type="date" value={form.applicationStart || ""} onChange={set("applicationStart")} /></Field><Field label="Applications close"><input required type="date" value={form.applicationEnd || ""} onChange={set("applicationEnd")} /></Field><Field label="Status"><select value={form.status || "open"} onChange={set("status")}><option value="open">Open</option><option value="closed">Closed</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></Field></div><button className="portal-primary-action" disabled={busy}>{busy ? "Saving…" : "Create drive"}</button></form></section></div>}</div>;
  }

  if (active === "people") {
    return <div className="portal-workspace"><section className="portal-card"><div className="portal-section-heading"><div><h2>People</h2><p>Role-scoped campus directory.</p></div></div><Table headers={["Name", "Email", "Role", "Department", "Branch", "Year", "Semester", "Status"]} empty="No people are available." rows={(data.users || []).map((person) => ({ key: person._id, Name: person.username, Email: person.email, Role: person.role, Department: person.department, Branch: person.branch, Year: person.year, Semester: person.semester, Status: person.isActive === false ? "Inactive" : "Active" }))} />{role === "admin" && <div className="portal-admin-actions"><Field label="User"><select value={form.personId || ""} onChange={set("personId")}><option value="">Select user</option>{data.users?.filter((person) => person._id !== myId).map((person) => <option value={person._id} key={person._id}>{person.username} · {person.role}</option>)}</select></Field><Field label="Role"><select value={form.personRole || "student"} onChange={set("personRole")}><option value="student">Student</option><option value="teacher">Faculty</option><option value="hod">HOD</option><option value="placement-office">Placement Office</option><option value="admin">Admin</option></select></Field><button className="portal-primary-action" onClick={() => submit(`/user-api/update/${form.personId}`, { role: form.personRole }, "User role updated", false, "PATCH")} disabled={!form.personId || busy}>Update role</button><button className="danger" onClick={() => submit(`/user-api/delete/${form.personId}`, {}, "User deactivated", false, "PATCH")} disabled={!form.personId || busy}>Deactivate</button></div>}</section></div>;
  }

  if (active === "reports") {
    const reports = [
      ["Assignments", data.assignments?.map((item) => ({ Assignment: item.name, Subject: item.subjectinfo?.name, Due: date(item.duedate), Status: item.status })) || []],
      ["Submissions", data.submissions?.map((item) => ({ Student: item.studentinfo?.username, Assignment: item.assignment?.name, Marks: item.marksobtained, Grade: item.grade, Status: item.status })) || []],
      ["Attendance", data.attendance?.map((item) => ({ Date: date(item.date), Student: item.studentid?.username, Subject: item.subjectinfo?.name, Status: item.status })) || []],
      ["Events", data.events?.map((item) => ({ Event: item.name, Category: item.catogery, Start: date(item.startdate), Status: item.status })) || []],
      ["Requests", data.requests?.map((item) => ({ Request: item.title, User: item.userinfo?.username, Category: item.catogery, Status: item.action })) || []],
      ["Placement drives", data.drives?.map((item) => ({ Drive: item.name, Company: item.companyinfo?.name, Salary: item.salary, Status: item.status })) || []],
    ];
    return <div className="portal-workspace"><section className="portal-card"><div className="portal-section-heading"><div><h2>Downloadable Reports</h2><p>Generate CSV reports from the live scoped data.</p></div></div><div className="portal-report-grid">{reports.map(([name, rows]) => <article key={name}><span>{name}</span><strong>{rows.length}</strong><small>records available</small><button onClick={() => downloadCsv(name.toLowerCase().replaceAll(" ", "-"), rows)} disabled={!rows.length}>Export CSV</button></article>)}</div></section></div>;
  }

  return <Empty />;
}








