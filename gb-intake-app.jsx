import { useState, useEffect } from "react";

// ─── Golden Butterflies Brand Colors ────────────────────────────────────────
const GB = {
  gold: "#F5A623",
  goldLight: "#FDD98A",
  goldDark: "#C8860A",
  purple: "#7B3FA0",
  purpleLight: "#A56CC1",
  purpleDark: "#5C2D7A",
  cream: "#FFFDF7",
  warmGray: "#F9F5EE",
  text: "#2D1B4E",
  textMid: "#5A4070",
  textLight: "#9B89B0",
  border: "#E8D9F5",
  success: "#27AE60",
  danger: "#E74C3C",
  white: "#FFFFFF",
};

// ─── Role-Based Access Control ──────────────────────────────────────────────
const ROLES = {
  NURSE: "nurse",
  SOCIAL_WORKER: "social_worker",
  PSYCHOLOGIST: "psychologist",
};

const ROLE_CONFIG = {
  [ROLES.NURSE]: {
    label: "Nurse",
    icon: "👩‍⚕️",
    color: "#3B82F6",
    desc: "Patient registration & vitals",
    canEditSteps: [0, 1, 2, 3, 4, 5, 6, 7], // Enrollment through Vitals
  },
  [ROLES.SOCIAL_WORKER]: {
    label: "Social Worker",
    icon: "👨‍💼",
    color: "#F59E0B",
    desc: "Socio-economic & family assessment",
    canEditSteps: [8, 10], // Socio-Eco, Assessment
  },
  [ROLES.PSYCHOLOGIST]: {
    label: "Psychologist",
    icon: "🧠",
    color: "#8B5CF6",
    desc: "Psychosocial evaluation",
    canEditSteps: [9], // Psychosocial only
  },
};

// ─── CSS Injection ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${GB.warmGray}; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
  input::placeholder, textarea::placeholder { color: ${GB.textLight}; }
  select option { background: white; color: ${GB.text}; }
  input[type=text]:focus, input[type=number]:focus, input[type=tel]:focus, input[type=date]:focus, select:focus, textarea:focus {
    outline: none; border-color: ${GB.purple} !important; box-shadow: 0 0 0 3px ${GB.purple}20;
  }
  .cb-row { display:flex; align-items:center; gap:8px; cursor:pointer; padding:6px 0; }
  .cb-row:hover .cb-box { border-color: ${GB.purple}; background: ${GB.purple}10; }
  .cb-box { width:18px; height:18px; border:2px solid ${GB.border}; border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.15s; }
  .cb-box.checked { background:${GB.purple}; border-color:${GB.purple}; }
  .cb-box.checked::after { content:'✓'; color:white; font-size:11px; font-weight:700; }
  .radio-row { display:flex; align-items:center; gap:8px; cursor:pointer; padding:5px 0; }
  .radio-dot { width:18px; height:18px; border-radius:50%; border:2px solid ${GB.border}; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.15s; }
  .radio-dot.checked { border-color:${GB.purple}; background:${GB.purple}; }
  .radio-dot.checked::after { content:''; width:6px; height:6px; border-radius:50%; background:white; }
  .section-card { background:white; border-radius:16px; border:1px solid ${GB.border}; margin-bottom:20px; overflow:hidden; }
  .section-header { background: linear-gradient(135deg, ${GB.purple}08, ${GB.gold}08); padding:16px 22px; border-bottom:1px solid ${GB.border}; display:flex; align-items:center; gap:10px; }
  .section-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:700; color:${GB.purple}; }
  .section-body { padding:22px; }
  .field-group { margin-bottom:16px; }
  .field-label { font-size:11px; font-weight:600; color:${GB.textLight}; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; display:block; }
  .field-input { width:100%; border:1.5px solid ${GB.border}; border-radius:10px; padding:11px 14px; font-size:14px; color:${GB.text}; background:${GB.cream}; transition:all 0.2s; }
  .field-select { width:100%; border:1.5px solid ${GB.border}; border-radius:10px; padding:11px 14px; font-size:14px; color:${GB.text}; background:${GB.cream}; cursor:pointer; transition:all 0.2s; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237B3FA0' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
  .field-textarea { width:100%; border:1.5px solid ${GB.border}; border-radius:10px; padding:11px 14px; font-size:14px; color:${GB.text}; background:${GB.cream}; resize:vertical; min-height:80px; transition:all 0.2s; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  .divider { height:1px; background:${GB.border}; margin:20px 0; }
  .sub-section-title { font-size:13px; font-weight:700; color:${GB.purple}; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px; }
  .btn-primary { background:linear-gradient(135deg, ${GB.purple}, ${GB.purpleDark}); color:white; border:none; border-radius:12px; padding:14px 28px; font-size:15px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; box-shadow:0 4px 16px ${GB.purple}40; }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px ${GB.purple}50; }
  .btn-secondary { background:white; color:${GB.purple}; border:2px solid ${GB.purple}; border-radius:12px; padding:12px 24px; font-size:14px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .btn-secondary:hover { background:${GB.purple}08; }
  .btn-gold { background:linear-gradient(135deg, ${GB.gold}, ${GB.goldDark}); color:white; border:none; border-radius:12px; padding:14px 28px; font-size:15px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; box-shadow:0 4px 16px ${GB.gold}60; }
  .step-pill { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s; border:1.5px solid transparent; }
  .step-pill.active { background:${GB.purple}; color:white; box-shadow:0 3px 12px ${GB.purple}40; }
  .step-pill.done { background:${GB.success}18; color:${GB.success}; border-color:${GB.success}30; }
  .step-pill.pending { background:white; color:${GB.textLight}; border-color:${GB.border}; }
  .step-pill.locked { background:#f5f5f5; color:#bbb; border-color:#ddd; cursor:not-allowed; opacity:0.6; }
  .role-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700; }
  .pain-face { cursor:pointer; text-align:center; padding:8px; border-radius:10px; border:2px solid transparent; transition:all 0.2s; }
  .pain-face:hover { border-color:${GB.purple}40; background:${GB.purple}05; }
  .pain-face.selected { border-color:${GB.purple}; background:${GB.purple}10; }
  .adl-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
  .adl-col { padding:8px 0; }
  .adl-col-title { font-size:12px; font-weight:700; color:${GB.purple}; margin-bottom:8px; }
  .vulnerability-table { width:100%; border-collapse:collapse; }
  .vulnerability-table th { background:${GB.purple}10; color:${GB.purple}; font-size:11px; font-weight:700; text-transform:uppercase; padding:10px 12px; text-align:left; border:1px solid ${GB.border}; }
  .vulnerability-table td { padding:10px 12px; border:1px solid ${GB.border}; vertical-align:middle; font-size:13px; color:${GB.text}; }
  .family-table { width:100%; border-collapse:collapse; font-size:13px; }
  .family-table th { background:${GB.purple}10; color:${GB.purple}; font-size:11px; font-weight:700; text-transform:uppercase; padding:10px 12px; text-align:left; border:1px solid ${GB.border}; }
  .family-table td { padding:6px 8px; border:1px solid ${GB.border}; }
  .family-table td input { border:none; background:transparent; width:100%; font-size:13px; color:${GB.text}; outline:none; padding:4px 0; }
  .freq-table { border-collapse:collapse; }
  .freq-table th { background:${GB.purple}10; color:${GB.purple}; font-size:11px; font-weight:700; padding:8px 16px; border:1px solid ${GB.border}; text-align:center; }
  .freq-table td { padding:8px 16px; border:1px solid ${GB.border}; text-align:center; font-size:13px; }
  .symptoms-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 20px; }
  .toast { position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:${GB.success}; color:white; padding:14px 28px; border-radius:40px; font-size:14px; font-weight:600; z-index:1000; box-shadow:0 8px 32px rgba(0,0,0,0.2); animation: fadeInUp 0.3s ease; }
  @keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  .record-card { background:white; border-radius:14px; border:1px solid ${GB.border}; padding:16px 20px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:all 0.2s; }
  .record-card:hover { border-color:${GB.purple}; box-shadow:0 4px 16px ${GB.purple}15; transform:translateY(-1px); }
  @media print {
    .no-print { display:none !important; }
    body { background:white; }
    .section-card { border:1px solid #ddd; break-inside:avoid; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => `GB-${Date.now().toString(36).toUpperCase()}`;
const today = () => new Date().toISOString().split("T")[0];
const STORAGE_KEY = "gb_patients_v1";
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } };
const save = (d) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} };

