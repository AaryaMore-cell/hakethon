'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Search,
  CheckCircle2,
  Zap,
  Compass,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Shield,
  Layers,
  Hexagon,
  Activity,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  icon: any
  label: string
  exact?: boolean
  badge?: string
  badgeVariant?: 'brand' | 'live' | 'count' | 'new'
}

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Workspace',
    items: [
      { href: '/dashboard',           icon: LayoutDashboard, label: 'Overview',          exact: true },
      { href: '/dashboard/chat',      icon: MessageSquare,   label: 'AI Chat',           badge: 'Gemini', badgeVariant: 'brand' },
      { href: '/dashboard/search',    icon: Search,          label: 'Knowledge Search',  badge: '14k+',   badgeVariant: 'count' },
      { href: '/dashboard/documents', icon: FileText,        label: 'Document Intel' },
    ]
  },
  {
    title: 'Execution',
    items: [
      { href: '/dashboard/planner',   icon: Layers,         label: 'Project Planner' },
      { href: '/dashboard/tasks',     icon: CheckCircle2,   label: 'Smart Tasks',      badge: '5',    badgeVariant: 'count' },
      { href: '/dashboard/workflows', icon: Zap,            label: 'Automations',      badge: 'Live', badgeVariant: 'live' },
      { href: '/dashboard/decision',  icon: Compass,        label: 'Decision Center' },
    ]
  },
  {
    title: 'Organization',
    items: [
      { href: '/dashboard/workspace', icon: Users,    label: 'Team Workspace' },
      { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics',    badge: 'New', badgeVariant: 'new' },
      { href: '/dashboard/settings',  icon: Settings, label: 'Settings' },
    ]
  }
]

const badgeStyles: Record<string, string> = {
  brand: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  live:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  count: 'bg-slate-100 text-slate-500 border border-slate-200',
  new:   'bg-amber-50 text-amber-600 border border-amber-200',
}
const badgeActiveStyles: Record<string, string> = {
  brand: 'bg-white/25 text-white',
  live:  'bg-white/25 text-white',
  count: 'bg-white/25 text-white',
  new:   'bg-white/25 text-white',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [collapsed, setCollapsed]               = useState(false)
  const [mobileOpen, setMobileOpen]             = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = async () => {
    document.cookie = 'demo_session=; path=/; max-age=0'
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'rgba(255,255,255,0.97)', borderRight: '1px solid rgba(0,0,0,0.07)' }}>

      {/* ── Nexa Wordmark ── */}
      <div className={cn(
        'flex items-center gap-3 px-4 h-14 border-b shrink-0',
        collapsed && 'justify-center px-2',
      )} style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          {/* N-hex logo mark */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#5b6af0] to-[#8b5cf6] shadow-lg shadow-indigo-600/25" />
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm tracking-tight select-none">N</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-bold text-[15px] text-slate-800 tracking-[-0.02em] block leading-none">Nexa</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-[0.12em] font-mono mt-0.5 block">Enterprise Platform</span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2.5 py-4 space-y-5 overflow-y-auto">
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!collapsed && (
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400 px-2 pb-1.5">
                {sec.title}
              </p>
            )}
            {sec.items.map((item) => {
              const active = isActive(item)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'group flex items-center justify-between px-2.5 py-[7px] rounded-[9px] text-[12.5px] font-medium transition-all duration-150',
                    collapsed && 'justify-center px-2',
                    active
                      ? 'bg-[#5b6af0] text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.icon className={cn(
                      'w-[15px] h-[15px] flex-shrink-0 transition-colors',
                      active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                    )} />
                    {!collapsed && <span className="truncate leading-none">{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className={cn(
                      'text-[9px] font-semibold px-1.5 py-0.5 rounded-md font-mono leading-none',
                      active
                        ? (badgeActiveStyles[item.badgeVariant ?? 'count'])
                        : (badgeStyles[item.badgeVariant ?? 'count'])
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div className="p-2.5 space-y-1 shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-[9px] bg-slate-50 border border-slate-200 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">A</div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-slate-800 truncate leading-none">Alex Morgan</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-2.5 h-2.5 text-indigo-500" />
                <span className="text-[10px] text-slate-400">Admin · Engineering</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full status-online flex-shrink-0" />
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Sign Out"
          className={cn(
            'flex items-center gap-2 w-full px-2.5 py-2 rounded-[9px] text-[12px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-[14px] h-[14px] flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Desktop Sidebar ── */}
      <aside className={cn(
        'hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-30 transition-[width] duration-300 ease-out',
        collapsed ? 'w-[60px]' : 'w-[220px]'
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center z-40 transition-colors shadow-sm"
          style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.1)' }}
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-slate-500" />
            : <ChevronLeft  className="w-3 h-3 text-slate-500" />}
        </button>
      </aside>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            <SidebarContent />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3.5 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className={cn(
        'flex-1 flex flex-col transition-[padding] duration-300 ease-out min-w-0',
        collapsed ? 'md:pl-[60px]' : 'md:pl-[220px]'
      )}>

        {/* ── Top header ── */}
        <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-5 shrink-0"
          style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-slate-400">
              <span className="text-slate-500">Acme Enterprise Corp</span>
              <span>/</span>
              <span className="text-slate-700 font-medium capitalize">
                {pathname.split('/').filter(Boolean).slice(-1)[0] || 'overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Activity className="w-3 h-3" />
              <span className="font-medium">Systems Online</span>
            </div>

            {/* Search shortcut */}
            <Link
              href="/dashboard/search"
              className="hidden sm:flex items-center gap-2 text-[12px] text-slate-400 hover:text-slate-700 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Search className="w-3 h-3 text-indigo-500" />
              <span>Quick search...</span>
              <kbd className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-400">⌘K</kbd>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5b6af0]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-[320px] rounded-2xl border shadow-2xl p-4 z-50 animate-scale-in"
                  style={{ background:'rgba(255,255,255,0.98)', backdropFilter:'blur(24px)', border:'1px solid rgba(0,0,0,0.08)' }}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <span className="text-[13px] font-semibold text-slate-800">Notifications</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-full">2 unread</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: 'Vendor DPA Signed', desc: 'Legal approved the contract addendum for TechCorp Ltd.', dot: 'bg-emerald-400' },
                      { title: 'Weekly Task Digest', desc: '4 tasks due this Friday in Sprint 14.', dot: 'bg-[#5b6af0]' },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.dot)} />
                        <div>
                          <p className="text-[12px] font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
