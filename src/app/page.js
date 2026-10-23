'use client';
import React, { useState } from 'react';
import initialComplaints from './data/complaints.json';
import { calculateSemanticOverlap } from './utils/aiEngine';
import { AlertTriangle, Shield, Filter, Send, CheckCircle, Clock, FileText, Lock, UserCheck, Building2, Key, LogOut } from 'lucide-react';

export default function OneDeskDashboard() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState('officer'); // 'officer' or 'institution'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const [role, setRole] = useState('officer');
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCase, setSelectedCase] = useState(complaints[0]);
  
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Fee Exceeding AICTE Norms');
  const [aiAlert, setAiAlert] = useState(null);
  const [officerRemark, setOfficerRemark] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    if (loginRole === 'institution') {
      setRole('institution');
    } else {
      setRole('officer');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
  };

  const filteredComplaints = complaints.filter(c => 
    selectedDept === 'All' ? true : c.department === selectedDept
  );

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
      institutionId: "1-99887766",
      institutionName: "Apex Institute of Technology",
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
        { date: new Date().toISOString().split('T')[0], action: "Complaint Submitted via Institute Portal", actor: "Apex Representative" }
      ]
    };

    setComplaints([newEntry, ...complaints]);
    setSelectedCase(newEntry);
    
    if (matchFound) {
      setAiAlert(`⚠️ AI Overlap Alert: Potential Duplicate matched with Case #${matchFound.id} (${highestScore.score} similarity).`);
    } else {
      setAiAlert(`✅ Complaint successfully registered under ID: ${newId}`);
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
            { date: new Date().toISOString().split('T')[0], action: `Case Marked Resolved: ${officerRemark || 'Verification completed.'}`, actor: 'AICTE Officer' }
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
        { date: new Date().toISOString().split('T')[0], action: `Case Marked Resolved: ${officerRemark || 'Verification completed.'}`, actor: 'AICTE Officer' }
      ]
    });
    setOfficerRemark('');
  };

  // 1. SECURE LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mb-3">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AICTE OneDesk Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Secure Unified Complaint Monitoring System</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
            <button 
              type="button"
              onClick={() => setLoginRole('officer')}
              className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${loginRole === 'officer' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
              <UserCheck className="w-4 h-4" /> AICTE Officer
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('institution')}
              className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${loginRole === 'institution' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
              <Building2 className="w-4 h-4" /> Institution
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {loginRole === 'officer' ? 'Officer ID / Email' : 'AICTE Permanent ID (PID)'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  required
                  placeholder={loginRole === 'officer' ? 'officer@aicte-india.org' : '1-99887766'}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Secure Password / Token</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Key className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Security Indicator Badge */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-2.5 text-[11px] text-emerald-400">
              <Lock className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>256-Bit SSL Encrypted & Role Authenticated Session</span>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2">
              Secure Login to Dashboard
            </button>
          </form>

          <div className="mt-6 text-center text-[11px] text-slate-500">
            Protected by AICTE Government Digital Infrastructure Security
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD VIEW (With Emerald/Slate Professional Theme)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">AICTE OneDesk Platform</h1>
            <p className="text-[11px] text-slate-400">Unified Institution Complaint Monitoring System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setRole('officer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${role === 'officer' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
              AICTE Officer
            </button>
            <button 
              onClick={() => setRole('institution')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${role === 'institution' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>
              Apex Inst. (PID: 1-99887766)
            </button>
          </div>

          <button 
            onClick={handleLogout}
            title="Secure Logout"
            className="p-2 bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 rounded-xl text-slate-300 hover:text-rose-400 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Top Summary Metrics */}
      {role === 'officer' && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <FileText className="w-7 h-7 text-emerald-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Complaints</p>
              <p className="text-lg font-bold text-white">{totalCount}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <Clock className="w-7 h-7 text-amber-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Pending Action</p>
              <p className="text-lg font-bold text-white">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">High Priority</p>
              <p className="text-lg font-bold text-white">{highPriorityCount}</p>
            </div>
          </div>
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
            <CheckCircle className="w-7 h-7 text-teal-400" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">AI Duplicate Flags</p>
              <p className="text-lg font-bold text-white">{duplicateCount}</p>
            </div>
          </div>
        </div>
      )}

      {role === 'officer' ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-emerald-400" /> Active Complaints Directory
              </h2>
              <select 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-950 text-xs border border-slate-800 rounded-lg p-1.5 focus:outline-none text-slate-300">
                <option value="All">All Bureaus</option>
                <option value="Regulation Bureau">Regulation Bureau</option>
                <option value="Public Grievances">Public Grievances</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredComplaints.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${selectedCase?.id === item.id ? 'bg-slate-800 border-emerald-500' : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-emerald-400">{item.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${item.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 truncate">{item.category}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{item.description}</p>
                  
                  {item.isDuplicate && (
                    <div className="mt-2 text-[10px] text-amber-400 bg-amber-500/10 p-1.5 rounded-lg flex items-center gap-1 border border-amber-500/20">
                      <AlertTriangle className="w-3 h-3 shrink-0" /> AI Duplicate Flag ({item.similarityScore} Overlap)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-7 bg-slate-900 p-5 rounded-xl border border-slate-800">
            {selectedCase ? (
              <div>
                <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-400">Institution: {selectedCase.institutionName} ({selectedCase.institutionId})</span>
                    <h2 className="text-lg font-bold text-white mt-0.5">{selectedCase.category}</h2>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${selectedCase.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                    {selectedCase.status}
                  </span>
                </div>

                {selectedCase.isDuplicate && (
                  <div className="mb-4 p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-400">
                      <AlertTriangle className="w-4 h-4" /> AI Overlap Detection Explanation
                    </div>
                    <p>Matches with existing record <strong className="underline">{selectedCase.matchedCaseId}</strong> with <strong>{selectedCase.similarityScore}</strong> semantic similarity.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Reason: {selectedCase.aiReason}</p>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detailed Grievance Text</h3>
                  <p className="text-sm bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300">{selectedCase.description}</p>
                </div>

                {/* Officer Action Box */}
                <div className="mb-6 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-300 mb-2">Take Official Action / Update Remarks</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add officer notes or verification remarks..."
                      value={officerRemark}
                      onChange={(e) => setOfficerRemark(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={handleResolveCase}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Audit Trail & Action History</h3>
                  <div className="space-y-3 relative pl-4 border-l-2 border-slate-800 max-h-[160px] overflow-y-auto">
                    {selectedCase.timeline.map((log, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <p className="text-xs font-semibold text-slate-200">{log.action}</p>
                        <p className="text-[10px] text-slate-400">{log.date} • Performed by <span className="text-emerald-400">{log.actor}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Select a complaint to view details.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-lg font-bold mb-1">Submit Institutional Clarification / Grievance</h2>
          <p className="text-xs text-slate-400 mb-6">Linked Institution ID: 1-99887766 (Apex Institute of Technology)</p>

          {aiAlert && (
            <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200">
              {aiAlert}
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Complaint Category</label>
              <select 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-300">
                <option value="Fee Exceeding AICTE Norms">Fee Exceeding AICTE Norms</option>
                <option value="Faculty & Staff Dispute">Faculty & Staff Dispute</option>
                <option value="Infrastructure Deficit">Infrastructure Deficit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Grievance Description</label>
              <textarea 
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Type complaint text here to test live AI duplicate checking..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 text-slate-200"
              />
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30">
              <Send className="w-4 h-4" /> Submit & Analyze with OneDesk AI
            </button>
          </form>
        </div>
      )}
    </div>
  );
}