// ─── Empty Form ───────────────────────────────────────────────────────────────
const emptyForm = () => ({
  gbUid: uid(),
  // Page 1 - Enrollment
  enrollDate: today(),
  dateOfDiagnosis: "",
  diagnosis: "",
  // Child Patient Details
  childName: "", childAge: "", childSex: "", childDOB: "", childEducation: "",
  childHNo: "", childBloodGroup: "", childIdProof: "", childLanguage: "",
  // Caregiver
  cgName: "", cgAge: "", cgSex: "", cgReligion: "", cgRelationship: "", cgLanguage: "",
  cgPhone1: "", cgPhone2: "",
  residenceAddress: "",
  // Bank
  bankName: "", bankAccountName: "", bankBranch: "", bankAccountNo: "", bankIFSC: "",
  // Page 2 - Family members (table rows)
  familyMembers: [{ name:"",relationship:"",ageSex:"",occupationEdu:"",monthlyIncome:"" },
                  { name:"",relationship:"",ageSex:"",occupationEdu:"",monthlyIncome:"" },
                  { name:"",relationship:"",ageSex:"",occupationEdu:"",monthlyIncome:"" },
                  { name:"",relationship:"",ageSex:"",occupationEdu:"",monthlyIncome:"" }],
  // Illness details
  hospitalName: "", illnessDiagnosis: "", prognosis: "", treatmentPlan: "",
  currentMedication: "", allergies: "",
  // Referral source
  referralSource: "",
  referralSourceName: "",
  // Treating doctor
  treatingDoctor: "", department: "", inchargePh: "",
  // Page 3 - ADL
  adlSelfCare: { brushing:false, toileting:false, bathing:false, dressingUpper:false, dressingLower:false, eating:false },
  adlSphincterControl: { bladder:false, bowel:false },
  adlTransfers: { bedChairWheelchair:false, toilet:false },
  adlLocomotion: { walkWheelchair:false, stairs:false },
  adlCommunication: { understanding:false, expression:false },
  adlSocialCognition: { socialInteraction:false, problemSolving:false, memory:false },
  adlLevel: { completeIndependence:false, minimalAssistance:false, totalAssistance:false, supervision:false, maximalAssistance:false },
  adlRemarks: "",
  // Page 4 - Problem ID & Goals
  problemIdentification: "",
  goalsOfCare: "",
  referredTo: { doctor:false, nurse:false, psychologist:false, socialWorker:false, other:"" },
  // Page 5 - Medical/Nursing Record
  mainSymptoms: { nausea:false, vomiting:false, ulcer:false, heartburn:false, constipation:false, cough:false,
    soreMouth:false, swelling:false, tiredness:false, bleeding:false, lymphoedema:false, urinarySymptoms:false,
    delirium:false, breathlessness:false, swallowingDifficulty:false, sleeplessness:false, drowsiness:false, weightLoss:false },
  symptomsOther: "",
  painScore: "",
  // Page 6 - History Collection
  diseaseType: "",
  historyOfPresentIllness: "", pastMedicalHistory: "", pastSurgicalHistory: "", familyMedicalHistory: "",
  // Page 7 - Vitals
  pulse: "", bp: "", rr: "", temp: "", grbs: "", timeSinceMeal: "",
  bodyWeight: "", bodyWeightCategory: "",
  generalExam: "", // pupil, pallor etc
  oralCavity: "", skin: "",
  cvs: "", ns: "", rs: "", abdomen: "", musculoskeletal: "", othersExam: "",
  investigations: "", chemotherapy: "", presentMedication: "",
  // Page 8 - Nursing care plan
  nursingCarePlan: "", doctorNotes: "", referralIfRequired: "",
  freqOfCare: { low:"", medium:"", intense:"" },
  nursingName: "", nursingSign: "",
  // Page 9 - Socio-Economic
  accommodation: "", location: "",
  houseRentFreq: "", houseRentAmount: "",
  primaryBreadwinner: "",
  income: "", rationCard: "", rationCardColor: "",
  entitledReimbursement: "",
  debtsAmount: "", debtsPurpose: "",
  pensionPatient: "", pensionFamily: "",
  informationGivenBy: "",
  otherOrgSupport: "", otherOrgSupportYN: "",
  employmentLost: "", employmentLostYN: "",
  childDropout: "", childDropoutYN: "",
  illnessNeglected: "", illnessNeglectedYN: "",
  socioEconCategory: "",
  // Page 10 - Psychosocial
  genogramNotes: "",
  // Page 11 - Family & Social Assessment
  patientAwareDiagnosis: "",
  caregiverAwareDiagnosis: "",
  vulnerabilityPhysical: { mild:"", moderate:"", severe:"", remarks:"" },
  vulnerabilityPsychological: { mild:"", moderate:"", severe:"", remarks:"" },
  vulnerabilitySocial: { mild:"", moderate:"", severe:"", remarks:"" },
  vulnerabilityEconomic: { mild:"", moderate:"", severe:"", remarks:"" },
  // Page 12 - Mental Status
  caregiverMentalStatus: "", additionalInfo: "", referralWithReasons: "",
  swName: "", swSign: "",
});

// ─── STEPS ───────────────────────────────────────────────────────────────────
const STEPS = [
  { id:0, icon:"📋", label:"Enrollment" },
  { id:1, icon:"👨‍👩‍👧", label:"Family" },
  { id:2, icon:"🏥", label:"Illness" },
  { id:3, icon:"♿", label:"ADL" },
  { id:4, icon:"🎯", label:"Care Plan" },
  { id:5, icon:"💊", label:"Medical" },
  { id:6, icon:"📜", label:"History" },
  { id:7, icon:"🩺", label:"Vitals" },
  { id:8, icon:"🏠", label:"Socio-Eco" },
  { id:9, icon:"🧠", label:"Psychosocial" },
  { id:10, icon:"✅", label:"Assessment" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange, label }) => (
  <div className="cb-row" onClick={onChange}>
    <div className={`cb-box ${checked ? "checked" : ""}`} />
    <span style={{ fontSize:13, color: checked ? GB.purple : GB.textMid }}>{label}</span>
  </div>
);

const Radio = ({ checked, onChange, label }) => (
  <div className="radio-row" onClick={onChange}>
    <div className={`radio-dot ${checked ? "checked" : ""}`} />
    <span style={{ fontSize:13, color: checked ? GB.purple : GB.textMid }}>{label}</span>
  </div>
);

