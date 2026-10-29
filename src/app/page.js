'use client';
import React, { useState } from 'react';
import { calculateSemanticOverlap } from './utils/aiEngine';
import { Shield, Filter, Send, CheckCircle, Clock, FileText, Lock, UserCheck, Building2, User, Key, LogOut, Search, AlertCircle, ChevronDown, Download, Activity, Cpu, ArrowRight, CheckCircle2, Zap, BellRing, Sparkles, PhoneCall, Mail, X, Award, ShieldAlert } from 'lucide-react';

const collegesList = [
  { pid: "12345", name: "Apex Institute of Technology", riskScore: 92, grade: "A+", pendingCases: 2, status: "Compliant" },
  { pid: "54321", name: "Indore College of Engineering & Tech", riskScore: 78, grade: "B", pendingCases: 5, status: "Moderate Risk" },
  { pid: "99887", name: "Central Institute of Science & Tech", riskScore: 54, grade: "CRITICAL", pendingCases: 12, status: "High Audit Risk" }
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
    aiStatus: "AI Surveillance Active ⚡",
    deadline: "2026-10-25",
    timeline: [
      { date: "2026-10-22", action: "Grievance Registered via Student Portal", actor: "Student" },
      { date: "2026-10-22", action: "AI Engine Flagged CRITICAL Priority & Alerted Anti-Ragging Cell", actor: "AI Core" }
    ]
  },
  {
    id: "CNT-2026-0101",
    institutionId: "12345",
    institutionName: "Apex Institute of Technology",
    department: "Regulation Bureau",
    category: "Fee Exceeding AICTE Norms",
    description: "College management is demanding mandatory development fees of ₹45,000 exceeding AICTE prescribed ceilings.",
    status: "Pending",
    priority: "HIGH",
    isDuplicate: false,
    matchedCaseId: null,
    similarityScore: null,
    aiReason: null,
    aiStatus: "AI Semantic Audit Passed ✓",
    deadline: "2026-11-05",
    timeline: [
      { date: "2026-10-20", action: "Grievance Registered", actor: "Student Portal" }
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
      { date: "2026-10-10", action: "Grievance Registered", actor: "Student" },
      { date: "2026-10-18", action: "Action Taken / Resolved: Systems Upgraded.", actor: "Institute Admin" }
    ]
  }
];

