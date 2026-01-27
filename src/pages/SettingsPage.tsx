import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Info, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, exportData, importData, getDaysUsed, entries } = useApp();
  
  const [userId, setUserId] = useState(settings.userId);
  const [saved, setSaved] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
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

  const yellowButton =
    'bg-gradient-to-br from-accent to-accent/70 text-accent-foreground';
  
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background mx-auto"
      style={{ maxWidth: 'min(100vw, calc(100vh * 9 / 16))' }}
    >
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className={`p-2 rounded-full ${yellowButton}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="font-bold text-foreground">设置</h1>
      </header>
      
      <div className="p-6 space-y-6">
        {/* User ID */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-medium text-muted-foreground">用户ID</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="输入你的ID..."
              className="flex-1 px-4 py-3 rounded-lg bg-card text-card-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveId}
              className={`px-4 py-3 rounded-lg ${yellowButton} font-medium flex items-center gap-2`}
            >
              {saved ? <Check className="w-4 h-4" /> : '保存'}
            </motion.button>
          </div>
        </motion.section>
        
        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-5 shadow-sm"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-4">使用统计</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{getDaysUsed()}</p>
              <p className="text-sm text-muted-foreground">使用天数</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{entries.length}</p>
              <p className="text-sm text-muted-foreground">记录条数</p>
            </div>
          </div>
        </motion.section>
        
        {/* Data Management */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-medium text-muted-foreground">数据管理</h2>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className={`w-full p-4 rounded-lg ${yellowButton} border border-border flex items-center gap-3`}
          >
            <Download className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-medium">导出数据</p>
              <p className="text-sm text-muted-foreground">备份所有记录到文件</p>
            </div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full p-4 rounded-lg ${yellowButton} border border-border flex items-center gap-3`}
          >
            <Upload className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-medium">导入数据</p>
              <p className="text-sm text-muted-foreground">从备份文件恢复记录</p>
            </div>
          </motion.button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </motion.section>
        
        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAbout(true)}
            className={`w-full p-4 rounded-lg ${yellowButton} border border-border flex items-center gap-3`}
          >
            <Info className="w-5 h-5 text-primary" />
            <p className="font-medium">关于嗨呀！</p>
          </motion.button>
        </motion.section>
      </div>
      
      {/* About Modal */}
      {showAbout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAbout(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-primary mb-2">嗨呀！</h2>
            <p className="text-muted-foreground mb-2">版本呀！ 0.1</p>
            <p className="text-sm text-muted-foreground mb-4">作者呀！ @HiYaJoHn</p>
            <p className="text-card-foreground text-sm leading-relaxed mb-6">
              嗨呀！只会帮助你记住开心的事，一定要嗨呀呀！
            </p>
            <button
              onClick={() => setShowAbout(false)}
              className={`px-6 py-2 rounded-lg ${yellowButton} font-medium`}
            >
              好呀！
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingsPage;
