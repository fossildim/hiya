import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import BottomTabBar from '@/components/BottomTabBar';
import MysteryBox from '@/components/MysteryBox';
import MyWardrobe from '@/components/MyWardrobe';
import AudioSubmission from '@/components/AudioSubmission';

const ThemeStorePage = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-safe">
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,245,247,0.8) 0%, rgba(255,228,232,0.4) 50%, rgba(254,215,170,0.3) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">嗨呀！商店</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">发现更多嗨呀惊喜</p>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 space-y-8">
        {/* Mystery Box Section */}
        <section className="flex justify-center px-4">
          <MysteryBox />
        </section>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-border/50" />
        </div>

        {/* My Wardrobe */}
        <MyWardrobe />

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-border/50" />
        </div>

        {/* Audio Submission */}
        <AudioSubmission />

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      <BottomTabBar />
    </div>
  );
};

export default ThemeStorePage;
