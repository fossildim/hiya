import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smile, Calendar, Palette } from 'lucide-react';

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: '今天嗨呀！', icon: Smile, path: '/' },
    { id: 'history', label: '嗨呀！动态', icon: Calendar, path: '/history' },
    { id: 'theme', label: '嗨呀！主题', icon: Palette, path: '/theme-store' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{
        background: 'linear-gradient(180deg, rgba(255,251,245,0.95) 0%, rgba(254,237,213,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '2px solid rgba(251, 146, 60, 0.2)',
        boxShadow: '0 -4px 20px rgba(251, 146, 60, 0.1)',
      }}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <motion.div
                animate={{ 
                  scale: active ? 1.2 : 1,
                  y: active ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{
                  color: active ? '#EA580C' : '#9A3412',
                }}
              >
                <Icon className="w-5 h-5 mb-1" />
              </motion.div>
              <motion.span 
                className="text-xs"
                style={{
                  color: active ? '#EA580C' : '#9A3412',
                  fontWeight: active ? 700 : 500,
                }}
              >
                {tab.label}
              </motion.span>
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1 w-10 h-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #FB923C 0%, #EA580C 100%)',
                    boxShadow: '0 2px 8px rgba(251, 146, 60, 0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
