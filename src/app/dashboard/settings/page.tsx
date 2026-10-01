'use client'

import { User, Building2, Key, Bell, Shield, Trash2, Save, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({ name: 'Enterprise User', org: 'TechCorp Inc.', email: 'demo@enterprise.ai' })
  const [notifications, setNotifications] = useState({ emailSummaries: true, taskReminders: false, weeklyReport: true })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and workspace preferences.</p>
      </div>

      {/* Profile */}
      <div className="glass border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-indigo-400" /> Profile</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full name</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Organization</label>
            <input value={profile.org} onChange={(e) => setProfile({ ...profile, org: e.target.value })} className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input value={profile.email} disabled className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="glass border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Key className="w-4 h-4 text-indigo-400" /> API Configuration</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Gemini API Key</label>
          <input type="password" placeholder="Using app default key" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p className="text-xs text-muted-foreground mt-1.5">Override with your own key for higher rate limits. Leave blank to use the shared key.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-300">Gemini API is connected and working</p>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Bell className="w-4 h-4 text-indigo-400" /> Notifications</h2>
        {[
          { key: 'emailSummaries', label: 'Email summaries', desc: 'Receive AI-generated summaries via email' },
          { key: 'taskReminders', label: 'Task reminders', desc: 'Get reminded about upcoming task due dates' },
          { key: 'weeklyReport', label: 'Weekly AI report', desc: 'Weekly productivity report with AI insights' },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key as keyof typeof notifications] })}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifications[n.key as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-secondary border border-border'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="glass border border-border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-400" /> Security & Privacy</h2>
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
            <Key className="w-4 h-4" /> Change password
          </button>
          <button className="flex items-center gap-3 text-sm text-amber-400 hover:text-amber-300 transition-colors text-left">
            <Trash2 className="w-4 h-4" /> Export all my data
          </button>
          <button className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-colors text-left">
            <Trash2 className="w-4 h-4" /> Delete account
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save changes'}
        </button>
        {saved && <p className="text-sm text-emerald-400 animate-fade-in">Your settings have been saved.</p>}
      </div>
    </div>
  )
}