export default function OneDeskDashboard() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'login' | 'dashboard'
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

  // Contact / Helpline Modal State
  const [showHelpline, setShowHelpline] = useState(false);
  
  // Student Form State
  const [targetInstName, setTargetInstName] = useState('Apex Institute of Technology');
  const [targetPid, setTargetPid] = useState('12345');
  const [formDepartment, setFormDepartment] = useState('Anti-Ragging Cell');
  const [customOtherDepartment, setCustomOtherDepartment] = useState('');
  const [formCategory, setFormCategory] = useState('Ragging & Student Harassment');
  const [customOtherCategory, setCustomOtherCategory] = useState('');
  const [formPriority, setFormPriority] = useState('CRITICAL');
  const [newDesc, setNewDesc] = useState('');
  const [aiAlert, setAiAlert] = useState(null);
  const [officerRemark, setOfficerRemark] = useState('');

  // Home Page Interactive Simulation State
  const [demoRollNo, setDemoRollNo] = useState('STU-12345');
  const [demoComplaint, setDemoComplaint] = useState('Seniors demanding mandatory extra charges for hostel development near Block B.');
  const [demoNotification, setDemoNotification] = useState(null);

  // Live Notification Popup State (Dashboard)
  const [notificationAlert, setNotificationAlert] = useState(null);

  const totalCount = 1248 + complaints.length - initialComplaints.length;
  const pendingCount = 166 + complaints.filter(c => c.status === 'Pending').length - 2;
  const resolvedCount = 1082 + complaints.filter(c => c.status === 'Resolved').length - 1;
  const duplicateCount = 340 + complaints.filter(c => c.isDuplicate).length;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setRole(loginRole);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
    setCurrentPage('home');
  };

  const handleRunHomeDemo = () => {
    setDemoNotification({
      show: true,
      caseId: `CNT-2026-DEMO`,
      college: "Apex Institute of Technology (PID: 12345)",
      department: demoComplaint.toLowerCase().includes('senior') ? "Anti-Ragging Cell" : "Regulation Bureau",
      priority: "CRITICAL",
      smsPayload: `[AICTE DISPATCH] CRITICAL Case #CNT-2026-DEMO logged for Apex Inst of Tech. Auto-routed to Anti-Ragging Nodal Desk.`
    });
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

  const exportWordDoc = () => {
    const targetData = filteredComplaints;
    let docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>AICTE OneDesk Institutional Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #854d0e; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; }
        th { background-color: #f1f5f9; }
      </style>
      </head>
      <body>
        <h1>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)</h1>
        <h3 style="text-align:center;">OneDesk Grievance & Audit Report - Offline Export</h3>
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
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
      aiStatus: "AI Surveillance Active ⚡",
      deadline: "2026-11-05",
      timeline: [
        { date: new Date().toISOString().split('T')[0], action: "Grievance Filed by Student", actor: "Registered Student" },
        { date: new Date().toISOString().split('T')[0], action: "AI Engine Priority Classification & Overlap Scan Complete", actor: "AI Core" }
      ]
    };

    setComplaints([newEntry, ...complaints]);
    setSelectedCase(newEntry);
    
    if (matchFound) {
      setAiAlert(`⚠️ Overlap Flag: Duplicate grievance detected with Case #${matchFound.id} (${highestScore.score} similarity).`);
    } else {
      setAiAlert(`✅ Grievance registered successfully under ID: ${newId}`);
    }

    setNotificationAlert({
      show: true,
      caseId: newId,
      college: targetInstName,
      department: finalDepartment,
      priority: formPriority,
      smsPayload: `[AICTE DISPATCH] ${formPriority} Case #${newId} logged for ${targetInstName}. Auto-routed to ${finalDepartment} Desk.`
    });

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

  // 1. PUBLIC HOME PAGE
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans relative">
        
        {/* 24/7 Helpline Modal */}
        {showHelpline && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl relative">
              <button 
                onClick={() => setShowHelpline(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-xl">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">AICTE 24/7 Helpline & Contact</h3>
                  <p className="text-[11px] text-stone-500">Official Emergency Support Desk</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">Toll-Free Anti-Ragging Helpline</span>
                    <strong className="text-stone-800 text-sm">1800-180-5522</strong>
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200">24/7 Live</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">AICTE Central Grievance Desk</span>
                    <strong className="text-stone-800 text-sm">011-29581000 / 011-29581050</strong>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">Official Email Dispatch</span>
                    <strong className="text-stone-800">grievance@aicte-india.org</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Navigation */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 border border-amber-300 rounded-xl text-amber-900">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">AICTE OneDesk</h1>
              <p className="text-[11px] text-stone-500 font-semibold">AICTE PS Code: SIH26264 • Grievance Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 shadow-sm">
              <Activity className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>AI Surveillance Active</span>
            </div>

            <button 
              onClick={() => setShowHelpline(true)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-300 transition flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" /> 24/7 Helpline
            </button>

            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-sm transition flex items-center gap-2">
              Access Portal / Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Hero Banner Section */}
        <section className="bg-stone-900 text-white py-14 px-8 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-400/30 inline-block mb-4">
              AICTE PS# SIH26264 • AI-Powered OneDesk Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Centralized AI-Monitored Student Grievance & Institutional Audit Engine
            </h2>
            <p className="text-stone-300 text-sm max-w-2xl mx-auto mb-8">
              AICTE approved technical education redressal framework featuring semantic duplicate detection, 24/7 Anti-Ragging surveillance, and chronological audit trail logs.
            </p>

            <div className="inline-flex gap-4">
              <button 
                onClick={() => { setLoginRole('student'); setCurrentPage('login'); }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2">
                <User className="w-4 h-4" /> Submit Student Grievance
              </button>
              <button 
                onClick={() => { setLoginRole('officer'); setCurrentPage('login'); }}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" /> AICTE Official Audit Panel
              </button>
            </div>
          </div>
        </section>

        {/* Live Public Metrics */}
        <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md flex items-center gap-4">
              <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">Total Grievances</p>
                <p className="text-2xl font-extrabold text-stone-900">{totalCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">Cases Resolved</p>
                <p className="text-2xl font-extrabold text-stone-900">{resolvedCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-800">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">Pending Resolution</p>
                <p className="text-2xl font-extrabold text-stone-900">{pendingCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-md flex items-center gap-4">
              <div className="p-3 bg-rose-100 rounded-xl text-rose-800">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">AI Overlaps Caught</p>
                <p className="text-2xl font-extrabold text-stone-900">{duplicateCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROTOTYPE ARCHITECTURE & WORKING FLOW DIAGRAM ON HOME PAGE */}
        <section className="max-w-6xl mx-auto px-6 pt-12">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-lg">
            <div className="text-center mb-8">
              <span className="text-amber-800 bg-amber-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                System Workflow & Architecture
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 mt-2">How AICTE OneDesk Operates End-to-End</h3>
              <p className="text-xs text-stone-500 mt-1">Autonomous 4-stage pipeline replacing legacy manual complaint routing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center relative">
                <div className="w-10 h-10 bg-amber-800 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-3 shadow">1</div>
                <h4 className="font-bold text-xs text-stone-900 mb-1">Multi-Channel Intake</h4>
                <p className="text-[11px] text-stone-500">Student files grievance via Portal with auto PID resolution & Whistleblower Shield.</p>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center relative">
                <div className="w-10 h-10 bg-amber-800 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-3 shadow">2</div>
                <h4 className="font-bold text-xs text-stone-900 mb-1">AI Semantic Audit</h4>
                <p className="text-[11px] text-stone-500">NLP engine detects duplicate backlogs & assigns CRITICAL/HIGH priority score.</p>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center relative">
                <div className="w-10 h-10 bg-amber-800 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-3 shadow">3</div>
                <h4 className="font-bold text-xs text-stone-900 mb-1">Instant Nodal Dispatch</h4>
                <p className="text-[11px] text-stone-500">Zero-manual routing triggers real-time SMS payload to assigned Bureau Officials.</p>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center relative">
                <div className="w-10 h-10 bg-amber-800 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-3 shadow">4</div>
                <h4 className="font-bold text-xs text-stone-900 mb-1">Immutable Audit Trail</h4>
                <p className="text-[11px] text-stone-500">Chronological logs tracked till proof-of-action resolution by AICTE Officials.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive AI Dispatch Simulation Block */}
        <section className="max-w-6xl mx-auto px-6 pt-10">
          <div className="bg-stone-900 text-white rounded-3xl p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4" /> Live Interactive Prototype Demonstration
                </span>
                <h3 className="text-xl font-extrabold">Autonomous AI Nodal Routing & Instant Officer Alert</h3>
                <p className="text-stone-400 text-xs mt-1">Test how the system automatically resolves institute data and triggers officer notification payload in real-time.</p>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-400/30">
                ZERO MANUAL ROUTING
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div>
                  <label className="block text-stone-400 text-[11px] font-semibold mb-1">Sample Student Roll Number</label>
                  <input 
                    type="text" 
                    value={demoRollNo} 
                    onChange={(e) => setDemoRollNo(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-200 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] font-semibold mb-1">Sample Grievance Description</label>
                  <textarea 
                    rows={2}
                    value={demoComplaint}
                    onChange={(e) => setDemoComplaint(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button 
                  onClick={handleRunHomeDemo}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg">
                  <Zap className="w-4 h-4" /> Simulate Instant AI Dispatch Alert
                </button>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-5 text-xs">
                {demoNotification ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-stone-700 pb-2">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                        <BellRing className="w-4 h-4 animate-bounce" /> DISPATCH TRIGGERED
                      </span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-500/30">
                        {demoNotification.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block font-semibold">AUTO-RESOLVED COLLEGE:</span>
                      <p className="font-bold text-stone-200">{demoNotification.college}</p>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block font-semibold">ASSIGNED DESK:</span>
                      <p className="font-bold text-amber-300">{demoNotification.department}</p>
                    </div>
                    <div className="bg-stone-900 p-3 rounded-xl border border-stone-700 text-[10px] font-mono text-stone-300">
                      <span className="text-amber-400 font-bold block mb-1">Live SMS Payload Sent to Officer:</span>
                      "{demoNotification.smsPayload}"
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-stone-600 animate-pulse" />
                    <p className="text-xs">Click "Simulate Instant AI Dispatch Alert" to test real-time officer notification payload generation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs border-t border-stone-800 mt-12">
          All India Council for Technical Education (AICTE) • Problem Statement ID: SIH26264
        </footer>
      </div>
    );
  }

  // 2. LOGIN SCREEN (UNCHANGED AS REQUESTED)
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-800 flex items-center justify-center p-4 font-sans relative">
        <button 
          onClick={() => setCurrentPage('home')}
          className="absolute top-6 left-6 text-xs font-bold text-stone-600 bg-white px-4 py-2 rounded-xl border border-stone-300 shadow-sm hover:bg-stone-50 transition">
          ← Back to Home
        </button>

        <div className="max-w-md w-full bg-white border border-stone-300 rounded-2xl p-8 shadow-xl relative">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 mb-3">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">AICTE OneDesk</h1>
            <p className="text-xs text-stone-500 mt-1">Select Role & Access Portal Account</p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 mb-6 text-xs">
            <button 
              type="button" 
              onClick={() => setLoginRole('student')} 
              className={`py-2 font-medium rounded-lg transition flex items-center justify-center gap-1 ${loginRole === 'student' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>
              <User className="w-3.5 h-3.5" /> Student
            </button>
            <button 
              type="button" 
              onClick={() => setLoginRole('institution')} 
              className={`py-2 font-medium rounded-lg transition flex items-center justify-center gap-1 ${loginRole === 'institution' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>
              <Building2 className="w-3.5 h-3.5" /> Institute
            </button>
            <button 
              type="button" 
              onClick={() => setLoginRole('officer')} 
              className={`py-2 font-medium rounded-lg transition flex items-center justify-center gap-1 ${loginRole === 'officer' ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>
              <UserCheck className="w-3.5 h-3.5" /> Official
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {loginRole === 'student' ? 'Student Registration / Roll No' : loginRole === 'institution' ? 'Institute PID (Permanent ID)' : 'Official AICTE Credentials'}
              </label>
              <input 
                type="text" 
                required 
                placeholder={loginRole === 'student' ? 'STU-2026-9081' : loginRole === 'institution' ? '12345' : 'officer@aicte-india.org'} 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none focus:border-amber-600" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password / Security Access Key</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none focus:border-amber-600" 
              />
            </div>

            <button type="submit" className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-xl text-xs shadow transition">
              Access OneDesk Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans p-6 relative">
      
      {/* Live Officer Alert Notification Toast */}
      {notificationAlert?.show && (
        <div className="fixed bottom-5 right-5 max-w-sm bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 z-50 animate-bounce">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <BellRing className="w-4 h-4 animate-pulse" /> OFFICER DISPATCH ALERT
            </div>
            <button 
              onClick={() => setNotificationAlert(null)}
              className="text-stone-400 hover:text-white text-xs font-bold">
              ✕
            </button>
          </div>
          <p className="text-[11px] text-stone-300 mb-2">
            Automated notification triggered to <strong>{notificationAlert.department} Head</strong> & <strong>College Management</strong>.
          </p>
          <div className="bg-stone-800 p-2.5 rounded-xl border border-stone-700 text-[10px] font-mono text-stone-300">
            <span className="text-amber-400 font-bold">SMS Payload:</span> "{notificationAlert.smsPayload}"
          </div>
        </div>
      )}

      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 border border-amber-200 rounded-xl text-amber-900 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900">AICTE OneDesk</h1>
            <p className="text-[11px] text-stone-500 font-semibold">PS Code: SIH26264 • Grievance Redressal Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-xs bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-300 font-medium text-stone-700 transition">
            Public Home
          </button>

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

          {/* AI INSTITUTIONAL HEALTH CARD BOARD IN OFFICER PANEL */}
          <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-200">AI Institutional Risk & Health Index Board</h3>
              </div>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">Auto Audit Active</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {collegesList.map((inst) => (
                <div 
                  key={inst.pid} 
                  onClick={() => setSearchPid(inst.pid)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${searchPid === inst.pid ? 'bg-stone-800 border-amber-500 ring-2 ring-amber-500/20' : 'bg-stone-800/60 border-stone-700 hover:border-stone-600'}`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-xs font-bold text-stone-100 truncate max-w-[170px]">{inst.name}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${inst.grade === 'A+' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : inst.grade === 'B' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                      {inst.grade}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-2">
                    <span>PID: {inst.pid}</span>
                    <span className="text-amber-400 font-bold">Health Score: {inst.riskScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <FileText className="w-6 h-6 text-stone-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">Total Complaints</p>
                <p className="text-lg font-bold text-stone-900">{complaints.length}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <Clock className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">Pending Cases</p>
                <p className="text-lg font-bold text-stone-900">{complaints.filter(c => c.status === 'Pending').length}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <AlertCircle className="w-6 h-6 text-rose-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">High / Critical Priority</p>
                <p className="text-lg font-bold text-stone-900">{complaints.filter(c => c.priority === 'HIGH' || c.priority === 'CRITICAL').length}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3 shadow-sm">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-[10px] text-stone-500 uppercase font-semibold">AI Overlaps Detected</p>
                <p className="text-lg font-bold text-stone-900">{complaints.filter(c => c.isDuplicate).length}</p>
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

            <div className="grid grid-cols-3 gap-3">
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
