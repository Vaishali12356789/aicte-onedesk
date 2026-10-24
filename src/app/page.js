'use client';
import React, { useState } from 'react';
import { calculateSemanticOverlap } from './utils/aiEngine';
import { Shield, Filter, Send, CheckCircle, Clock, FileText, Lock, UserCheck, Building2, User, Key, LogOut, Search, AlertCircle, ChevronDown, Download, Activity, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

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
  
  // Student Form State with 3-Level Dropdowns
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

  // Overall Live Metrics
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

    setNewDesc('');
    setCustomOtherDepartment('');
    setCustomOtherCategory('');
  };

  // --- PAGE 1: PUBLIC HOME PAGE ---
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
        {/* Header Navigation */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 border border-amber-300 rounded-xl text-amber-900">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">AICTE OneDesk</h1>
              <p className="text-[11px] text-stone-500">All India Council for Technical Education • Grievance Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-stone-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Activity className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> AI Surveillance Active
            </div>
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2">
              Access Portal / Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Hero Banner Section */}
        <section className="bg-stone-900 text-white py-16 px-8 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-amber-400/30 inline-block mb-4">
              Ministry of Education • National Technical Grievance Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Centralized AI-Monitored Student Grievance & Audit System
            </h2>
            <p className="text-stone-300 text-sm max-w-2xl mx-auto mb-8">
              Automated duplicate detection, 24/7 Anti-Ragging surveillance, and transparent chronological audit logs for AICTE approved technical institutions across India.
            </p>

            <div className="inline-flex gap-4">
              <button 
                onClick={() => { setLoginRole('student'); setCurrentPage('login'); }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition">
                Submit Student Grievance
              </button>
              <button 
                onClick={() => { setLoginRole('officer'); setCurrentPage('login'); }}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs px-6 py-3 rounded-xl transition">
                AICTE Official Audit Panel
              </button>
            </div>
          </div>
        </section>

        {/* Live Metrics */}
        <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">Total Grievances</p>
                <p className="text-2xl font-extrabold text-stone-900">{totalCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">Cases Resolved</p>
                <p className="text-2xl font-extrabold text-stone-900">{resolvedCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-lg flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-800">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase">Pending Resolution</p>
                <p className="text-2xl font-extrabold text-stone-900">{pendingCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-lg flex items-center gap-4">
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

        {/* Feature Grid */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h3 className="text-xl font-bold text-stone-900">Portal Core Modules</h3>
            <p className="text-xs text-stone-500 mt-1">Robust system ensuring fast grievance redressal & 100% accountability</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-2">24/7 Anti-Ragging Cell</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Instant emergency routing & high-priority escalation for confidential student harassment cases.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-2">AI Duplicate Scan</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                NLP semantic analysis clusters similar complaints across campuses to eliminate duplicate backlogs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-2">Audit Trail Logs</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Clear timestamped timeline for every registered issue ensuring complete administrative transparency.
              </p>
            </div>
          </div>
        </section>

        <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs border-t border-stone-800">
          All India Council for Technical Education • Official Portal Infrastructure
        </footer>
      </div>
    );
  }

  // --- PAGE 2: LOGIN SCREEN ---
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

  // --- PAGE 3: DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 border border-amber-200 rounded-xl text-amber-900 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-stone-900">AICTE OneDesk</h1>
            <p className="text-[11px] text-stone-500">Centralized Grievance Redressal & Institutional Audit Engine</p>
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

      {/* Main Form & Officer Panel */}
    </div>
  );
}
