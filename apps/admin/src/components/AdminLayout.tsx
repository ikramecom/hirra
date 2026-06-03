import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import { clearApiKey } from '@/lib/api';
import { RiyanaluxeMark } from './RiyanaluxeMark';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: Package, end: false },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-walnut/10 bg-whisper flex flex-col">
        <div className="p-6 border-b border-walnut/10">
          <div className="flex items-center gap-3 text-emerald">
            <RiyanaluxeMark className="h-9 w-9" />
            <div>
              <p className="font-display text-xl font-semibold tracking-[0.12em] text-walnut">
                RIYANALUXE
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brass font-semibold">
                Admin · KSA
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition',
                  isActive
                    ? 'bg-emerald text-cream shadow-card'
                    : 'text-walnut/70 hover:bg-sand/40 hover:text-emerald',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-walnut/10">
          <button
            type="button"
            onClick={() => {
              clearApiKey();
              window.location.href = '/login';
            }}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-walnut/60 hover:text-signal hover:bg-signal/5 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
