import React from 'react';
import { Film, CalendarDays, Ticket as TicketIcon, User } from 'lucide-react';

export type TabType = 'movies' | 'showtimes' | 'tickets' | 'profile';

interface Props {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  activeTicketsCount?: number;
}

export const BottomNav: React.FC<Props> = ({
  activeTab,
  onChangeTab,
  activeTicketsCount = 0,
}) => {
  const tabs = [
    { id: 'movies' as TabType, label: 'Filmler', icon: Film },
    { id: 'showtimes' as TabType, label: 'Seanslar', icon: CalendarDays },
    {
      id: 'tickets' as TabType,
      label: 'Biletlerim',
      icon: TicketIcon,
      badge: activeTicketsCount > 0 ? activeTicketsCount : undefined,
    },
    { id: 'profile' as TabType, label: 'Profil', icon: User },
  ];

  return (
    <nav className="h-16 px-3 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-lg flex items-center justify-around shrink-0 z-30 sticky bottom-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200 ${
              isActive ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {tab.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-red-600 text-white font-black text-[10px] rounded-full border border-slate-950 min-w-[16px] text-center shadow-sm shadow-red-600/50">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'font-bold text-red-500' : ''}`}>
              {tab.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute -bottom-1 w-6 h-1 bg-red-600 rounded-full shadow-sm shadow-red-600 animate-fade-in" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
