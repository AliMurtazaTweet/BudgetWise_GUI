import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/api";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Database,
  ChevronRight,
  LogOut,
  AlertCircle,
  X,
  CheckCircle2,
  Save,
  Loader2
} from "lucide-react";

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEraseModalOpen, setIsEraseModalOpen] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [eraseSuccess, setEraseSuccess] = useState(false);
  const [modalType, setModalType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for editing
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [preferences, setPreferences] = useState({
    profile: {
      avatarUrl: "/assets/avatars/3d-illustration-human-avatar-profile_23-2150671142.jpg"
    },
    notifications: { email: true, push: false, reports: true },
    security: { twoFactor: false, loginAlerts: true },
    privacy: { dataSharing: false, publicProfile: false }
  });

  const avatars = [
    "/assets/avatars/smiling-young-man-with-glasses_1308-174435.jpg",
    "/assets/avatars/cheerful-girl-cute-yellow-dresses_24877-81517.jpg",
    "/assets/avatars/3d-illustration-human-avatar-profile_23-2150671142.jpg",
    "/assets/avatars/smiling-woman-with-glasses_1308-177543.jpg",
    "/assets/avatars/smiling-redhaired-cartoon-boy_1308-174709.jpg",
    "/assets/avatars/woman-with-braided-hair-illustration_1308-174964.jpg",
    "/assets/avatars/smiling-young-man-illustration_1308-174401.jpg",
    "/assets/avatars/minimalist-social-media-avatar-cute-medical-girl-picture-social-networks-messenger-profile-website-female-doctor-linear-vector-illustration_1002658-4775.jpg",
    "/assets/avatars/smiling-boy-yellow-hoodie_1308-175701.jpg",
    "/assets/avatars/people-avatar-profile-icon-female-face-with-different-face-expressions_1246656-679.jpg",
    "/assets/avatars/young-man-with-glasses-avatar_1308-175763.jpg",
    "/assets/avatars/woman-traditional-costume_1308-175787.jpg"
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Auth guard: redirect to login if no session exists
        const savedUser = localStorage.getItem("bw_user");
        if (!savedUser) {
          router.replace("/login");
          return;
        }
        const userId = JSON.parse(savedUser).id;

        const response = await API.get(`/user?userId=${userId}`);
        if (response.data.status === "success") {
          const userData = response.data.user;
          setUser(userData);
          setEditName(userData.name);
          setEditEmail(userData.email);
          if (userData.preferences) {
            try {
              const savedPrefs = typeof userData.preferences === 'string' 
                ? JSON.parse(userData.preferences)
                : userData.preferences;
              // Deep merge with defaults to avoid "undefined" errors, preserving root keys like monthlyBudget
              setPreferences(prev => ({
                ...prev,
                ...savedPrefs,
                profile: { ...prev.profile, ...savedPrefs.profile },
                notifications: { ...prev.notifications, ...savedPrefs.notifications },
                security: { ...prev.security, ...savedPrefs.security },
                privacy: { ...prev.privacy, ...savedPrefs.privacy }
              }));
            } catch (e) {
              console.error("Failed to parse preferences", e);
            }
          }
        } else {
          setError("Failed to load user profile.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Connection to backend failed.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  const handleLogout = () => {
    router.push("/");
  };

  const handleExport = async () => {
    try {
      const savedUser = localStorage.getItem("bw_user");
      const userId = savedUser ? JSON.parse(savedUser).id : 1;
      const resp = await API.get(`/transactions?userId=${userId}`);
      const allTransactions = resp.data;
      const headers = ["ID", "Date", "Category", "Type", "Amount", "Merchant"];
      const formatCSVDate = (dateString) => {
        try {
          const d = new Date(dateString);
          if (isNaN(d.getTime())) return dateString;
          const yyyy = d.getFullYear();
          const MM = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          let hours = d.getHours();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          const hh = String(hours).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          const ss = String(d.getSeconds()).padStart(2, '0');
          return `${yyyy}-${MM}-${dd} - ${hh}:${mm}:${ss} ${ampm}`;
        } catch {
          return dateString;
        }
      };

      const csvRows = [
        headers.join(","),
        ...allTransactions.map(t => 
          [t.id, `"${formatCSVDate(t.date)}"`, t.category, t.type, t.amount, `"${t.merchant || t.category}"`].join(",")
        )
      ];
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `BudgetWise_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const savedUser = localStorage.getItem("bw_user");
      const userId = savedUser ? JSON.parse(savedUser).id : 1;

      const payload = {
        userId,
        name: editName,
        email: editEmail,
        password: editPassword,
        preferences: JSON.stringify(preferences)
      };
      
      const response = await API.post("/user/update", payload);
      if (response.data.status === "success") {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        setEditPassword("");
        setSaveSuccess(true);

        // 🔑 Update the session in localStorage so the avatar persists on refresh
        const savedSession = localStorage.getItem("bw_user");
        if (savedSession) {
          const sessionUser = JSON.parse(savedSession);
          let avatar = updatedUser.avatar;
          if (!avatar && updatedUser.preferences) {
            try {
              const prefs = typeof updatedUser.preferences === "string"
                ? JSON.parse(updatedUser.preferences)
                : updatedUser.preferences;
              avatar = prefs?.profile?.avatarUrl;
            } catch {}
          }
          localStorage.setItem("bw_user", JSON.stringify({
            ...sessionUser,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: avatar,
            preferences: updatedUser.preferences
          }));
        }

        setTimeout(() => {
          setSaveSuccess(false);
          setIsModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to save changes.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEraseData = async () => {
    setErasing(true);
    try {
      const savedUser = localStorage.getItem("bw_user");
      const userId = savedUser ? JSON.parse(savedUser).id : 1;
      const response = await API.post("/erase-data", { userId });
      if (response.data.status === "success") {
        setEraseSuccess(true);

        // 🔑 Reset local storage user session preferences
        const savedSession = localStorage.getItem("bw_user");
        if (savedSession) {
          const sessionUser = JSON.parse(savedSession);
          localStorage.setItem("bw_user", JSON.stringify({
            ...sessionUser,
            preferences: "{}"
          }));
        }

        // 🔑 Reset React states for settings preferences to default
        setPreferences({
          profile: {
            avatarUrl: "/assets/avatars/3d-illustration-human-avatar-profile_23-2150671142.jpg"
          },
          notifications: { email: true, push: false, reports: true },
          security: { twoFactor: false, loginAlerts: true },
          privacy: { dataSharing: false, publicProfile: false }
        });

        // 🔑 Reset user settings
        setUser(prev => ({
          ...prev,
          preferences: "{}"
        }));

        setTimeout(() => {
          setEraseSuccess(false);
          setIsEraseModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Erase failed:", err);
    } finally {
      setErasing(false);
    }
  };

  const handleItemClick = (label) => {
    if (label === "Data Management") {
      handleExport();
      return;
    }
    if (label === "Erase All Data") {
      setIsEraseModalOpen(true);
      return;
    }
    setModalType(label);
    setIsModalOpen(true);
  };

  const togglePreference = (category, key) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const settingsSections = [
    {
      title: "Account Preferences",
      items: [
        { icon: User, label: "Profile Information", desc: "Update your name and personal details" },
        { icon: Mail, label: "Email Notifications", desc: "Manage your email alerts and reports" },
        { icon: Database, label: "Data Management", desc: "Export your transaction history to CSV" }
      ]
    },
    {
      title: "Security",
      items: [
        { icon: Lock, label: "Password", desc: "Change your account password" },
        { icon: Bell, label: "Two-Factor Auth", desc: "Add an extra layer of security" },
        { icon: AlertCircle, label: "Erase All Data", desc: "Permanently delete all transactions & budgets", danger: true }
      ]
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Settings | BudgetWise</title>
      </Head>
      <DashboardLayout>
        <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Settings</h1>
              <p className="text-sm sm:text-base text-text-secondary mt-1 font-medium opacity-60">Manage your account and encrypted preferences.</p>
            </div>
            {saveSuccess && (
              <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} className="mr-2" />
                <span className="text-xs font-black uppercase tracking-widest">Protocol Sync Success</span>
              </div>
            )}
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
              <p className="font-bold flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </p>
              <p className="text-sm mt-1">Please ensure the C++ backend is running correctly.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-bg-surface p-8 rounded-[2.5rem] border border-border-subtle shadow-xl shadow-text-primary/5 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="w-28 h-28 bg-bg-elevated rounded-[2rem] flex items-center justify-center text-accent-primary text-3xl font-black border-4 border-bg-surface shadow-2xl overflow-hidden group">
                  {preferences?.profile?.avatarUrl ? (
                    <img src={preferences.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase">{user.name}</h2>
                  <p className="text-text-secondary font-bold text-sm mb-5 opacity-60">{user.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <button 
                      onClick={() => router.push("/premium")}
                      className="px-4 py-1.5 bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-accent-primary/20 hover:bg-accent-primary hover:text-bg-main hover:scale-105 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Premium Tier
                    </button>
                    <button 
                      onClick={() => setIsVerificationModalOpen(true)}
                      className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 hover:bg-emerald-500 hover:text-bg-main hover:scale-105 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center"
                    >
                      <Shield size={10} className="mr-1.5 inline" /> Verified
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleItemClick("Edit Profile")}
                  className="px-6 py-3.5 bg-bg-elevated border border-border-subtle rounded-2xl text-xs font-black uppercase tracking-widest text-text-primary hover:bg-text-primary hover:text-bg-main transition-all shadow-sm active:scale-95"
                >
                  Modify Profile
                </button>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {settingsSections.map((section, idx) => (
                  <div key={idx} className="bg-bg-surface rounded-[2.5rem] border border-border-subtle shadow-xl shadow-text-primary/5 overflow-hidden flex flex-col">
                    <div className="px-8 py-5 border-b border-border-subtle bg-bg-elevated/30">
                      <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40">{section.title}</h3>
                    </div>
                    <div className="divide-y divide-border-subtle flex-1">
                      {section.items.map((item, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleItemClick(item.label)}
                          className={`w-full px-8 py-6 flex items-center group transition-all ${
                            item.danger
                              ? "hover:bg-rose-500/5"
                              : "hover:bg-bg-elevated/50"
                          }`}
                        >
                          <div className={`p-3 rounded-2xl mr-5 transition-all transform group-hover:scale-110 shadow-sm border ${
                            item.danger
                              ? "bg-rose-500/10 text-rose-400 opacity-80 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white group-hover:opacity-100"
                              : "bg-bg-elevated text-text-secondary opacity-40 border-border-subtle group-hover:bg-accent-primary group-hover:text-bg-main group-hover:opacity-100"
                          }`}>
                            <item.icon size={20} />
                          </div>
                          <div className="flex-1 text-left">
                            <span className={`block text-sm font-black tracking-tight transition-colors ${
                              item.danger
                                ? "text-rose-500 group-hover:text-rose-600"
                                : "text-text-primary group-hover:text-accent-primary"
                            }`}>{item.label}</span>
                            <span className="block text-[11px] font-bold text-text-secondary mt-0.5 opacity-60">{item.desc}</span>
                          </div>
                          <ChevronRight size={16} className={`opacity-20 transform group-hover:translate-x-1 transition-all ${
                            item.danger ? "text-rose-400 group-hover:text-rose-500" : "text-text-secondary group-hover:text-accent-primary"
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Logout Button */}
              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-8 py-4 bg-rose-500/10 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-xl shadow-rose-500/5 group active:scale-95"
                >
                  <LogOut size={18} className="mr-3 group-hover:translate-x-1 transition-transform" />
                  Terminate Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Universal Settings Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-bg-surface w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col border border-border-subtle">
              <div className="bg-bg-elevated/50 px-8 py-7 flex justify-between items-center border-b border-border-subtle shrink-0">
                <div>
                  <h3 className="text-xl font-extrabold text-text-primary tracking-tight">{modalType}</h3>
                  <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest mt-1 opacity-60">Secure Preference Protocol</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-bg-surface rounded-xl text-text-secondary opacity-40 hover:opacity-100 hover:text-text-primary shadow-sm hover:shadow transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-7 overflow-y-auto flex-1 custom-scrollbar">
                {modalType === "Profile Information" || modalType === "Edit Profile" ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Identity Core / Avatar</label>
                      <div className="my-4 p-6 bg-bg-elevated/50 rounded-3xl border border-border-subtle shadow-inner max-h-56 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                          {avatars.map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setPreferences(p => ({ ...p, profile: { ...p.profile, avatarUrl: url }}))}
                              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all transform active:scale-95 ${preferences?.profile?.avatarUrl === url ? "border-accent-primary ring-4 ring-accent-primary/10 shadow-lg scale-105" : "border-transparent opacity-40 hover:opacity-100 hover:scale-110"}`}
                            >
                              <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Full Legal Name</label>
                      <input 
                        required
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-5 py-4 bg-bg-elevated border-none rounded-2xl focus:ring-4 focus:ring-accent-primary/10 focus:bg-bg-surface text-text-primary font-bold placeholder-text-secondary transition-all outline-none"
                        placeholder="Ali Murtaza"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-text-secondary uppercase tracking-widest ml-1 opacity-60">Communications Endpoint</label>
                      <input 
                        required
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-bg-elevated border-none rounded-2xl focus:ring-4 focus:ring-accent-primary/10 focus:bg-bg-surface text-text-primary font-bold placeholder-text-secondary transition-all outline-none"
                        placeholder="ali@example.com"
                      />
                    </div>
                    <div className="pt-4">
                      <button 
                        disabled={submitting}
                        type="submit"
                        className="group relative overflow-hidden w-full py-4 bg-accent-primary text-bg-main font-black uppercase tracking-widest rounded-2xl hover:bg-opacity-90 shadow-xl shadow-accent-primary/20 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        <span>{submitting ? "Synchronizing..." : "Update Portal"}</span>
                      </button>
                    </div>
                  </form>
                ) : modalType === "Email Notifications" ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900">Transaction Alerts</p>
                        <p className="text-xs text-gray-500">Get notified for every spend</p>
                      </div>
                      <button 
                        onClick={() => togglePreference("notifications", "email")}
                        className={`w-12 h-6 rounded-full transition-colors relative ${preferences?.notifications?.email ? "bg-indigo-600" : "bg-gray-300"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences?.notifications?.email ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900">Monthly Reports</p>
                        <p className="text-xs text-gray-500">Receive summary via email</p>
                      </div>
                      <button 
                        onClick={() => togglePreference("notifications", "reports")}
                        className={`w-12 h-6 rounded-full transition-colors relative ${preferences?.notifications?.reports ? "bg-indigo-600" : "bg-gray-300"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences?.notifications?.reports ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleUpdate()}
                      disabled={submitting}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                      <span>Save Preferences</span>
                    </button>
                  </div>
                ) : modalType === "Password" ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                      <input 
                        required
                        type="password" 
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 bg-white"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="text-xs text-gray-500 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <strong>Tip:</strong> Use at least 8 characters with a mix of letters and numbers.
                    </p>
                    <button 
                      disabled={submitting}
                      type="submit"
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                      <span>Update Password</span>
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
                      <AlertCircle className="mr-4 shrink-0" size={24} />
                      <p className="text-sm font-bold">This advanced {modalType.toLowerCase()} functionality is currently in Beta.</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900">Enable Feature</p>
                        <p className="text-xs text-gray-500">Activate this module for your account</p>
                      </div>
                      <button 
                        onClick={() => togglePreference("security", "twoFactor")}
                        className={`w-12 h-6 rounded-full transition-colors relative ${preferences?.security?.twoFactor ? "bg-indigo-600" : "bg-gray-300"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences?.security?.twoFactor ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleUpdate()}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                    >
                      Got it, Save changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Erase All Data Confirmation Modal */}
        {isEraseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/50 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-rose-500/20">
              <div className="bg-rose-500/5 px-8 py-7 flex justify-between items-center border-b border-rose-500/10">
                <div>
                  <h3 className="text-xl font-extrabold text-rose-500 tracking-tight">Erase All Data</h3>
                  <p className="text-text-secondary font-bold text-[10px] uppercase tracking-widest mt-1 opacity-60">Danger Zone — Irreversible Action</p>
                </div>
                <button 
                  onClick={() => { setIsEraseModalOpen(false); setEraseSuccess(false); }}
                  className="p-2 bg-bg-elevated rounded-xl text-text-secondary opacity-40 hover:opacity-100 hover:text-rose-500 shadow-sm transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {eraseSuccess ? (
                  <div className="flex flex-col items-center text-center py-4 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <p className="font-black text-text-primary uppercase tracking-tight">Data Wiped Successfully</p>
                    <p className="text-[11px] text-text-secondary opacity-60 font-bold">Your account is now at zero.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start p-5 bg-rose-500/8 border border-rose-500/20 rounded-2xl text-rose-500 space-x-4">
                      <AlertCircle className="shrink-0 mt-0.5" size={22} />
                      <div>
                        <p className="text-sm font-black">This will permanently delete all your transactions and budgets.</p>
                        <p className="text-[11px] font-bold opacity-70 mt-1">This action cannot be undone. Your account will be reset to zero.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEraseModalOpen(false)}
                        className="flex-1 py-4 bg-bg-elevated border border-border-subtle text-text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-text-primary hover:text-bg-main transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEraseData}
                        disabled={erasing}
                        className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {erasing ? <Loader2 size={16} className="animate-spin" /> : <AlertCircle size={16} />}
                        {erasing ? "Erasing..." : "Yes, Erase All"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification Modal */}
        {isVerificationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVerificationModalOpen(false)} />
            <div className="relative w-full max-w-sm bg-bg-surface rounded-3xl border border-border-subtle shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
              <button 
                onClick={() => setIsVerificationModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary bg-bg-elevated rounded-xl transition-all"
              >
                <X size={16} />
              </button>
              
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Shield size={32} />
                </div>
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">Account Verified</h3>
                <p className="text-sm font-bold text-text-secondary opacity-80 mb-6">Your identity and financial data are secured with enterprise-grade encryption.</p>
                
                <div className="w-full space-y-3 mb-8">
                  <div className="flex justify-between items-center bg-bg-elevated p-3 rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Identity Match</span>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex justify-between items-center bg-bg-elevated p-3 rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Encryption</span>
                    <span className="text-[10px] font-black tracking-widest text-emerald-500 bg-emerald-500/10 px-2 flex items-center py-1 rounded-md">AES-256</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="w-full py-4 bg-text-primary text-bg-main font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-emerald-500 transition-all shadow-xl active:scale-95"
                >
                  Confirm Status
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
