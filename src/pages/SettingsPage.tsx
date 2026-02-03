import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Info, Check, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import CandyBackground from '@/components/CandyBackground';
import BounceTitle from '@/components/BounceTitle';
import BubbleCard from '@/components/BubbleCard';
import BubbleButton from '@/components/BubbleButton';
import coffeeQrcode from '@/assets/coffee-qrcode.png';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, exportData, importData, getDaysUsed, entries } = useApp();
  
  const [userId, setUserId] = useState(settings.userId);
  const [saved, setSaved] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSaveId = () => {
    updateSettings({ userId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    link.download = `haiya-backup-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        alert('导入成功！');
        setUserId(settings.userId);
      } else {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  const handleShowWelcome = () => {
    navigate('/welcome');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen max-w-md mx-auto pt-safe pb-safe relative"
    >
      <CandyBackground />

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-3 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.4)',
          }}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <BounceTitle className="text-xl">
          设置
        </BounceTitle>
      </header>
      
      <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* User ID */}
        <BubbleCard delay={0.1}>
          <h2 className="text-sm font-bold mb-3" style={{ color: '#EA580C' }}>用户ID</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="输入你的ID..."
              className="flex-1 px-4 py-3 rounded-2xl text-sm focus:outline-none"
              style={{
                background: 'linear-gradient(145deg, rgba(254,237,213,0.8) 0%, rgba(255,251,245,0.9) 100%)',
                border: '2px solid rgba(251, 146, 60, 0.3)',
                color: '#78350F',
              }}
            />
            <BubbleButton
              onClick={handleSaveId}
              size="sm"
              data-testid="button-save-id"
            >
              {saved ? <Check className="w-4 h-4" /> : '保存'}
            </BubbleButton>
          </div>
        </BubbleCard>
        
        {/* Stats */}
        <BubbleCard glow delay={0.15}>
          <h2 className="text-sm font-bold mb-4" style={{ color: '#EA580C' }}>使用统计</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <motion.p 
                className="text-3xl sm:text-4xl font-black"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: '#EA580C' }}
              >
                {getDaysUsed()}
              </motion.p>
              <p className="text-xs sm:text-sm" style={{ color: '#9A3412' }}>使用天数</p>
            </div>
            <div className="text-center">
              <motion.p 
                className="text-3xl sm:text-4xl font-black"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                style={{ color: '#EA580C' }}
              >
                {entries.length}
              </motion.p>
              <p className="text-xs sm:text-sm" style={{ color: '#9A3412' }}>记录条数</p>
            </div>
          </div>
        </BubbleCard>
        
        {/* Data Management */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold" style={{ color: '#EA580C' }}>数据管理</h2>
          
          <BubbleCard delay={0.2} onClick={handleExport}>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' }}
              >
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: '#EA580C' }}>导出数据</p>
                <p className="text-xs" style={{ color: '#9A3412' }}>备份所有记录到文件</p>
              </div>
            </div>
          </BubbleCard>
          
          <BubbleCard delay={0.25} onClick={() => fileInputRef.current?.click()}>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' }}
              >
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm" style={{ color: '#EA580C' }}>导入数据</p>
                <p className="text-xs" style={{ color: '#9A3412' }}>从备份文件恢复记录</p>
              </div>
            </div>
          </BubbleCard>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {/* View Welcome Page */}
        <BubbleCard delay={0.3} onClick={handleShowWelcome}>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' }}
            >
              <Eye className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-sm" style={{ color: '#EA580C' }}>再看看嗨呀！欢迎页</p>
          </div>
        </BubbleCard>

        {/* About */}
        <BubbleCard delay={0.35} onClick={() => setShowAbout(true)}>
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' }}
            >
              <Info className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-sm" style={{ color: '#EA580C' }}>关于嗨呀！</p>
          </div>
        </BubbleCard>
      </div>
      
      {/* About Modal - Vibrant Orange Theme */}
      {showAbout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAbout(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center max-h-[90vh] overflow-y-auto overflow-x-hidden"
            style={{
              background: 'linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
              boxShadow: '0 20px 60px rgba(251, 146, 60, 0.3), 0 10px 30px rgba(249, 115, 22, 0.2)',
              border: '3px solid rgba(251, 146, 60, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating orange decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 text-4xl opacity-30"
              >
                <span role="img" aria-label="orange">🍊</span>
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-2 -left-2 text-3xl opacity-20"
              >
                <span role="img" aria-label="sun">☀️</span>
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/3 -right-6 text-2xl opacity-20"
              >
                <span role="img" aria-label="orange">🍊</span>
              </motion.div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Title with sparkles */}
              <div className="mb-4">
                <motion.span 
                  className="text-4xl font-black inline-block"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ color: '#EA580C' }}
                >
                  嗨呀！
                </motion.span>
                <span className="text-2xl ml-1">✨</span>
              </div>
              
              {/* Main message */}
              <p className="text-lg mb-2 leading-relaxed" style={{ color: '#9A3412' }}>
                只会帮助你记住开心的事 <span className="text-xl">🌈</span>，
              </p>
              
              {/* Animated "嗨呀呀！" */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, -2, 2, 0],
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  repeatDelay: 2,
                }}
                className="mb-4"
              >
                <span className="text-2xl font-black" style={{ color: '#EA580C' }}>
                  一定要嗨呀呀！
                </span>
                <span className="text-xl ml-1">🧡🍊⚡️</span>
              </motion.div>
              
              {/* QR Code Section */}
              <div 
                className="mb-4 p-4 rounded-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,237,213,0.8) 100%)',
                  border: '2px solid rgba(251, 146, 60, 0.3)',
                }}
              >
                <p className="text-sm mb-3 font-medium" style={{ color: '#9A3412' }}>
                  嗨呀！你还可以请@HiYaJoHn喝杯咖啡豆浆！
                </p>
                <img 
                  src={coffeeQrcode} 
                  alt="打赏二维码" 
                  className="w-40 h-auto mx-auto rounded-xl shadow-md"
                  style={{ border: '3px solid rgba(251, 146, 60, 0.3)' }}
                />
              </div>
              
              {/* Close button */}
              <BubbleButton
                onClick={() => setShowAbout(false)}
                size="lg"
                data-testid="button-close-about"
              >
                好呀！
              </BubbleButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingsPage;
