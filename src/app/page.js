'use client';
import React, { useState } from 'react';
import { calculateSemanticOverlap } from './utils/aiEngine';
import { Shield, Filter, Send, CheckCircle, Clock, FileText, Lock, UserCheck, Building2, User, Key, LogOut, Search, AlertCircle, ChevronDown, Download, Activity, Cpu } from 'lucide-react';

const collegesList = [
  { pid: "12345", name: "Apex Institute of Technology" },
  { pid: "54321", name: "Indore College of Engineering & Tech" },
  { pid: "99887", name: "Central Institute of Science & Tech" }
];

const initialComplaints = [
  {
    id: "CNT-2026-0100",
    institutionId: "12345",
    institutionName: "Apex Institute of Technology",
    department: "Anti-Ragging Cell",
    category: "Ragging & Student Harassment",
    description: "Senior B.Tech 3rd year students threatening & harassing 1st year hostel residents after campus hours near Hostel Block B.",
    status: "Pending",
    priority: "CRITICAL",
    isDuplicate: false,
    matchedCaseId: null,
    similarityScore: null,
    aiReason: null,
    aiStatus: "AI Surveillance & Priority Active ⚡",
    deadline: "2026-10-25",
    timeline: [
      { date: "2026-10-22", action: "Grievance Registered via Student Portal", actor: "Student" },
      { date: "2026-10-22", action: "AI Engine Flagged CRITICAL Priority & Sent Alert to Anti-Ragging Cell", actor: "AI Core" },
      { date: "2026-10-23", action: "Anti-Ragging Squad assigned for physical site inspection", actor: "AICTE Officer" }
    ]
  },
  {
    id: "CNT-2026-0101",
    institutionId: "12345",
    institutionName: "Apex Institute of Technology",
    department: "Regulation Bureau",
    category: "Fee Exceeding AICTE Norms",
    description: "College management is demanding mandatory development fees of ₹45,000 exceeding AICTE prescribed ceilings for B.Tech batch.",
    status: "Pending",
    priority: "HIGH",
    isDuplicate: false,
    matchedCaseId: null,
    similarityScore: null,
    aiReason: null,
    aiStatus: "AI Semantic Audit Passed ✓",
    deadline: "2026-11-05",
    timeline: [
      { date: "2026-10-20", action: "Grievance Registered", actor: "Student Portal" },
      { date: "2026-10-21", action: "Notice issued to Institute Finance Department", actor: "AICTE Officer" }
    ]
  },
  {
    id: "CNT-2026-0102",
    institutionId: "54321",
    institutionName: "Indore College of Engineering & Tech",
    department: "Public Grievances",
    category: "Infrastructure Deficit",
    description: "Computer science labs lack working systems and high-speed internet required for curriculum practical sessions.",
    status: "Resolved",
    priority: "MEDIUM",
    isDuplicate: false,
    matchedCaseId: null,
    similarityScore: null,
    aiReason: null,
    aiStatus: "Case Closed & Verified",
    deadline: "2026-10-22",
    timeline: [
      { date: "2026-10-10", action: "Grievance Registered by CSE Batch", actor: "Student" },
      { date: "2026-10-12", action: "AI System Flagged Lab Maintenance Ticket", actor: "AI Core" },
      { date: "2026-10-18", action: "Action Taken / Resolved: 25 New Workstations installed & High-speed fiber upgraded.", actor: "Institute Admin" }
    ]
  }
];

