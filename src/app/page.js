'use client';
import React, { useState } from 'react';
import initialComplaints from './data/complaints.json';
import { calculateSemanticOverlap } from './utils/aiEngine';
import { Shield, Filter, Send, CheckCircle, Clock, FileText, Lock, UserCheck, Building2, User, Key, LogOut, Search, AlertCircle } from 'lucide-react';

export default function OneDeskDashboard() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState('student'); // 'student', 'institution', 'officer'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const [role, setRole] = useState('student');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchPid, setSearchPid] = useState('');
  const [selectedCase, setSelectedCase] = useState(complaints[0]);
  
  // New Complaint Form
  const [targetInstName, setTargetInstName] = useState('Apex Institute of Technology');
  const [targetPid, setTargetPid] = useState('1-99887766');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Fee Exceeding AICTE Norms');
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

  // Filter complaints based on Role & Search PID
  const filteredComplaints = complaints.filter(c => {
    const matchesDept = selectedDept === 'All' ? true : c.department === selectedDept;
    if (role === 'institution') {
      return matchesDept && (c.institutionId === '1-99887766' || c.institutionName.includes('Apex'));
    }
    if (role === 'officer' && searchPid.trim() !== '') {
      return matchesDept && (c.institutionId.includes(searchPid) || c.institutionName.toLowerCase().includes(searchPid.toLowerCase()));
    }
    return matchesDept;
  });

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'HIGH').length;
  const duplicateCount = complaints.filter(c => c.isDuplicate).length;

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

    const newId = `CNT-2026-010${complaints.length + 1}`;
    const newEntry = {
      id: newId,
      institutionId: targetPid || "1-99887766",
      institutionName: targetInstName || "Apex Institute of Technology",
      department: newCat.includes('Fee') ? "Regulation Bureau" : "Public Grievances",
      category: newCat,
      description: newDesc,
      status: "Pending",
      priority: newDesc.toLowerCase().includes('harassment') || newDesc.toLowerCase().includes('urgent') ? "HIGH" : "MEDIUM",
      isDuplicate: !!matchFound,
      matchedCaseId: matchFound ? matchFound.id : null,
      similarityScore: highestScore ? highestScore.score : null,
      aiReason: highestScore ? highestScore.reason : null,
      deadline: "2026-11-05",
      timeline: [
        { date: new Date().toISOString().split('T')[0], action: "Grievance Filed by Student", actor: "Registered Student/User" }
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
  };

  const handleResolveCase = () => {
    if (!selectedCase) return;
    const updated = complaints.map(c => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: 'Resolved',
          timeline: [
            ...c.timeline,
            { date: new Date().toISOString().split('T')[0], action: `Action Taken / Resolved: ${officerRemark || 'Verification completed.'}`, actor: role === 'officer' ? 'AICTE Officer' : 'Institute Representative' }
          ]
        };
      }
      return c;
    });
    setComplaints(updated);
    setSelectedCase({
      ...selectedCase,
      status: 'Resolved',
      timeline: [
        ...selectedCase.timeline,
        { date: new Date().toISOString().split('T')[0], action: `Action Taken / Resolved: ${officerRemark || 'Verification completed.'}`, actor: role === 'officer' ? 'AICTE Officer' : 'Institute Representative' }
      ]
    });
    setOfficerRemark('');
  };

  // 1. SECURE HUMAN-MADE LOGIN SCREEN
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

          {/* Role Selector Tabs */}
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
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  required
                  placeholder={loginRole === 'student' ? 'STU-2026-9081' : loginRole === 'institution' ? '1-99887766' : 'officer@aicte-india.org'}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password / Security Access Key</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Key className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-[11px] text-amber-900">
              <Lock className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Government Portal Certified 256-Bit SSL Encrypted Session</span>
            </div>

            <button 
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-xl text-xs shadow transition">
              Access OneDesk Portal
            </button>
          </form>

          <div className="mt-6 text-center text-[11px] text-stone-400">
            All India Council for Technical Education • Official Portal
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD VIEW
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
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-medium text-stone-600">
            <span className="px-3 py-1 bg-white rounded-lg border border-stone-200 text-stone-900 shadow-sm">
              Role: <strong className="capitalize">{role} Mode</strong>
            </span>
          </div>

          <button 
            onClick={handleLogout}
            title="Secure Logout"
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-stone-700 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Role Metrics / Filter Bar */}
      {role === 'officer' && (
        <div className="space-y-4 mb-6">
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-center gap-3">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input 
              type="text"
              placeholder="Search complaints by College PID (e.g. 1-99887766) or College Name..."
              value={searchPid}
              onChange={(e) => setSearchPid(e.target.value)}
              className="w-full text-xs bg-transparent border-none focus:outline-none text-stone-800"
            />
            {searchPid && (
              <button onClick={() => setSearchPid('')} className="text-xs text-stone-400 hover:text-stone-600">Clear</button>
            )}
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
                <p className="text-[10px] text-stone-500 uppercase font-semibold">High Priority</p>
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

      {/* STUDENT ROLE: FILE COMPLAINT */}
      {role === 'student' ? (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h2 className="text-base font-bold text-stone-900 mb-1">Lodge Official Student Grievance</h2>
          <p className="text-xs text-stone-500 mb-6">Submissions directly audited by AICTE Bureau & Institution Panel.</p>

          {aiAlert && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              {aiAlert}
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Target College Name</label>
                <input 
                  type="text"
                  required
                  value={targetInstName}
                  onChange={(e) => setTargetInstName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">AICTE Permanent ID (PID)</label>
                <input 
                  type="text"
                  required
                  value={targetPid}
                  onChange={(e) => setTargetPid(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Grievance Category</label>
              <select 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-600 text-stone-800">
                <option value="Fee Exceeding AICTE Norms">Fee Exceeding AICTE Norms</option>
                <option value="Faculty & Staff Dispute">Faculty & Staff Dispute</option>
                <option value="Infrastructure Deficit">Infrastructure Deficit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Description</label>
              <textarea 
                rows={4}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe your issue clearly. Smart Engine will automatically verify for existing duplicates..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-600 text-stone-800"
              />
            </div>

            <button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
              <Send className="w-4 h-4" /> Submit & Analyze Grievance
            </button>
          </form>
        </div>
      ) : (
        /* OFFICER & INSTITUTION VIEW */
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xs uppercase tracking-wider text-stone-600 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-stone-500" /> Active Cases ({filteredComplaints.length})
              </h2>
              <select 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-stone-50 text-xs border border-stone-200 rounded-lg p-1.5 focus:outline-none text-stone-700">
                <option value="All">All Bureaus</option>
                <option value="Regulation Bureau">Regulation Bureau</option>
                <option value="Public Grievances">Public Grievances</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">No complaints found matching criteria.</p>
              ) : (
                filteredComplaints.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedCase(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${selectedCase?.id === item.id ? 'bg-amber-50/60 border-amber-600' : 'bg-stone-50/50 border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-amber-900">{item.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${item.priority === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800'}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-800 truncate">{item.category}</p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">{item.institutionName} ({item.institutionId})</p>
                    
                    {item.isDuplicate && (
                      <div className="mt-2 text-[10px] text-amber-800 bg-amber-100/70 p-1.5 rounded-md flex items-center gap-1 border border-amber-200">
                        <AlertCircle className="w-3 h-3 shrink-0" /> AI Overlap Flag ({item.similarityScore})
                      </div>
                    )}
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
                    <span className="text-xs font-semibold text-amber-800">{selectedCase.institutionName} • PID: {selectedCase.institutionId}</span>
                    <h2 className="text-base font-bold text-stone-900 mt-0.5">{selectedCase.category}</h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${selectedCase.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-stone-100 text-stone-800 border-stone-300'}`}>
                    {selectedCase.status}
                  </span>
                </div>

                {selectedCase.isDuplicate && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-stone-700">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-700" /> AI Duplicate Analysis
                    </div>
                    <p>Semantic match with existing record <strong className="underline">{selectedCase.matchedCaseId}</strong> ({selectedCase.similarityScore} similarity).</p>
                    <p className="text-[11px] text-stone-500 mt-1">Reason: {selectedCase.aiReason}</p>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Original Grievance Text</h3>
                  <p className="text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-stone-800 leading-relaxed">{selectedCase.description}</p>
                </div>

                {/* Action / Remarks Box */}
                <div className="mb-6 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <h3 className="text-xs font-semibold text-stone-700 mb-2">
                    {role === 'officer' ? 'Official Action / Verification Remarks' : 'Institutional Clarification Response'}
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add official notes or response text..."
                      value={officerRemark}
                      onChange={(e) => setOfficerRemark(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                    />
                    <button 
                      onClick={handleResolveCase}
                      className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Audit Trail Log</h3>
                  <div className="space-y-3 relative pl-4 border-l-2 border-stone-200 max-h-[160px] overflow-y-auto">
                    {selectedCase.timeline.map((log, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-stone-400"></div>
                        <p className="text-xs font-semibold text-stone-800">{log.action}</p>
                        <p className="text-[10px] text-stone-500">{log.date} • Performed by <span className="text-amber-800 font-medium">{log.actor}</span></p>
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
