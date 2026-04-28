import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import API from "./api";
import {
  ShieldCheck, LayoutDashboard, FileText, Users, MessageCircle, CalendarDays,
  UploadCloud, CheckCircle, Clock, Search, Bell, Moon, LogOut, UserPlus,
  LogIn, Gavel, AlertCircle, Send
} from "lucide-react";

function getUser() {
  return JSON.parse(localStorage.getItem("resolvehub_user") || "null");
}

function getAllUsers() {
  return JSON.parse(localStorage.getItem("resolvehub_all_users") || "[]");
}

function saveUserToLocalList(user) {
  if (!user?.email) return;
  const users = getAllUsers();
  const exists = users.some((u) => u.email === user.email);
  if (!exists) {
    users.push({
      fullName: user.fullName || user.email,
      email: user.email,
      role: user.role || "USER",
    });
    localStorage.setItem("resolvehub_all_users", JSON.stringify(users));
  }
}

function threadKey(userEmail) {
  return `resolvehub_thread_admin_${userEmail}`;
}

function Home() {
  return (
    <main className="landing">
      <nav className="landingNav">
        <Link to="/" className="logo">
          <div className="logoIcon"><ShieldCheck /></div>
          <div><h2>ResolveHub</h2><p>Online Dispute Resolution</p></div>
        </Link>
        <div className="landingLinks">
          <Link to="/login">Login</Link>
          <Link to="/register" className="primaryBtn">Register</Link>
        </div>
      </nav>

      <section className="landingHero">
        <div>
          <span className="badge">Secure • Fast • Transparent</span>
          <h1>Resolve disputes digitally with confidence.</h1>
          <p>File disputes, upload evidence, track mediation progress, and manage resolutions through a professional online dispute resolution platform.</p>
          <div className="heroBtns">
            <Link to="/register" className="primaryBtn">Get Started</Link>
            <Link to="/login" className="secondaryBtn">Login</Link>
          </div>
        </div>

        <div className="landingCard">
          <Gavel size={58} />
          <h2>Digital Mediation Room</h2>
          <p>Case filing, evidence review, mediator workflow, and final resolution.</p>
        </div>
      </section>
    </main>
  );
}

function Sidebar() {
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="sidebar">
      <Link to="/" className="logo">
        <div className="logoIcon"><ShieldCheck /></div>
        <div><h2>ResolveHub</h2><p>Online Dispute Resolution</p></div>
      </Link>

      <Link to="/dashboard"><LayoutDashboard /> Dashboard</Link>
      {!isAdmin && <Link to="/file-dispute"><FileText /> File Dispute</Link>}
      {isAdmin && <Link to="/admin"><Users /> Mediator Panel</Link>}
      <Link to="/messages"><MessageCircle /> Messages</Link>
      <Link to="/calendar"><CalendarDays /> Calendar</Link>
    </aside>
  );
}

