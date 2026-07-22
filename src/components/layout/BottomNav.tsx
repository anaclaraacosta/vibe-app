import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, BarChart2, User } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: 'Inicio',
      path: '/home',
      icon: Home
    },
    {
      label: 'Tests',
      path: '/tests',
      icon: Compass
    },
    {
      label: 'Wrapped',
      path: '/wrapped',
      icon: BarChart2
    },
    {
      label: 'Perfil',
      path: '/profile',
      icon: User
    }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-vibe-card border-t border-vibe-border flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center w-16 h-full transition-colors relative"
          >
            {/* Active top dot accent */}
            {isActive && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-vibe-volt" />
            )}

            <Icon
              className={`w-5 h-5 mb-1 transition-colors ${
                isActive ? 'text-vibe-volt' : 'text-vibe-gray'
              }`}
            />
            <span
              className={`text-[10px] font-medium tracking-wide transition-colors ${
                isActive ? 'text-vibe-volt' : 'text-vibe-gray'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