export default function OneDeskDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const [role, setRole] = useState('student');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchPid, setSearchPid] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCase, setSelectedCase] = useState(complaints[0]);
  
  // Student Form State with 3-Level Dropdowns
  const [targetInstName, setTargetInstName] = useState('Apex Institute of Technology');
  const [targetPid, setTargetPid] = useState('12345');
  
  // Level 1: Bureau / Department
  const [formDepartment, setFormDepartment] = useState('Anti-Ragging Cell');
  const [customOtherDepartment, setCustomOtherDepartment] = useState('');
  
  // Level 2: Category
  const [formCategory, setFormCategory] = useState('Ragging & Student Harassment');
  const [customOtherCategory, setCustomOtherCategory] = useState('');
  
  // Level 3: Priority
  const [formPriority, setFormPriority] = useState('CRITICAL');
  
  const [newDesc, setNewDesc] = useState('');
  const [aiAlert, setAiAlert] = useState(null);
  const [officerRemark, setOfficerRemark] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setRole(loginRole);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesDept = selectedDept === 'All' ? true : c.department === selectedDept;
    if (role === 'institution') {
      return matchesDept && (c.institutionId === '12345' || c.institutionName.includes('Apex'));
    }
    if (role === 'officer' && searchPid.trim() !== '') {
      return matchesDept && (c.institutionId.includes(searchPid) || c.institutionName.toLowerCase().includes(searchPid.toLowerCase()));
    }
    return matchesDept;
  });

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length;
  const duplicateCount = complaints.filter(c => c.isDuplicate).length;

  const exportWordDoc = () => {
    const targetData = filteredComplaints;
    let docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>AICTE OneDesk Institutional Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #854d0e; text-align: center; }
        h3 { color: #334155; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; }
        th { background-color: #f1f5f9; }
      </style>
      </head>
      <body>
        <h1>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)</h1>
        <h3 style="text-align:center;">OneDesk Grievance & Audit Report - Offline Export</h3>
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Filter Applied (PID/College):</strong> ${searchPid || 'All Institutes'}</p>
        <p><strong>Total Complaints Exported:</strong> ${targetData.length}</p>
        <hr/>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Institute Name (PID)</th>
              <th>Bureau/Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
    `;

    targetData.forEach(c => {
      docContent += `
        <tr>
          <td><b>${c.id}</b></td>
          <td>${c.institutionName} (${c.institutionId})</td>
          <td>${c.department} - <i>${c.category}</i></td>
          <td>${c.priority}</td>
          <td>${c.status}</td>
          <td>${c.description}</td>
        </tr>
      `;
    });

    docContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AICTE_OneDesk_Report_${searchPid || 'All'}_${new Date().toISOString().slice(0,10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    let matchFound = null;
    let highestScore = null;

    for (let item of complaints) {
      const match = calculateSemanticOverlap(newDesc, item.description);
      if (match.isMatch) {
        matchFound = item;
        highestScore = match;
        break;
      }
    }

    const finalDepartment = formDepartment === 'Other' ? customOtherDepartment || 'Custom Department' : formDepartment;
    const finalCategory = formCategory === 'Other' ? customOtherCategory || 'Custom Category' : formCategory;
    const newId = `CNT-2026-010${complaints.length + 1}`;
    
    const newEntry = {
      id: newId,
      institutionId: targetPid || "12345",
      institutionName: targetInstName || "Apex Institute of Technology",
      department: finalDepartment,
      category: finalCategory,
      description: newDesc,
      status: "Pending",
      priority: formPriority,
      isDuplicate: !!matchFound,
      matchedCaseId: matchFound ? matchFound.id : null,
      similarityScore: highestScore ? highestScore.score : null,
      aiReason: highestScore ? highestScore.reason : null,
      aiStatus: "AI Surveillance & Sentiment Active ⚡",
      deadline: "2026-11-05",
      timeline: [
        { date: new Date().toISOString().split('T')[0], action: "Grievance Filed by Student", actor: "Registered Student" },
        { date: new Date().toISOString().split('T')[0], action: "AI Engine Priority Classification & Overlap Scan Complete", actor: "AI Core" }
      ]
    };

    setComplaints([newEntry, ...complaints]);
    setSelectedCase(newEntry);
    
    if (matchFound) {
      setAiAlert(`⚠️ Overlap Flag: Duplicate grievance detected with Case #${matchFound.id} (${highestScore.score} similarity). AI linked both records.`);
    } else {
      setAiAlert(`✅ Grievance registered successfully under ID: ${newId} with active AI monitoring.`);
    }

    setNewDesc('');
    setCustomOtherDepartment('');
    setCustomOtherCategory('');
  };

  const handleResolveCase = () => {
    if (!selectedCase) return;
    const currentDate = new Date().toISOString().split('T')[0];
    const newTimelineItem = {
      date: currentDate,
      action: `Action Taken / Resolved: ${officerRemark || 'Verification completed.'}`,
      actor: role === 'officer' ? 'AICTE Official' : 'Institute Admin'
    };

    const updated = complaints.map(c => {
      if (c.id === selectedCase.id) {
        return { ...c, status: 'Resolved', timeline: [...c.timeline, newTimelineItem] };
      }
      return c;
    });

    setComplaints(updated);
    setSelectedCase({
      ...selectedCase,
      status: 'Resolved',
      timeline: [...selectedCase.timeline, newTimelineItem]
    });
    setOfficerRemark('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-stone-300 rounded-2xl p-8 shadow-xl relative">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 mb-3">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">AICTE OneDesk</h1>
            <p className="text-xs text-stone-500 mt-1">National Technical Education Grievance Portal</p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 mb-6 text-xs">
            <button type="button" onClick={() => setLoginRole('student')} className={`py-2 font-medium rounded-lg transition flex items-center justify-center gap-1 ${loginRole === 'student' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>
              <User className="w-3.5 h-3.5" /> Student
            </button>
            <button type="button" onClick={() => setLoginRole('institution')} className={`py-2 font-medium rounded-lg transition flex items-center justify-center gap-1 ${loginRole === 'institution' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>
              <Building2 className="w-3.5 h-3.5" /> Institute
            </button>
            <button type="button" onClick={() => setLoginRole('officer')} className={`py-2 font-medium rounded-lg transition flex items-center justify-center gap-1 ${loginRole === 'officer' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>
              <UserCheck className="w-3.5 h-3.5" /> Official
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {loginRole === 'student' ? 'Student Registration / Roll No' : loginRole === 'institution' ? 'Institute PID (Permanent ID)' : 'Official AICTE Credentials'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input type="text" required placeholder={loginRole === 'student' ? 'STU-2026-9081' : loginRole === 'institution' ? '12345' : 'officer@aicte-india.org'} value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none focus:border-amber-600 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password / Security Access Key</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Key className="w-4 h-4" />
                </span>
                <input type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none focus:border-amber-600 transition" />
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] text-amber-900">
              <Lock className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Government Portal Certified 256-Bit SSL Encrypted Session</span>
            </div>

            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-xl text-xs shadow transition">
              Access OneDesk Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 border border-amber-200 rounded-xl text-amber-900">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900">AICTE OneDesk</h1>
            <p className="text-[11px] text-stone-500">Centralized Grievance Redressal & Institutional Audit Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-medium text-amber-900 gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>AI Monitoring Active</span>
          </div>

          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium text-stone-600">
            <span className="px-3 py-1 bg-white rounded-lg border border-stone-200 text-stone-900 shadow-sm">
              Role: <strong className="capitalize">{role} Mode</strong>
            </span>
          </div>

          <button onClick={handleLogout} className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-700 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {role === 'officer' && (
        <div className="space-y-4 mb-6">
          <div className="relative bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input type="text" placeholder="Click to select college or type PID / Name..." value={searchPid} onFocus={() => setShowDropdown(true)} onChange={(e) => { setSearchPid(e.target.value); setShowDropdown(true); }} className="w-full text-xs bg-transparent border-none focus:outline-none text-stone-800 font-medium" />
                <ChevronDown className="w-4 h-4 text-stone-400 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
                {searchPid && (
                  <button onClick={() => { setSearchPid(''); setShowDropdown(false); }} className="text-xs text-stone-400 hover:text-stone-600">Clear</button>
                )}
              </div>

              {showDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
                  <div className="p-2 text-[10px] uppercase tracking-wider font-bold text-stone-400 bg-stone-50 border-b border-stone-100">
                    Select Registered Institution:
                  </div>
                  {collegesList.map((col) => (
                    <div key={col.pid} onClick={() => { setSearchPid(col.pid); setShowDropdown(false); }} className="p-2.5 hover:bg-amber-50/80 cursor-pointer flex justify-between items-center border-b border-stone-100 text-xs transition">
                      <span className="font-semibold text-stone-800">{col.name}</span>
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">PID: {col.pid}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={exportWordDoc} className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm shrink-0">
              <Download className="w-4 h-4" /> Export Institutional Report (.doc Word)
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <FileText className="w-6 h-6 text-stone-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">Total Complaints</p>
                <p className="text-lg font-bold text-stone-900">{totalCount}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <Clock className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">Pending Cases</p>
                <p className="text-lg font-bold text-stone-900">{pendingCount}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <AlertCircle className="w-6 h-6 text-rose-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">High / Critical Priority</p>
                <p className="text-lg font-bold text-stone-900">{highPriorityCount}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">AI Overlaps Detected</p>
                <p className="text-lg font-bold text-stone-900">{duplicateCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === 'student' ? (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-base font-bold text-stone-900">Submit Student Grievance Portal</h2>
            <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-amber-600" /> 24/7 AI Monitored
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-6">Submissions directly audited by AICTE Bureau & Anti-Ragging Cell with real-time tracking.</p>

          {aiAlert && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              {aiAlert}
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Target College Name</label>
                <input type="text" required value={targetInstName} onChange={(e) => setTargetInstName(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">AICTE Permanent ID (PID)</label>
                <input type="text" required value={targetPid} onChange={(e) => setTargetPid(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600" />
              </div>
            </div>

            {/* 3 Dropdowns */}
            <div className="grid grid-cols-3 gap-3">
              {/* Level 1: Bureau / Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">1. Bureau / Department</label>
                <select 
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-600 text-stone-800">
                  <option value="Anti-Ragging Cell">Anti-Ragging Cell</option>
                  <option value="Regulation Bureau">Regulation Bureau</option>
                  <option value="Public Grievances">Public Grievances</option>
                  <option value="Academic Affairs">Academic Affairs</option>
                  <option value="Other">Other (Specify Below)</option>
                </select>
              </div>

              {/* Level 2: Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">2. Grievance Category</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-600 text-stone-800">
                  <option value="Ragging & Student Harassment">Ragging & Harassment</option>
                  <option value="Fee Exceeding AICTE Norms">Fee Exceeding Norms</option>
                  <option value="Infrastructure Deficit">Infrastructure Deficit</option>
                  <option value="Faculty & Staff Dispute">Faculty Dispute</option>
                  <option value="Other">Other (Specify Below)</option>
                </select>
              </div>

              {/* Level 3: Urgency / Priority */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">3. Priority Level</label>
                <select 
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-600 text-stone-800">
                  <option value="CRITICAL">Critical (Immediate)</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                </select>
              </div>
            </div>

            {/* Custom Department Input if 'Other' selected */}
            {formDepartment === 'Other' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Specify Custom Department / Bureau</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter custom department name..."
                  value={customOtherDepartment}
                  onChange={(e) => setCustomOtherDepartment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                />
              </div>
            )}

            {/* Custom Category Input if 'Other' selected */}
            {formCategory === 'Other' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Specify Custom Grievance Category</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter custom complaint category..."
                  value={customOtherCategory}
                  onChange={(e) => setCustomOtherCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Description (AI Monitored)</label>
              <textarea 
                rows={4}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe your grievance clearly. AI engine will check semantic duplicates & generate audit timeline..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-600 text-stone-800"
              />
            </div>

            <button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
              <Send className="w-4 h-4" /> Submit & Trigger AI Surveillance
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xs uppercase tracking-wider text-stone-600 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-stone-500" /> Active Cases ({filteredComplaints.length})
              </h2>
              <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="bg-stone-50 text-xs border border-stone-200 rounded-lg p-1.5 focus:outline-none text-stone-700">
                <option value="All">All Bureaus</option>
                <option value="Anti-Ragging Cell">Anti-Ragging Cell</option>
                <option value="Regulation Bureau">Regulation Bureau</option>
                <option value="Public Grievances">Public Grievances</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">No complaints found matching criteria.</p>
              ) : (
                filteredComplaints.map((item) => (
                  <div key={item.id} onClick={() => setSelectedCase(item)} className={`p-3 rounded-xl border cursor-pointer transition ${selectedCase?.id === item.id ? 'bg-amber-50/60 border-amber-600' : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-amber-900">{item.id}</span>
                      <div className="flex gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-amber-50 text-amber-800 border border-amber-200">{item.department}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${item.priority === 'CRITICAL' || item.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800'}`}>{item.priority}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-stone-800 truncate">{item.category}</p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{item.institutionName} (PID: {item.institutionId})</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-span-7 bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            {selectedCase ? (
              <div>
                <div className="flex justify-between items-start border-b border-stone-200 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-amber-800">{selectedCase.institutionName} • PID: {selectedCase.institutionId}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{selectedCase.department}</span>
                    </div>
                    <h2 className="text-base font-bold text-stone-900">{selectedCase.category}</h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${selectedCase.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-stone-100 text-stone-800 border-stone-300'}`}>
                    {selectedCase.status}
                  </span>
                </div>

                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Original Grievance Text</h3>
                  <p className="text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-stone-800 leading-relaxed">{selectedCase.description}</p>
                </div>

                <div className="mb-6 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <h3 className="text-xs font-semibold text-stone-700 mb-2">{role === 'officer' ? 'Official Action / Verification Remarks' : 'Institutional Clarification Response'}</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Add official notes..." value={officerRemark} onChange={(e) => setOfficerRemark(e.target.value)} className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600" />
                    <button onClick={handleResolveCase} className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" /> Audit Trail & Resolution Timeline
                  </h3>
                  <div className="space-y-3 relative pl-4 border-l-2 border-amber-300 max-h-[180px] overflow-y-auto">
                    {selectedCase.timeline.map((log, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600 ring-4 ring-amber-100"></div>
                        <p className="text-xs font-semibold text-stone-800">{log.action}</p>
                        <p className="text-[10px] text-stone-500">{log.date} • Action by <span className="text-amber-800 font-medium">{log.actor}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-stone-400 text-sm">Select a complaint to review details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
