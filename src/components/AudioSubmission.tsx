import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Upload, Send, Check, X } from 'lucide-react';

const AudioSubmission = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate audio file
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
      } else {
        alert('请选择音频文件');
      }
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setIsSubmitting(true);

    // Simulate submission - log to console
    console.log('=== 嗨呀！声音提交 ===');
    console.log('文件名:', selectedFile.name);
    console.log('文件大小:', (selectedFile.size / 1024).toFixed(2) + ' KB');
    console.log('文件类型:', selectedFile.type);
    console.log('提交时间:', new Date().toISOString());
    console.log('========================');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setSelectedFile(null);

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
      }
    }, 1500);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 mt-6"
      >
        <div
          className="rounded-2xl p-5 border border-border/50"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--accent) / 0.3) 100%)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">🎤 声音征集令</h3>
              <p className="text-xs text-muted-foreground">上传你的嗨呀声，共创收益！</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            音频一经采纳，该音效后续收益的
            <span className="text-primary font-bold"> 50% </span>
            将作为分红返还至您的账户。
          </p>

          {/* File selection */}
          <div className="space-y-3">
            {selectedFile ? (
              <div className="flex items-center justify-between bg-card rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Mic className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground truncate">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center gap-2 text-muted-foreground"
              >
                <Upload className="w-5 h-5" />
                <span className="text-sm">选择或录制音频文件</span>
              </motion.button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <motion.button
              whileHover={{ scale: selectedFile ? 1.02 : 1 }}
              whileTap={{ scale: selectedFile ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!selectedFile || isSubmitting}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                selectedFile
                  ? 'bg-gradient-to-br from-primary to-chart-1 text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                  <span>提交中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>提交给开发者</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-[80] p-4"
            onClick={closeSuccess}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-card rounded-2xl p-6 max-w-xs w-full shadow-xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-chart-1 mx-auto mb-4 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-2">提交成功！</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                声音已送往嗨呀总部！
                <br />
                审核结果将通过应用通知告知您。
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeSuccess}
                className="px-8 py-3 rounded-full font-bold text-primary-foreground bg-gradient-to-br from-primary to-chart-1"
              >
                好嗨呀！🧡
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioSubmission;
