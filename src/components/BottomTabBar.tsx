import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smile, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import UnlockModal from './UnlockModal';

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getDaysUsed } = useApp();
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const daysUsed = getDaysUsed();
  const canAccessTheme = daysUsed >= 20;
  const daysRemaining = Math.max(0, 20 - daysUsed);

  const handleThemeClick = () => {
    if (canAccessTheme) {
      navigate('/theme-store');
    } else {
      setShowUnlockModal(true);
    }
  };

  const tabs = [
    { id: 'home', label: '今日记录', icon: Smile, path: '/' },
    { id: 'history', label: '开心动态', icon: Calendar, path: '/history' },
    { id: 'theme', label: '主题商店', icon: Sparkles, path: '/theme-store', onClick: handleThemeClick },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => tab.onClick ? tab.onClick() : navigate(tab.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon className="w-5 h-5 mb-1" />
                </motion.div>
                <span className="text-xs font-medium">{tab.label}</span>
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

      {/* Unlock Modal */}
      <UnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        daysRemaining={daysRemaining}
      />
    </>
  );
};

export default BottomTabBar;
