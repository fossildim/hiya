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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <motion.div
                animate={{ 
                  scale: active ? 1.2 : 1,
                  y: active ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon className="w-5 h-5 mb-1" />
              </motion.div>
              <motion.span 
                className="text-xs font-medium"
                animate={{
                  fontWeight: active ? 700 : 500,
                }}
              >
                {tab.label}
              </motion.span>
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-1 w-8 h-1 rounded-full bg-primary"
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