const Field = ({ label, value, onChange, type="text", placeholder="", rows, options, span2, span3 }) => (
  <div className="field-group" style={ span2 ? {gridColumn:"span 2"} : span3 ? {gridColumn:"span 3"} : {}}>
    <label className="field-label">{label}</label>
    {options ? (
      <select className="field-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : rows ? (
      <textarea className="field-textarea" rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input className="field-input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

const SectionCard = ({ icon, title, children }) => (
  <div className="section-card">
    <div className="section-header">
      <span style={{ fontSize:20 }}>{icon}</span>
      <span className="section-title">{title}</span>
    </div>
    <div className="section-body">{children}</div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function GBApp() {
  const [currentRole, setCurrentRole] = useState(null);
  const [view, setView] = useState(currentRole ? "home" : "roleSelect"); // roleSelect | home | form | records | viewRecord
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState(load());
  const [toast, setToast] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Role-based access checks
  const canEditStep = (stepId) => {
    if (!currentRole) return false;
    return ROLE_CONFIG[currentRole].canEditSteps.includes(stepId);
  };

  const canViewStep = (stepId) => {
    if (!currentRole) return false;
    return ROLE_CONFIG[currentRole].canEditSteps.includes(stepId);
  };

  const upd = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const updNested = (parent, field, val) => setForm(f => ({ ...f, [parent]: { ...f[parent], [field]: val } }));
  const updFamilyMember = (i, field, val) => {
    const fm = [...form.familyMembers];
    fm[i] = { ...fm[i], [field]: val };
    upd("familyMembers", fm);
  };

  const markStepDone = () => {
    if (!completedSteps.includes(step)) setCompletedSteps(s => [...s, step]);
  };

  const nextStep = () => {
    markStepDone();
    // Find next accessible step
    for (let i = step + 1; i < STEPS.length; i++) {
      if (canViewStep(i)) {
        setStep(i);
        return;
      }
    }
  };

  const prevStep = () => {
    // Find previous accessible step
    for (let i = step - 1; i >= 0; i--) {
      if (canViewStep(i)) {
        setStep(i);
        return;
      }
    }
  };

  const handleSave = () => {
    markStepDone();
    const rec = { ...form, savedAt: new Date().toLocaleString("en-IN") };
    const updated = [...records.filter(r => r.gbUid !== rec.gbUid), rec];
    setRecords(updated);
    save(updated);
    showToast("✓ Record saved successfully!");
  };

  const handleFinalSubmit = () => {
    handleSave();
    showToast("✓ Patient record submitted!");
    setTimeout(() => { setView("home"); }, 1500);
  };

  const startNew = () => { setForm(emptyForm()); setStep(0); setCompletedSteps([]); setView("form"); };

  const exportCSV = () => {
    const cols = ["GB UID","Child Name","Age","Diagnosis","Caregiver","Phone","Date"];
    const rows = records.map(r => [r.gbUid, r.childName, r.childAge, r.illnessDiagnosis, r.cgName, r.cgPhone1, r.savedAt]);
    const csv = [cols, ...rows].map(r => r.map(c => `"${c||""}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `GB_Records_${today()}.csv`;
    a.click();
  };

  // ── ROLE SELECT ────────────────────────────────────────────────────────────
  if (view === "roleSelect") return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${GB.purpleDark} 0%, ${GB.purple} 40%, ${GB.gold}40 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${GB.gold}30, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)`, pointerEvents:"none" }} />

      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 48px rgba(0,0,0,0.25)",
        padding: "44px 36px 40px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
          <svg width="90" height="82" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M115 90 C130 30, 210 10, 200 80 C195 115, 155 120, 115 90Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M105 90 C90 30, 10 10, 20 80 C25 115, 65 120, 105 90Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M115 100 C145 110, 185 150, 170 175 C155 198, 120 180, 110 155Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M105 100 C75 110, 35 150, 50 175 C65 198, 100 180, 110 155Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <ellipse cx="110" cy="122" rx="10" ry="38" fill="#5C2D7A"/>
            <circle cx="110" cy="80" r="11" fill="#5C2D7A"/>
            <path d="M105 72 C95 52, 80 44, 75 37" stroke="#5C2D7A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="74" cy="35" r="4" fill="#5C2D7A"/>
            <path d="M115 72 C125 52, 140 44, 145 37" stroke="#5C2D7A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="146" cy="35" r="4" fill="#5C2D7A"/>
          </svg>
        </div>

        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:"white", marginBottom:8 }}>
          Golden Butterflies
        </div>
        <div style={{ fontSize:11, color:GB.goldLight, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:20 }}>
          Patient Intake System
        </div>

        <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", margin:"24px 0" }} />

        <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)", marginBottom:20, fontWeight:600 }}>
          Select Your Role
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {Object.entries(ROLE_CONFIG).map(([roleKey, config]) => (
            <button key={roleKey} onClick={() => { setCurrentRole(roleKey); setView("home"); }} style={{
              width:"100%", background:"rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.25)",
              borderRadius:14, padding:"16px 20px", cursor:"pointer", transition:"all 0.2s",
              display:"flex", alignItems:"center", gap:14, textAlign:"left",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.borderColor = config.color; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}>
              <div style={{ fontSize:32 }}>{config.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:700, color:"white", marginBottom:2 }}>{config.label}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>{config.desc}</div>
              </div>
              <div style={{ fontSize:20, color:"rgba(255,255,255,0.4)" }}>→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── HOME SCREEN ────────────────────────────────────────────────────────────
  if (view === "home") return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${GB.purpleDark} 0%, ${GB.purple} 40%, ${GB.gold}40 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative orbs */}
      <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${GB.gold}30, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:`radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"35%", left:-50, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${GB.gold}18, transparent 70%)`, pointerEvents:"none" }} />

      {/* Faint butterfly watermarks */}
      {[{t:6,l:8,s:20,o:0.12},{t:18,l:82,s:14,o:0.09},{t:72,l:4,s:16,o:0.1},{t:84,l:86,s:18,o:0.11},{t:48,l:91,s:12,o:0.09},{t:90,l:42,s:15,o:0.1}].map((b,i)=>(
        <div key={i} style={{ position:"absolute", top:`${b.t}%`, left:`${b.l}%`, fontSize:b.s, opacity:b.o, pointerEvents:"none", transform:"rotate(-15deg)", userSelect:"none" }}>🦋</div>
      ))}

      {/* Main card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        borderRadius: 28,
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
        padding: "44px 36px 40px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Gold top accent line */}
        <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:3, background:`linear-gradient(90deg, transparent, ${GB.goldLight}, ${GB.gold}, ${GB.goldLight}, transparent)`, borderRadius:"0 0 3px 3px" }} />

        {/* GB Logo SVG */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
          <svg width="100" height="92" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M115 90 C130 30, 210 10, 200 80 C195 115, 155 120, 115 90Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M105 90 C90 30, 10 10, 20 80 C25 115, 65 120, 105 90Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M115 100 C145 110, 185 150, 170 175 C155 198, 120 180, 110 155Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M105 100 C75 110, 35 150, 50 175 C65 198, 100 180, 110 155Z" fill="#F5A623" stroke="#5C2D7A" strokeWidth="6" strokeLinejoin="round"/>
            <ellipse cx="110" cy="122" rx="10" ry="38" fill="#5C2D7A"/>
            <circle cx="110" cy="80" r="11" fill="#5C2D7A"/>
            <path d="M105 72 C95 52, 80 44, 75 37" stroke="#5C2D7A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="74" cy="35" r="4" fill="#5C2D7A"/>
            <path d="M115 72 C125 52, 140 44, 145 37" stroke="#5C2D7A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="146" cy="35" r="4" fill="#5C2D7A"/>
            <path d="M125 84 C142 68, 172 63, 177 78" stroke="#5C2D7A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
            <path d="M95 84 C78 68, 48 63, 43 78" stroke="#5C2D7A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:"white", letterSpacing:"-0.3px", lineHeight:1.1, textShadow:"0 2px 16px rgba(0,0,0,0.3)" }}>
          Golden Butterflies
        </div>
        <div style={{ fontSize:11, color:GB.goldLight, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", marginTop:7 }}>
          Children's Palliative Care Foundation
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:"rgba(255,255,255,0.65)", marginTop:5, fontStyle:"italic" }}>
          — Lil Lives Matter —
        </div>

        {/* Role Badge */}
        {currentRole && (
          <div className="role-badge" style={{
            background: `${ROLE_CONFIG[currentRole].color}30`,
            color: "white",
            border: `1.5px solid ${ROLE_CONFIG[currentRole].color}60`,
            margin: "14px auto 0",
            width: "fit-content",
          }}>
            <span>{ROLE_CONFIG[currentRole].icon}</span>
            <span>{ROLE_CONFIG[currentRole].label}</span>
          </div>
        )}

        {/* Divider */}
        <div style={{ height:1, background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", margin:"28px 0 24px" }} />

        {/* Buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <button className="btn-gold" onClick={startNew} style={{ width:"100%", fontSize:15, padding:"17px 24px", letterSpacing:"0.3px" }}>
            ✦ &nbsp; New Patient Record
          </button>
          <button onClick={() => setView("records")} style={{
            width:"100%", background:"rgba(255,255,255,0.12)", color:"white",
            border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:12,
            padding:"15px 24px", fontSize:15, fontWeight:600,
            cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <span>📁</span>
            <span>View Records</span>
            {records.length > 0 && <span style={{ background:GB.gold, color:"white", borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:700 }}>{records.length}</span>}
          </button>
          {records.length > 0 && (
            <button onClick={exportCSV} style={{
              width:"100%", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:12,
              padding:"12px 24px", fontSize:13, fontWeight:600,
              cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
            }}>
              ⬇ &nbsp; Export All Records as CSV
            </button>
          )}
          <button onClick={() => { setCurrentRole(null); setView("roleSelect"); }} style={{
            width:"100%", background:"transparent", color:"rgba(255,255,255,0.5)",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:12,
            padding:"11px 24px", fontSize:13, fontWeight:600,
            cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
          }}>
            ← Switch Role
          </button>
        </div>

        <div style={{ marginTop:22, fontSize:11, color:"rgba(255,255,255,0.35)" }}>
          🔒 All data stored locally on this device
        </div>
      </div>

      <div style={{ marginTop:24, fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", zIndex:1 }}>
        Digitising care, one record at a time
      </div>
    </div>
  );

  // ── RECORDS LIST ───────────────────────────────────────────────────────────
  if (view === "records") return (
    <div style={{ minHeight:"100vh", background:GB.warmGray, padding:20 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:GB.purple }}>Patient Records</div>
            <div style={{ fontSize:13, color:GB.textLight }}>{records.length} registered patients</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {records.length > 0 && <button className="btn-secondary" onClick={exportCSV} style={{ padding:"10px 16px", fontSize:13 }}>⬇ CSV</button>}
            <button className="btn-secondary" onClick={() => setView("home")} style={{ padding:"10px 16px" }}>← Home</button>
          </div>
        </div>
        {records.length === 0 ? (
          <div style={{ textAlign:"center", padding:60, color:GB.textLight }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🦋</div>
            No records yet. Enroll your first patient.
          </div>
        ) : (
          records.map(r => (
            <div key={r.gbUid} className="record-card" onClick={() => { setSelectedRecord(r); setView("viewRecord"); }}>
              <div>
                <div style={{ fontWeight:700, color:GB.text, fontSize:15 }}>{r.childName || "Unnamed Patient"}</div>
                <div style={{ fontSize:12, color:GB.textLight, marginTop:3 }}>
                  {r.gbUid} &nbsp;•&nbsp; {r.illnessDiagnosis || "No diagnosis"} &nbsp;•&nbsp; {r.childAge ? r.childAge+" yrs" : "Age N/A"}
                </div>
                <div style={{ fontSize:11, color:GB.textLight, marginTop:2 }}>{r.savedAt}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                {r.illnessDiagnosis && <span style={{ background:GB.purple+"15", color:GB.purple, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>
                  {r.prognosis || "No prognosis"}
                </span>}
                <span style={{ fontSize:12, color:GB.purple }}>→</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ── VIEW RECORD ────────────────────────────────────────────────────────────
  if (view === "viewRecord" && selectedRecord) {
    const r = selectedRecord;
    return (
      <div style={{ minHeight:"100vh", background:GB.warmGray, padding:20 }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:10, marginBottom:20 }} className="no-print">
            <button className="btn-secondary" onClick={() => setView("records")} style={{ padding:"10px 16px" }}>← Back</button>
            <button className="btn-secondary" onClick={() => { setForm(r); setCompletedSteps([...Array(STEPS.length).keys()]); setStep(0); setView("form"); }} style={{ padding:"10px 16px" }}>✏️ Edit</button>
            <button className="btn-secondary" onClick={() => window.print()} style={{ padding:"10px 16px" }}>🖨️ Print</button>
          </div>
          <div style={{ background:"white", borderRadius:16, padding:24, border:`1px solid ${GB.border}`, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:GB.purple }}>{r.childName}</div>
                <div style={{ fontSize:13, color:GB.textLight }}>{r.childAge} yrs • {r.childSex} • {r.childBloodGroup}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:GB.textLight }}>GB UID</div>
                <div style={{ fontSize:16, fontWeight:700, color:GB.gold }}>{r.gbUid}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, fontSize:13 }}>
              {[["Diagnosis", r.illnessDiagnosis], ["Prognosis", r.prognosis], ["Caregiver", r.cgName], ["Relationship", r.cgRelationship], ["Phone", r.cgPhone1], ["Village/Address", r.residenceAddress?.slice(0,40)]].map(([k,v]) => v ? (
                <div key={k}><div style={{ fontSize:10, color:GB.textLight, textTransform:"uppercase", letterSpacing:"0.5px" }}>{k}</div><div style={{ fontWeight:600, color:GB.text }}>{v}</div></div>
              ) : null)}
            </div>
          </div>
          <div style={{ fontSize:11, color:GB.textLight, textAlign:"center", fontStyle:"italic" }}>Saved: {r.savedAt}</div>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  const stepStatus = (i) => completedSteps.includes(i) ? "done" : i === step ? "active" : "pending";

  return (
    <div style={{ minHeight:"100vh", background:GB.warmGray }}>
      {/* Header */}
      <div className="no-print" style={{ background:`linear-gradient(135deg, ${GB.purpleDark}, ${GB.purple})`, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100, boxShadow:`0 4px 20px ${GB.purpleDark}60` }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:26 }}>🦋</span>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:"white" }}>Golden Butterflies</div>
            <div style={{ fontSize:10, color:GB.goldLight, letterSpacing:"1px" }}>PATIENT INTAKE</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          {currentRole && (
            <div className="role-badge" style={{
              background: `${ROLE_CONFIG[currentRole].color}35`,
              color: "white",
              border: `1.5px solid ${ROLE_CONFIG[currentRole].color}`,
              fontSize: 11,
            }}>
              <span>{ROLE_CONFIG[currentRole].icon}</span>
              <span>{ROLE_CONFIG[currentRole].label}</span>
            </div>
          )}
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>GB UID</div>
            <div style={{ fontSize:13, fontWeight:700, color:GB.goldLight }}>{form.gbUid}</div>
          </div>
          <button onClick={() => setView("home")} className="btn-secondary no-print" style={{ padding:"8px 14px", fontSize:12, background:"rgba(255,255,255,0.1)", borderColor:"rgba(255,255,255,0.25)", color:"white" }}>✕</button>
        </div>
      </div>

      {/* Step Nav */}
      <div className="no-print" style={{ background:"white", borderBottom:`1px solid ${GB.border}`, padding:"12px 16px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:8, minWidth:"max-content" }}>
          {STEPS.map(s => (
            <div key={s.id} className={`step-pill ${stepStatus(s.id)}`} onClick={() => setStep(s.id)}>
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {completedSteps.includes(s.id) && <span style={{ fontSize:10 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth:760, margin:"0 auto", padding:"20px 16px 100px" }}>

        {/* STEP 0: ENROLLMENT */}
        {step === 0 && <>
          <SectionCard icon="🦋" title="Patient Enrollment Form">
            <div className="grid-2">
              <Field label="Date of Diagnosis" value={form.dateOfDiagnosis} onChange={v=>upd("dateOfDiagnosis",v)} type="date" />
              <Field label="Enrollment Date" value={form.enrollDate} onChange={v=>upd("enrollDate",v)} type="date" />
            </div>
            <Field label="Diagnosis" value={form.diagnosis} onChange={v=>upd("diagnosis",v)} placeholder="Primary diagnosis" span2 />
          </SectionCard>

          <SectionCard icon="🧒" title="Child-Patient Details">
            <div className="grid-2">
              <Field label="Name" value={form.childName} onChange={v=>upd("childName",v)} placeholder="Full name in capitals" />
              <div className="field-group">
                <label className="field-label">Age & Sex</label>
                <div style={{ display:"flex", gap:8 }}>
                  <input className="field-input" style={{ width:80 }} type="number" value={form.childAge} onChange={e=>upd("childAge",e.target.value)} placeholder="Age" />
                  <select className="field-select" style={{ flex:1 }} value={form.childSex} onChange={e=>upd("childSex",e.target.value)}>
                    <option value="">Sex</option>
                    <option value="M">M</option><option value="F">F</option>
                  </select>
                </div>
              </div>
              <Field label="Date of Birth" value={form.childDOB} onChange={v=>upd("childDOB",v)} type="date" />
              <Field label="Education" value={form.childEducation} onChange={v=>upd("childEducation",v)} placeholder="Class / School" />
              <Field label="H. No (Hospital Number)" value={form.childHNo} onChange={v=>upd("childHNo",v)} />
              <Field label="Blood Group" value={form.childBloodGroup} onChange={v=>upd("childBloodGroup",v)} options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} />
              <Field label="ID Proof (Ch/CG)" value={form.childIdProof} onChange={v=>upd("childIdProof",v)} placeholder="Aadhaar / Birth cert." />
              <Field label="Language" value={form.childLanguage} onChange={v=>upd("childLanguage",v)} placeholder="Tamil / Telugu / etc." />
            </div>
          </SectionCard>

          <SectionCard icon="👩" title="Caregiver Details">
            <div className="grid-2">
              <Field label="Caregiver Name" value={form.cgName} onChange={v=>upd("cgName",v)} placeholder="Full name" />
              <div className="field-group">
                <label className="field-label">Age & Sex</label>
                <div style={{ display:"flex", gap:8 }}>
                  <input className="field-input" style={{ width:80 }} type="number" value={form.cgAge} onChange={e=>upd("cgAge",e.target.value)} placeholder="Age" />
                  <select className="field-select" style={{ flex:1 }} value={form.cgSex} onChange={e=>upd("cgSex",e.target.value)}>
                    <option value="">Sex</option>
                    <option value="M">M</option><option value="F">F</option>
                  </select>
                </div>
              </div>
              <Field label="Religion" value={form.cgReligion} onChange={v=>upd("cgReligion",v)} options={["Hindu","Muslim","Christian","Others"]} />
              <Field label="Relationship to Child" value={form.cgRelationship} onChange={v=>upd("cgRelationship",v)} options={["Mother","Father","Grandparent","Sibling","Guardian","Others"]} />
              <Field label="Language" value={form.cgLanguage} onChange={v=>upd("cgLanguage",v)} />
              <div />
              <Field label="Phone No. 1" value={form.cgPhone1} onChange={v=>upd("cgPhone1",v)} type="tel" placeholder="Primary mobile" />
              <Field label="Phone No. 2" value={form.cgPhone2} onChange={v=>upd("cgPhone2",v)} type="tel" placeholder="Alternate mobile" />
            </div>
            <Field label="Residence Address" value={form.residenceAddress} onChange={v=>upd("residenceAddress",v)} rows={3} placeholder="Full residential address" />
          </SectionCard>

          <SectionCard icon="🏦" title="Bank Details (for financial assistance)">
            <div className="grid-2">
              <Field label="Bank Name" value={form.bankName} onChange={v=>upd("bankName",v)} span2 />
              <Field label="Account Name" value={form.bankAccountName} onChange={v=>upd("bankAccountName",v)} />
              <Field label="Branch Name" value={form.bankBranch} onChange={v=>upd("bankBranch",v)} />
              <Field label="Account No." value={form.bankAccountNo} onChange={v=>upd("bankAccountNo",v)} />
              <Field label="IFSC Code" value={form.bankIFSC} onChange={v=>upd("bankIFSC",v)} />
            </div>
          </SectionCard>
        </>}

        {/* STEP 1: FAMILY */}
        {step === 1 && <>
          <SectionCard icon="👨‍👩‍👧" title="Family Members">
            <div style={{ overflowX:"auto" }}>
              <table className="family-table" style={{ width:"100%", minWidth:600 }}>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name of Family Member</th>
                    <th>Relationship</th>
                    <th>Age/Sex</th>
                    <th>Occupation/Education</th>
                    <th>Monthly Income</th>
                  </tr>
                </thead>
                <tbody>
                  {form.familyMembers.map((m, i) => (
                    <tr key={i}>
                      <td style={{ textAlign:"center", color:GB.textLight }}>{i+1}</td>
                      {["name","relationship","ageSex","occupationEdu","monthlyIncome"].map(f => (
                        <td key={f}><input value={m[f]} onChange={e=>updFamilyMember(i,f,e.target.value)} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-secondary" onClick={() => upd("familyMembers", [...form.familyMembers, { name:"",relationship:"",ageSex:"",occupationEdu:"",monthlyIncome:"" }])}
              style={{ marginTop:12, padding:"8px 16px", fontSize:13 }}>+ Add Row</button>
          </SectionCard>
        </>}

        {/* STEP 2: ILLNESS */}
        {step === 2 && <>
          <SectionCard icon="🏥" title="Details of the Illness">
            <div className="grid-2">
              <Field label="a. Name of the Hospital" value={form.hospitalName} onChange={v=>upd("hospitalName",v)} span2 />
              <Field label="b. Diagnosis" value={form.illnessDiagnosis} onChange={v=>upd("illnessDiagnosis",v)} span2 />
              <div className="field-group">
                <label className="field-label">c. Prognosis</label>
                <div style={{ display:"flex", gap:12, marginTop:4 }}>
                  {["Good","Poor","Bad"].map(p => (
                    <Radio key={p} checked={form.prognosis===p} onChange={()=>upd("prognosis",p)} label={p} />
                  ))}
                </div>
              </div>
              <div />
              <Field label="d. Treatment Plan" value={form.treatmentPlan} onChange={v=>upd("treatmentPlan",v)} rows={2} span2 />
              <Field label="e. Current Medication" value={form.currentMedication} onChange={v=>upd("currentMedication",v)} rows={2} span2 />
              <Field label="f. Allergies" value={form.allergies} onChange={v=>upd("allergies",v)} rows={2} span2 />
            </div>
          </SectionCard>

          <SectionCard icon="📡" title="Referral Source & Treating Doctor">
            <div className="field-group">
              <label className="field-label">Referral Source</label>
              <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:4 }}>
                {["Hospital","Community","NGO"].map(s => (
                  <Radio key={s} checked={form.referralSource===s} onChange={()=>upd("referralSource",s)} label={s} />
                ))}
              </div>
            </div>
            {form.referralSource && (
              <div className="field-group" style={{ marginTop:4 }}>
                <label className="field-label">
                  Name of {form.referralSource}
                </label>
                <input
                  className="field-input"
                  value={form.referralSourceName}
                  onChange={e => upd("referralSourceName", e.target.value)}
                  placeholder={
                    form.referralSource === "Hospital" ? "e.g. Apollo Hospital, Chennai" :
                    form.referralSource === "Community" ? "e.g. Tambaram Community Health Centre" :
                    "e.g. CanKids, Cuddles Foundation"
                  }
                />
              </div>
            )}
            <div className="divider" />
            <div className="grid-2">
              <Field label="Name of Treating Doctor" value={form.treatingDoctor} onChange={v=>upd("treatingDoctor",v)} span2 />
              <Field label="Dept. / Speciality" value={form.department} onChange={v=>upd("department",v)} />
              <Field label="Incharge Phone No." value={form.inchargePh} onChange={v=>upd("inchargePh",v)} type="tel" />
            </div>
          </SectionCard>
        </>}

        {/* STEP 3: ADL */}
        {step === 3 && <>
          <SectionCard icon="♿" title="Activities of Daily Living (ADL)">
            <div className="adl-grid">
              <div className="adl-col">
                <div className="adl-col-title">Self-Care</div>
                {[["brushing","Brushing"],["toileting","Toileting"],["bathing","Bathing"],["dressingUpper","Dressing - Upper"],["dressingLower","Dressing - Lower"],["eating","Eating"]].map(([k,l]) => (
                  <Checkbox key={k} checked={form.adlSelfCare[k]} onChange={()=>updNested("adlSelfCare",k,!form.adlSelfCare[k])} label={l} />
                ))}
              </div>
              <div className="adl-col">
                <div className="adl-col-title">Sphincter Control</div>
                {[["bladder","Bladder"],["bowel","Bowel"]].map(([k,l]) => (
                  <Checkbox key={k} checked={form.adlSphincterControl[k]} onChange={()=>updNested("adlSphincterControl",k,!form.adlSphincterControl[k])} label={l} />
                ))}
                <div className="adl-col-title" style={{ marginTop:16 }}>Locomotion</div>
                {[["walkWheelchair","Walk / Wheelchair"],["stairs","Stairs"]].map(([k,l]) => (
                  <Checkbox key={k} checked={form.adlLocomotion[k]} onChange={()=>updNested("adlLocomotion",k,!form.adlLocomotion[k])} label={l} />
                ))}
                <div className="adl-col-title" style={{ marginTop:16 }}>Social Cognition</div>
                {[["socialInteraction","Social Interaction"],["problemSolving","Problem Solving"],["memory","Memory"]].map(([k,l]) => (
                  <Checkbox key={k} checked={form.adlSocialCognition[k]} onChange={()=>updNested("adlSocialCognition",k,!form.adlSocialCognition[k])} label={l} />
                ))}
              </div>
              <div className="adl-col">
                <div className="adl-col-title">Transfers</div>
                {[["bedChairWheelchair","Bed, Chair, Wheelchair"],["toilet","Toilet"]].map(([k,l]) => (
                  <Checkbox key={k} checked={form.adlTransfers[k]} onChange={()=>updNested("adlTransfers",k,!form.adlTransfers[k])} label={l} />
                ))}
                <div className="adl-col-title" style={{ marginTop:16 }}>Communication</div>
                {[["understanding","Understanding"],["expression","Expression"]].map(([k,l]) => (
                  <Checkbox key={k} checked={form.adlCommunication[k]} onChange={()=>updNested("adlCommunication",k,!form.adlCommunication[k])} label={l} />
                ))}
              </div>
            </div>
            <div className="divider" />
            <div className="sub-section-title">Level of Assistance</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 20px" }}>
              {[["completeIndependence","Complete Independence"],["minimalAssistance","Minimal Assistance"],["totalAssistance","Total Assistance"],["supervision","Supervision"],["maximalAssistance","Maximal Assistance"]].map(([k,l]) => (
                <Checkbox key={k} checked={form.adlLevel[k]} onChange={()=>updNested("adlLevel",k,!form.adlLevel[k])} label={l} />
              ))}
            </div>
            <div className="divider" />
            <Field label="Remarks" value={form.adlRemarks} onChange={v=>upd("adlRemarks",v)} rows={3} />
          </SectionCard>
        </>}

        {/* STEP 4: CARE PLAN */}
        {step === 4 && <>
          <SectionCard icon="🎯" title="Identification of the Problem">
            <p style={{ fontSize:12, color:GB.textLight, marginBottom:12 }}>Physical, Emotional, Social, Spiritual and Financial</p>
            <Field label="Problem Identification" value={form.problemIdentification} onChange={v=>upd("problemIdentification",v)} rows={6} placeholder="Describe identified problems across all domains..." />
          </SectionCard>

          <SectionCard icon="📌" title="Goals of Care / Intervention Plan">
            <Field label="Goals & Intervention Plan" value={form.goalsOfCare} onChange={v=>upd("goalsOfCare",v)} rows={5} placeholder="Outline care goals and planned interventions..." />
          </SectionCard>

          <SectionCard icon="🔀" title="Referred To">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 20px" }}>
              {[["doctor","Doctor"],["nurse","Nurse"],["psychologist","Psychologist"],["socialWorker","Social Worker"]].map(([k,l]) => (
                <Checkbox key={k} checked={form.referredTo[k]} onChange={()=>updNested("referredTo",k,!form.referredTo[k])} label={l} />
              ))}
            </div>
            <div style={{ marginTop:10 }}>
              <label className="field-label">Other (specify)</label>
              <input className="field-input" value={form.referredTo.other} onChange={e=>setForm(f=>({...f, referredTo:{...f.referredTo, other:e.target.value}}))} placeholder="Other referral..." />
            </div>
            <div className="divider" />
            <div style={{ background:GB.purple+"08", border:`1px solid ${GB.border}`, borderRadius:10, padding:16, fontSize:13, color:GB.textMid, lineHeight:1.6 }}>
              <strong style={{ color:GB.purple }}>Disclaimer:</strong> All information collected will be kept confidential in GB. Photograph / Videos are taken for the purpose of training and for our social media. Above content was explained to the caregiver in the language they understand and follow.
            </div>
            <div className="grid-2" style={{ marginTop:16 }}>
              <Field label="Staff Name & Signature" value={form.nursingName} onChange={v=>upd("nursingName",v)} />
              <Field label="Caregiver Signature / Name" value={form.swSign} onChange={v=>upd("swSign",v)} />
            </div>
          </SectionCard>
        </>}

        {/* STEP 5: MEDICAL / NURSING */}
        {step === 5 && <>
          <SectionCard icon="💊" title="Medical / Nursing Record — Main Symptoms">
            <div className="symptoms-grid">
              {[["nausea","Nausea"],["vomiting","Vomiting"],["ulcer","Ulcer"],["heartburn","Heartburn"],["constipation","Constipation"],["cough","Cough"],["soreMouth","Sore Mouth"],["swelling","Swelling"],["tiredness","Tiredness/Fatigue"],["bleeding","Bleeding"],["lymphoedema","Lymphoedema"],["urinarySymptoms","Urinary Symptoms"],["delirium","Delirium"],["breathlessness","Breathlessness"],["swallowingDifficulty","Swallowing Difficulty"],["sleeplessness","Sleeplessness"],["drowsiness","Drowsiness"],["weightLoss","Weight Loss"]].map(([k,l]) => (
                <Checkbox key={k} checked={form.mainSymptoms[k]} onChange={()=>updNested("mainSymptoms",k,!form.mainSymptoms[k])} label={l} />
              ))}
            </div>
            <div className="divider" />
            <Field label="Others (list)" value={form.symptomsOther} onChange={v=>upd("symptomsOther",v)} placeholder="Any other symptoms..." />
          </SectionCard>

          <SectionCard icon="😣" title="Pain Assessment Scale">
            <div style={{ background:GB.warmGray, borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:8 }}>
                {[{emoji:"😊",score:0,label:"No Hurt"},{emoji:"🙁",score:2,label:"Hurts Little Bit"},{emoji:"😟",score:4,label:"Hurts Little More"},{emoji:"😢",score:6,label:"Hurts Even More"},{emoji:"😭",score:8,label:"Hurts Whole Lot"},{emoji:"🤯",score:10,label:"Hurts Worst"}].map(f => (
                  <div key={f.score} className={`pain-face ${form.painScore===String(f.score)?"selected":""}`}
                    onClick={()=>upd("painScore",String(f.score))} style={{ flex:1 }}>
                    <div style={{ fontSize:28 }}>{f.emoji}</div>
                    <div style={{ fontSize:18, fontWeight:700, color: form.painScore===String(f.score)?GB.purple:GB.text }}>{f.score}</div>
                    <div style={{ fontSize:9, color:GB.textLight, lineHeight:1.2 }}>{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:14, fontWeight:600, color:GB.text }}>Pain Score:</span>
              <div style={{ background:GB.purple, color:"white", borderRadius:8, padding:"6px 16px", fontWeight:700, fontSize:18 }}>
                {form.painScore || "—"} / 10
              </div>
              <span style={{ fontSize:12, color:GB.textLight }}>Faces and NRS Scale</span>
            </div>
          </SectionCard>

          <SectionCard icon="📝" title="Nursing Care Plan">
            <Field label="Nursing Care Plan" value={form.nursingCarePlan} onChange={v=>upd("nursingCarePlan",v)} rows={5} />
            <div className="divider" />
            <Field label="Doctor Notes" value={form.doctorNotes} onChange={v=>upd("doctorNotes",v)} rows={4} />
            <div className="divider" />
            <Field label="Referral (if required)" value={form.referralIfRequired} onChange={v=>upd("referralIfRequired",v)} rows={2} />
            <div className="divider" />
            <div className="sub-section-title">Frequency of Care</div>
            <table className="freq-table">
              <thead><tr><th>Frequency</th><th>Details</th></tr></thead>
              <tbody>
                {[["low","Low"],["medium","Medium"],["intense","Intense"]].map(([k,l]) => (
                  <tr key={k}>
                    <td style={{ fontWeight:600, color:GB.text }}>{l}</td>
                    <td><input className="field-input" style={{ border:"none", background:"transparent", width:"100%" }} value={form.freqOfCare[k]} onChange={e=>setForm(f=>({...f, freqOfCare:{...f.freqOfCare,[k]:e.target.value}}))} placeholder="Details..." /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </>}

        {/* STEP 6: HISTORY */}
        {step === 6 && <>
          <SectionCard icon="📜" title="History Collection">
            <div className="field-group">
              <label className="field-label">Disease Type</label>
              <div style={{ display:"flex", gap:20, marginTop:4 }}>
                <Radio checked={form.diseaseType==="Malignant"} onChange={()=>upd("diseaseType","Malignant")} label="Malignant" />
                <Radio checked={form.diseaseType==="Non Malignant"} onChange={()=>upd("diseaseType","Non Malignant")} label="Non Malignant" />
              </div>
            </div>
            <div className="divider" />
            <Field label="History of Present Illness" value={form.historyOfPresentIllness} onChange={v=>upd("historyOfPresentIllness",v)} rows={5} placeholder="Detailed history of present illness..." />
            <Field label="Past Medical History" value={form.pastMedicalHistory} onChange={v=>upd("pastMedicalHistory",v)} rows={4} placeholder="Previous medical conditions, hospitalisations..." />
            <Field label="Past Surgical History" value={form.pastSurgicalHistory} onChange={v=>upd("pastSurgicalHistory",v)} rows={4} placeholder="Previous surgeries and dates..." />
            <Field label="Family Medical History" value={form.familyMedicalHistory} onChange={v=>upd("familyMedicalHistory",v)} rows={4} placeholder="Relevant family medical history..." />
          </SectionCard>
        </>}

        {/* STEP 7: VITALS */}
        {step === 7 && <>
          <SectionCard icon="🩺" title="Vitals">
            <div className="grid-3">
              <Field label="Pulse (/min)" value={form.pulse} onChange={v=>upd("pulse",v)} type="number" placeholder="72" />
              <Field label="BP (mmHg)" value={form.bp} onChange={v=>upd("bp",v)} placeholder="120/80" />
              <Field label="RR (/min)" value={form.rr} onChange={v=>upd("rr",v)} type="number" placeholder="18" />
              <Field label="Temperature" value={form.temp} onChange={v=>upd("temp",v)} placeholder="98.6°F" />
              <Field label="GRBS (mg/dL)" value={form.grbs} onChange={v=>upd("grbs",v)} type="number" />
              <Field label="Time since meal (hrs)" value={form.timeSinceMeal} onChange={v=>upd("timeSinceMeal",v)} type="number" />
            </div>
          </SectionCard>

          <SectionCard icon="👁️" title="General Examination">
            <div className="grid-2">
              <Field label="Body Weight" value={form.bodyWeight} onChange={v=>upd("bodyWeight",v)} placeholder="kg" />
              <Field label="Body Weight Category" value={form.bodyWeightCategory} onChange={v=>upd("bodyWeightCategory",v)} options={["Obese","Average","Emaciated"]} />
            </div>
            <div className="sub-section-title" style={{ marginTop:8 }}>General Findings</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:14 }}>
              {["Pallor","Jaundice","Clubbing","Cyanosis","LNE","Oedema"].map(item => {
                const checked = (form.generalExam||"").includes(item);
                return <div key={item} className="cb-row" onClick={()=>{
                  const current = form.generalExam ? form.generalExam.split(",").map(s=>s.trim()).filter(Boolean) : [];
                  const updated = checked ? current.filter(c=>c!==item) : [...current, item];
                  upd("generalExam", updated.join(", "));
                }}>
                  <div className={`cb-box ${checked?"checked":""}`} />
                  <span style={{ fontSize:13 }}>{item}</span>
                </div>;
              })}
            </div>
            <div className="grid-2">
              <Field label="Oral Cavity" value={form.oralCavity} onChange={v=>upd("oralCavity",v)} rows={2} />
              <Field label="Skin" value={form.skin} onChange={v=>upd("skin",v)} rows={2} />
            </div>
          </SectionCard>

          <SectionCard icon="🔬" title="Systematic Examination">
            <div className="grid-2">
              <Field label="CVS" value={form.cvs} onChange={v=>upd("cvs",v)} rows={2} />
              <Field label="NS" value={form.ns} onChange={v=>upd("ns",v)} rows={2} />
              <Field label="RS" value={form.rs} onChange={v=>upd("rs",v)} rows={2} />
              <Field label="Abdomen" value={form.abdomen} onChange={v=>upd("abdomen",v)} rows={2} />
              <Field label="Musculoskeletal" value={form.musculoskeletal} onChange={v=>upd("musculoskeletal",v)} rows={2} />
              <Field label="Others" value={form.othersExam} onChange={v=>upd("othersExam",v)} rows={2} />
            </div>
            <div className="divider" />
            <Field label="Relevant Investigations (with date)" value={form.investigations} onChange={v=>upd("investigations",v)} rows={3} />
            <Field label="Chemotherapy / Radiation / Surgery / Others" value={form.chemotherapy} onChange={v=>upd("chemotherapy",v)} rows={3} />
            <Field label="Present Medication (generic names)" value={form.presentMedication} onChange={v=>upd("presentMedication",v)} rows={3} />
          </SectionCard>
        </>}

        {/* STEP 8: SOCIO-ECONOMIC */}
        {step === 8 && <>
          <SectionCard icon="🏠" title="Socio-Economic Assessment">
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* 1. Accommodation */}
              <div>
                <label className="field-label">1. Accommodation</label>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:4 }}>
                  {["Own House","Rented","Employer's Quarters","Relatives House","Others"].map(o => (
                    <Radio key={o} checked={form.accommodation===o} onChange={()=>upd("accommodation",o)} label={o} />
                  ))}
                </div>
              </div>
              {/* 2. Location */}
              <div>
                <label className="field-label">2. Location</label>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:4 }}>
                  {["Corporation","Municipality","Panchayat"].map(o => (
                    <Radio key={o} checked={form.location===o} onChange={()=>upd("location",o)} label={o} />
                  ))}
                </div>
              </div>
              {/* 3. House details */}
              <div className="grid-2">
                <div>
                  <label className="field-label">3. Details of House (Rent Frequency)</label>
                  <div style={{ display:"flex", gap:14, marginTop:4 }}>
                    {["Yearly","Monthly"].map(o => <Radio key={o} checked={form.houseRentFreq===o} onChange={()=>upd("houseRentFreq",o)} label={o} />)}
                  </div>
                </div>
                <Field label="Rent Amount (₹)" value={form.houseRentAmount} onChange={v=>upd("houseRentAmount",v)} type="number" />
              </div>
              <Field label="4. Primary Breadwinner of the Family" value={form.primaryBreadwinner} onChange={v=>upd("primaryBreadwinner",v)} />
              {/* 5. Income */}
              <div className="grid-3">
                <Field label="5. Income (₹/month)" value={form.income} onChange={v=>upd("income",v)} />
                <div>
                  <label className="field-label">Ration Card</label>
                  <div style={{ display:"flex", gap:12, marginTop:4 }}>
                    <Radio checked={form.rationCard==="APL"} onChange={()=>upd("rationCard","APL")} label="APL" />
                    <Radio checked={form.rationCard==="BPL"} onChange={()=>upd("rationCard","BPL")} label="BPL" />
                  </div>
                </div>
                <Field label="Colour of Ration Card" value={form.rationCardColor} onChange={v=>upd("rationCardColor",v)} />
              </div>
              <Field label="6. Entitled for Reimbursement from" value={form.entitledReimbursement} onChange={v=>upd("entitledReimbursement",v)} placeholder="CMCHIS, ESI, ECHS, etc." />
              {/* 7. Debts */}
              <div className="grid-2">
                <Field label="7. Debts Amount (₹)" value={form.debtsAmount} onChange={v=>upd("debtsAmount",v)} />
                <Field label="Purpose of Debt" value={form.debtsPurpose} onChange={v=>upd("debtsPurpose",v)} />
              </div>
              <Field label="8. Pensions Availing (Patient)" value={form.pensionPatient} onChange={v=>upd("pensionPatient",v)} />
              <Field label="9. Pensions Availing (Family Members)" value={form.pensionFamily} onChange={v=>upd("pensionFamily",v)} />
              {/* 10. Information given by */}
              <div>
                <label className="field-label">10. Information Given By</label>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:4 }}>
                  {["Patient","Spouse","Parent","Relative","Daughter/Son","Others"].map(o => (
                    <Radio key={o} checked={form.informationGivenBy===o} onChange={()=>upd("informationGivenBy",o)} label={o} />
                  ))}
                </div>
              </div>
              {/* 11-14 Yes/No questions */}
              {[
                ["11","Receiving any support from another organization?","otherOrgSupportYN","otherOrgSupport"],
                ["12","Is employment of a family member lost or threatened due to illness?","employmentLostYN","employmentLost"],
                ["13","Did any child in the family drop out of school/college due to illness?","childDropoutYN","childDropout"],
                ["14","Did illness of any family member get neglected due to patient's illness?","illnessNeglectedYN","illnessNeglected"],
              ].map(([num, q, ynField, detailField]) => (
                <div key={num}>
                  <label className="field-label">{num}. {q}</label>
                  <div style={{ display:"flex", gap:20, marginTop:4, marginBottom:8 }}>
                    <Radio checked={form[ynField]==="Yes"} onChange={()=>upd(ynField,"Yes")} label="Yes" />
                    <Radio checked={form[ynField]==="No"} onChange={()=>upd(ynField,"No")} label="No" />
                  </div>
                  {form[ynField]==="Yes" && <Field label="Details" value={form[detailField]} onChange={v=>upd(detailField,v)} rows={2} placeholder="State briefly..." />}
                </div>
              ))}
              {/* 15. Category */}
              <div>
                <label className="field-label">15. Socio-Economic Category</label>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:4 }}>
                  {["Very Poor (Not enough to eat)","Poor (Unable to afford medicine)","Middle Income","High Income"].map(o => (
                    <Radio key={o} checked={form.socioEconCategory===o} onChange={()=>upd("socioEconCategory",o)} label={o} />
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </>}

        {/* STEP 9: PSYCHOSOCIAL */}
        {step === 9 && <>
          <SectionCard icon="🧠" title="Psychosocial Aspects — Family Tree / Genogram">
            <p style={{ fontSize:12, color:GB.textLight, marginBottom:12, lineHeight:1.5 }}>
              Include age, occupation and other relevant details including other illnesses in the family. Use standard genogram symbols: □ Male, ○ Female, X Death, /// Illness, ●● Our Patient, △ Pregnancy.
            </p>
            <Field label="Genogram Notes / Descriptions" value={form.genogramNotes} onChange={v=>upd("genogramNotes",v)} rows={6} placeholder="Describe the family tree structure, relationships, and relevant medical history..." />
            <div style={{ background:GB.warmGray, borderRadius:10, padding:14, marginTop:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:GB.purple, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>Genogram Symbol Legend</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, fontSize:12, color:GB.textMid }}>
                {[["□","Male"],["○","Female"],["■-○","Married"],["■⊗○","Separated"],["■⊘○","Divorced"],["⊠","Death"],["///","Illness"],["●","Our Patient"],["△","Pregnancy"],["□∿○","Abuse"],["≈","Physical Abuse"],["∞","Sexual Abuse"]].map(([sym,desc]) => (
                  <div key={desc} style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontFamily:"monospace", fontSize:13, color:GB.purple, minWidth:24 }}>{sym}</span>
                    <span style={{ fontSize:11 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </>}

        {/* STEP 10: FAMILY & SOCIAL ASSESSMENT */}
        {step === 10 && <>
          <SectionCard icon="✅" title="Family & Social Assessment">
            <div className="sub-section-title">Insight into Illness and Prognosis</div>
            <div className="grid-2">
              <div>
                <label className="field-label">Patient aware about diagnosis?</label>
                <div style={{ display:"flex", gap:20, marginTop:4 }}>
                  <Radio checked={form.patientAwareDiagnosis==="Yes"} onChange={()=>upd("patientAwareDiagnosis","Yes")} label="Yes" />
                  <Radio checked={form.patientAwareDiagnosis==="No"} onChange={()=>upd("patientAwareDiagnosis","No")} label="No" />
                </div>
              </div>
              <div>
                <label className="field-label">Caregiver aware about diagnosis?</label>
                <div style={{ display:"flex", gap:20, marginTop:4 }}>
                  <Radio checked={form.caregiverAwareDiagnosis==="Yes"} onChange={()=>upd("caregiverAwareDiagnosis","Yes")} label="Yes" />
                  <Radio checked={form.caregiverAwareDiagnosis==="No"} onChange={()=>upd("caregiverAwareDiagnosis","No")} label="No" />
                </div>
              </div>
            </div>
            <div className="divider" />
            <div className="sub-section-title">Eco Map</div>
            <p style={{ fontSize:12, color:GB.textLight, marginBottom:14, lineHeight:1.5 }}>
              Map the family's relationship with: Hospital, Friend, Neighbour, Social, Temple, Society. Use: solid line = Strong/Positive, dashed = Weak/Tenuous, hatched = Stressful, arrow = Flow of Resources.
            </p>
            <Field label="Eco Map Notes / Relationship Descriptions" value={form.additionalInfo} onChange={v=>upd("additionalInfo",v)} rows={4} placeholder="Describe connections to social systems..." />
            <div className="divider" />
            <div className="sub-section-title">Vulnerability Assessment</div>
            <table className="vulnerability-table">
              <thead>
                <tr><th>Domain</th><th>Mild</th><th>Moderate</th><th>Severe</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {[["Physical","vulnerabilityPhysical"],["Psychological","vulnerabilityPsychological"],["Social","vulnerabilitySocial"],["Economic","vulnerabilityEconomic"]].map(([label, key]) => (
                  <tr key={key}>
                    <td style={{ fontWeight:600, color:GB.purple }}>{label}</td>
                    {["mild","moderate","severe"].map(level => (
                      <td key={level} style={{ textAlign:"center" }}>
                        <div style={{ display:"flex", justifyContent:"center" }}>
                          <div className={`cb-box ${form[key][level]?"checked":""}`}
                            onClick={()=>setForm(f=>({...f,[key]:{...f[key],[level]:!f[key][level]}}))} />
                        </div>
                      </td>
                    ))}
                    <td><input className="field-input" style={{ border:"none", background:"transparent", width:"100%", fontSize:12 }} value={form[key].remarks} onChange={e=>setForm(f=>({...f,[key]:{...f[key],remarks:e.target.value}}))} placeholder="Notes..." /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="divider" />
            <div className="sub-section-title">Mental Status of Caregiver (Observed)</div>
            <Field label="Mental Status Observations" value={form.caregiverMentalStatus} onChange={v=>upd("caregiverMentalStatus",v)} rows={4} placeholder="Observations on caregiver's mental and emotional state..." />
            <div className="divider" />
            <Field label="Referral (along with reasons)" value={form.referralWithReasons} onChange={v=>upd("referralWithReasons",v)} rows={3} />
            <div className="grid-2" style={{ marginTop:16 }}>
              <Field label="Social Worker Name" value={form.swName} onChange={v=>upd("swName",v)} />
              <Field label="Social Worker Sign" value={form.cgPhone2+" "} onChange={v=>{}} placeholder="(sign on printed copy)" />
            </div>
          </SectionCard>
        </>}

        {/* Navigation */}
        <div className="no-print" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:24, gap:12 }}>
          <div style={{ display:"flex", gap:10 }}>
            {step > 0 && <button className="btn-secondary" onClick={prevStep}>← Previous</button>}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-secondary" onClick={handleSave} style={{ fontSize:13, padding:"12px 18px" }}>💾 Save</button>
            {step < STEPS.length - 1 ? (
              <button className="btn-primary" onClick={nextStep}>Next → </button>
            ) : (
              <button className="btn-gold" onClick={handleFinalSubmit}>✓ Submit Record</button>
            )}
          </div>
        </div>
        <div style={{ height:20 }} />
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