function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("resolvehub_user");
    navigate("/");
  };

  return (
    <header className="topbar">
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="topActions">
        <Link to="/search"><Search /></Link>
        <Link to="/notifications"><Bell /></Link>
        <button onClick={() => document.body.classList.toggle("lightMode")}><Moon /></button>

        {user ? (
          <>
            <div className="profile">
              <div className="avatar">{user.fullName?.charAt(0) || "U"}</div>
              <div><strong>{user.fullName}</strong><small>{user.role}</small></div>
            </div>
            <button onClick={logout}><LogOut /></button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="primaryBtn">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

function Layout({ title, subtitle, children }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar title={title} subtitle={subtitle} />
        {children}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, type }) {
  return (
    <div className="statCard">
      <div className={`statIcon ${type}`}>{icon}</div>
      <div><p>{title}</p><h2>{value}</h2><span>Live data</span></div>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`status ${status}`}>{status}</span>;
}

function LiveGraph({ disputes }) {
  const statuses = ["FILED", "UNDER_REVIEW", "IN_MEDIATION", "RESOLVED", "REJECTED"];
  const data = statuses.map((status, index) => ({
    label: status.replace("_", " "),
    value: disputes.filter((d) => d.status === status).length,
    x: 55 + index * 138,
  }));

  const max = Math.max(...data.map((d) => d.value), 1);
  const points = data.map((d) => `${d.x},${220 - (d.value / max) * 165}`).join(" ");

  return (
    <div className="liveGraph">
      <svg viewBox="0 0 680 270" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <path d={`M${points} L607 250 L55 250 Z`} fill="url(#areaGradient)" />
        <polyline points={points} fill="none" stroke="url(#lineGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d) => {
          const y = 220 - (d.value / max) * 165;
          return (
            <g key={d.label}>
              <circle cx={d.x} cy={y} r="9" fill="#06111f" stroke="#60a5fa" strokeWidth="5" />
              <text x={d.x} y="260" textAnchor="middle" fill="#94a3b8" fontSize="15" fontWeight="700">{d.label}</text>
              <text x={d.x} y={y - 18} textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800">{d.value}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Dashboard() {
  const [disputes, setDisputes] = useState([]);

  const load = () => {
    API.get("/disputes").then((res) => setDisputes(res.data)).catch(() => setDisputes([]));
  };

  useEffect(() => load(), []);

  const resolved = disputes.filter((d) => d.status === "RESOLVED").length;
  const progress = disputes.filter((d) => d.status === "UNDER_REVIEW" || d.status === "IN_MEDIATION").length;
  const mediation = disputes.filter((d) => d.status === "IN_MEDIATION").length;

  return (
    <Layout title="Dashboard" subtitle="Live dispute overview and case activity.">
      <section className="statsGrid">
        <StatCard icon={<FileText />} title="Total Disputes" value={disputes.length} type="purple" />
        <StatCard icon={<CheckCircle />} title="Resolved" value={resolved} type="blue" />
        <StatCard icon={<Clock />} title="In Progress" value={progress} type="cyan" />
        <StatCard icon={<Users />} title="Mediations" value={mediation} type="gold" />
      </section>

      <section className="dashboardGrid">
        <div className="panel">
          <div className="panelHead"><h2>Disputes Overview</h2><button>Live</button></div>
          {disputes.length === 0 ? (
            <div className="emptyState"><FileText size={48} /><h3>No disputes filed yet</h3><p>Start by filing your first dispute.</p></div>
          ) : <LiveGraph disputes={disputes} />}
        </div>

        <div className="panel">
          <div className="panelHead">
            <h2>Recent Disputes</h2>
            {getUser()?.role !== "ADMIN" && <Link to="/file-dispute">New Case</Link>}
          </div>

          {disputes.length === 0 && <p className="muted">No recent cases available.</p>}

          {disputes.slice(-5).reverse().map((d) => (
            <div className="recentRow" key={d.id}>
              <div className="recentIcon"><FileText /></div>
              <div><strong>{d.caseTitle}</strong><p>Case #{String(d.id).padStart(3, "0")} • {d.category}</p></div>
              <StatusBadge status={d.status} />
              <small>{d.priority}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="bottomGrid">
        <div className="panel">
          <h2><UploadCloud /> Evidence Upload</h2>
          <p className="muted">Upload proof while filing a dispute.</p>
          {getUser()?.role !== "ADMIN" ? (
            <Link to="/file-dispute" className="dropZone"><UploadCloud /><strong>File a dispute with evidence</strong><span>PDF, image, document support</span></Link>
          ) : (
            <div className="dropZone"><UploadCloud /><strong>Evidence review available in cases</strong><span>Admins cannot file disputes</span></div>
          )}
        </div>

        <div className="panel">
          <h2><AlertCircle /> Case Timeline</h2>
          <div className="timeline">
            <div><span></span><strong>Filed</strong><p>User submits dispute.</p></div>
            <div><span></span><strong>Under Review</strong><p>Mediator checks details.</p></div>
            <div><span></span><strong>Mediation</strong><p>Parties discuss resolution.</p></div>
            <div><span></span><strong>Resolved / Rejected</strong><p>Final status updated.</p></div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


function FileDispute() {
  const navigate = useNavigate();
  const user = getUser();

  const [form, setForm] = useState({
    caseTitle: "",
    category: "Workplace Conflict",
    description: "",
    priority: "MEDIUM",
    status: "FILED",
  });

  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (user?.role === "ADMIN") {
      alert("Admins cannot file disputes.");
      return;
    }

    if (!form.caseTitle.trim() || !form.description.trim()) {
      alert("Case title and description are required.");
      return;
    }

    try {
      const res = await API.post("/disputes", form);

      // FILE UPLOAD IS OPTIONAL
      if (file && res.data.id) {
        const fd = new FormData();
        fd.append("file", file);

        await API.post(`/disputes/${res.data.id}/upload`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(file ? "Case submitted with evidence." : "Case submitted without evidence.");
      navigate("/dashboard");
    } catch {
      alert("Backend not connected. Start Spring Boot first.");
    }
  };

  if (user?.role === "ADMIN") {
    return (
      <Layout title="Access Restricted" subtitle="Admins cannot file disputes.">
        <div className="panel emptyPage">
          <h2>Admins can only review, mediate, resolve, or reject disputes.</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="File New Dispute" subtitle="Submit dispute details. Evidence upload is optional.">
      <div className="panel formPanel">
        <form onSubmit={submit} className="caseForm">
          <input
            placeholder="Case Title *"
            required
            onChange={(e) => setForm({ ...form, caseTitle: e.target.value })}
          />

          <div className="formRow">
            <select onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Workplace Conflict</option>
              <option>Contract Disagreement</option>
              <option>Payment Issue</option>
              <option>Service Quality Complaint</option>
              <option>Rental / Property</option>
              <option>E-Commerce</option>
            </select>

            <select onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>URGENT</option>
            </select>
          </div>

          <textarea
            rows="7"
            placeholder="Describe dispute clearly... *"
            required
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>

          <label className="fileLabel">Evidence Upload Optional</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />

          <p className="muted">
            {file ? `Selected file: ${file.name}` : "No file selected. You can submit without evidence."}
          </p>

          <button className="primaryBtn">Submit Case</button>
        </form>
      </div>
    </Layout>
  );
}


function AdminPanel() {
  const [disputes, setDisputes] = useState([]);

  const load = () => {
    API.get("/disputes").then((res) => setDisputes(res.data)).catch(() => setDisputes([]));
  };

  useEffect(() => load(), []);

  const updateStatus = async (id, status) => {
    const note = prompt("Enter mediator note:");
    await API.put(`/disputes/${id}/status`, { status, resolutionNote: note || "" });
    load();
  };

  return (
    <Layout title="Mediator Panel" subtitle="Review, mediate, resolve, or reject cases.">
      <div className="panel adminPanel">
        {disputes.length === 0 && (
          <div className="emptyState"><Users size={48} /><h3>No cases to review</h3><p>Filed disputes will appear here.</p></div>
        )}

        {disputes.map((d) => (
          <div className="adminCase" key={d.id}>
            <div>
              <h3>{d.caseTitle}</h3>
              <p>{d.category} • Priority: {d.priority}</p>
              <StatusBadge status={d.status} />
              <p className="muted">Evidence: {d.evidenceFileName || "Not uploaded"}</p>
            </div>

            <div className="adminActions">
              <button onClick={() => updateStatus(d.id, "UNDER_REVIEW")}>Review</button>
              <button onClick={() => updateStatus(d.id, "IN_MEDIATION")}>Mediation</button>
              <button onClick={() => updateStatus(d.id, "RESOLVED")}>Resolve</button>
              <button onClick={() => updateStatus(d.id, "REJECTED")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

/* MULTI USER MESSAGES */
function MessagesPage() {
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  const users = getAllUsers().filter((u) => u.role !== "ADMIN");
  const defaultUserEmail = isAdmin ? users[0]?.email || "" : user?.email || "";
  const [selectedEmail, setSelectedEmail] = useState(defaultUserEmail);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const currentKey = threadKey(selectedEmail);

  const loadMessages = () => {
    if (!selectedEmail) {
      setMessages([]);
      return;
    }

    const saved = JSON.parse(localStorage.getItem(currentKey) || "[]");
    setMessages(saved);
  };

  useEffect(() => {
    loadMessages();
  }, [selectedEmail]);

  const sendMessage = () => {
    const clean = input.trim();
    if (!clean) return;

    if (!selectedEmail) {
      alert("Select a user first.");
      return;
    }

    const newMsg = {
      id: Date.now(),
      fromEmail: user.email,
      fromName: user.fullName,
      fromRole: user.role,
      text: clean,
      time: new Date().toLocaleString(),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(currentKey, JSON.stringify(updated));
    setInput("");
  };

  const clearThread = () => {
    if (!selectedEmail) return;
    localStorage.removeItem(currentKey);
    setMessages([]);
  };

  return (
    <Layout title="Messages" subtitle={isAdmin ? "Admin can message any registered user." : "User can message admin only."}>
      <section className="messagesPage">
        <div className="panel conversationPanel">
          <h2>{isAdmin ? "Users" : "Conversation"}</h2>

          {isAdmin && users.length === 0 && (
            <p className="muted">No registered users found. Register a user account first.</p>
          )}

          {isAdmin ? (
            users.map((u) => (
              <button
                key={u.email}
                className={selectedEmail === u.email ? "conversationItem activeConversation conversationBtn" : "conversationItem conversationBtn"}
                onClick={() => setSelectedEmail(u.email)}
              >
                <strong>{u.fullName}</strong>
                <p>{u.email}</p>
              </button>
            ))
          ) : (
            <div className="conversationItem activeConversation">
              <strong>Admin / Mediator</strong>
              <p>You can message admin only</p>
            </div>
          )}
        </div>

        <div className="panel chatRoom">
          <div className="chatHeader">
            <div>
              <h2>{isAdmin ? `Chat with ${selectedEmail || "User"}` : "Chat with Admin"}</h2>
              <p>Messages are shared between admin and selected user in this project demo.</p>
            </div>
            <div className="chatHeaderBtns">
              <span className="onlineDot">Online</span>
              <button className="clearBtn" onClick={clearThread}>Clear</button>
            </div>
          </div>

          <div className="chatMessages">
            {messages.length === 0 && <p className="muted">No messages yet. Start the conversation.</p>}

            {messages.map((msg) => {
              const mine = msg.fromEmail === user.email;
              return (
                <div key={msg.id} className={mine ? "msg rightMsg" : "msg leftMsg"}>
                  <small>{msg.fromName} • {msg.fromRole}</small>
                  <p>{msg.text}</p>
                  <em>{msg.time}</em>
                </div>
              );
            })}
          </div>

          <div className="messageInput">
            <input
              value={input}
              placeholder={isAdmin ? "Message selected user..." : "Message admin..."}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button type="button" onClick={sendMessage}><Send size={18} /> Send</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function CalendarPage() {
  const [disputes, setDisputes] = useState([]);
  const [caseId, setCaseId] = useState("");
  const [date, setDate] = useState("");
  const [schedules, setSchedules] = useState(() => JSON.parse(localStorage.getItem("resolvehub_schedules") || "[]"));

  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    API.get("/disputes").then((res) => setDisputes(res.data)).catch(() => setDisputes([]));
  }, []);

  const saveSchedule = () => {
    if (!caseId || !date) {
      alert("Select a case and date first.");
      return;
    }

    const selectedCase = disputes.find((d) => String(d.id) === String(caseId));

    const newSchedule = {
      id: Date.now(),
      caseId,
      title: selectedCase?.caseTitle || "Dispute Case",
      category: selectedCase?.category || "Case",
      date,
    };

    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    localStorage.setItem("resolvehub_schedules", JSON.stringify(updated));
    setCaseId("");
    setDate("");
    alert("Resolution date scheduled.");
  };

  const deleteSchedule = (id) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    localStorage.setItem("resolvehub_schedules", JSON.stringify(updated));
  };

  return (
    <Layout title="Calendar" subtitle="Admin can schedule case resolution dates.">
      <section className="calendarPlanner">
        {isAdmin ? (
          <div className="panel scheduleForm">
            <h2>Schedule Case Resolution</h2>
            <p className="muted">Choose a dispute and set the expected resolution date.</p>

            <div className="formRow">
              <select value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                <option value="">Select Case</option>
                {disputes.map((d) => (
                  <option key={d.id} value={d.id}>#{d.id} - {d.caseTitle} ({d.status})</option>
                ))}
              </select>

              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <button className="primaryBtn" type="button" onClick={saveSchedule}>Schedule Resolution</button>
          </div>
        ) : (
          <div className="panel scheduleForm">
            <h2>Resolution Calendar</h2>
            <p className="muted">Scheduled mediation or resolution dates appear here.</p>
          </div>
        )}

        <div className="calendarList">
          {schedules.length === 0 && (
            <div className="panel emptyState">
              <h3>No scheduled resolution dates</h3>
              <p>Admin can choose a case and date to schedule resolution.</p>
            </div>
          )}

          {schedules.map((item) => (
            <div className="panel scheduledCase" key={item.id}>
              <div className="dateBox">
                <strong>{new Date(item.date).getDate()}</strong>
                <span>{new Date(item.date).toLocaleString("default", { month: "short" })}</span>
              </div>

              <div>
                <h2>{item.title}</h2>
                <p>{item.category}</p>
                <span className="scheduleBadge">Resolution Date: {item.date}</span>
              </div>

              {isAdmin && <button className="deleteBtn" onClick={() => deleteSchedule(item.id)}>Remove</button>}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    API.get("/disputes").then((res) => setDisputes(res.data)).catch(() => setDisputes([]));
  }, []);

  const filtered = disputes.filter((d) => {
    const q = query.toLowerCase();
    return (
      d.caseTitle?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q) ||
      d.status?.toLowerCase().includes(q) ||
      d.priority?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  return (
    <Layout title="Search" subtitle="Search cases, parties, evidence, and statuses.">
      <section className="panel searchPage">
        <input className="largeSearch" value={query} placeholder="Search by case title, status, priority, category..." onChange={(e) => setQuery(e.target.value)} />

        <div className="tagList">
          <button onClick={() => setQuery("FILED")}>Filed</button>
          <button onClick={() => setQuery("UNDER_REVIEW")}>Under Review</button>
          <button onClick={() => setQuery("IN_MEDIATION")}>In Mediation</button>
          <button onClick={() => setQuery("RESOLVED")}>Resolved</button>
          <button onClick={() => setQuery("HIGH")}>High Priority</button>
          <button onClick={() => setQuery("")}>Clear</button>
        </div>

        <div className="searchResults">
          {query.trim() === "" && <p className="muted">Start typing or choose a filter.</p>}

          {query.trim() !== "" && filtered.length === 0 && (
            <div className="emptyState"><Search size={42} /><h3>No matching disputes found</h3><p>Try searching status, category, title, or priority.</p></div>
          )}

          {query.trim() !== "" && filtered.map((d) => (
            <div className="searchResultCard" key={d.id}>
              <div><h3>{d.caseTitle}</h3><p>{d.category} • Priority: {d.priority}</p><p className="muted">{d.description}</p></div>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function NotificationsPage() {
  return (
    <Layout title="Notifications" subtitle="Case alerts and mediator updates.">
      <section className="notificationsPage">
        <div className="panel notificationCard">🔔 New dispute filed and awaiting mediator review.</div>
        <div className="panel notificationCard">📂 Evidence missing for one active dispute.</div>
        <div className="panel notificationCard">⚖️ Mediation recommended for a high-priority case.</div>
        <div className="panel notificationCard">✅ Resolved cases are ready for final report.</div>
      </section>
    </Layout>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "USER" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      saveUserToLocalList(form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch {
      alert("Registration failed. Use a new email.");
    }
  };

  return (
    <div className="authPage">
      <Link to="/" className="logo authLogo">
        <div className="logoIcon"><ShieldCheck /></div>
        <div><h2>ResolveHub</h2><p>Online Dispute Resolution</p></div>
      </Link>

      <form className="authCard" onSubmit={submit}>
        <UserPlus />
        <h1>Create Account</h1>
        <input required placeholder="Full Name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="USER">User</option>
          <option value="ADMIN">Mediator / Admin</option>
        </select>
        <button className="primaryBtn">Register</button>
        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("resolvehub_user", JSON.stringify(res.data));
      saveUserToLocalList(res.data);
      navigate("/dashboard");
    } catch {
      alert("Invalid login details.");
    }
  };

  return (
    <div className="authPage">
      <Link to="/" className="logo authLogo">
        <div className="logoIcon"><ShieldCheck /></div>
        <div><h2>ResolveHub</h2><p>Online Dispute Resolution</p></div>
      </Link>

      <form className="authCard" onSubmit={submit}>
        <LogIn />
        <h1>Login</h1>
        <input required placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="primaryBtn">Login</button>
        <Link to="/register">New user? Register</Link>
      </form>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/file-dispute" element={<FileDispute />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
