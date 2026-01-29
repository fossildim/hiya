import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Music, Check, X, LogOut, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThemeColorCode {
  primary: string;
  background: string;
  accent: string;
}

interface Theme {
  id: string;
  name: string;
  color_code: ThemeColorCode;
  price: number;
  is_active: boolean;
  created_at: string;
}

interface Upload {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'themes' | 'uploads'>('themes');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: '',
    primary: '350 89% 60%',
    background: '350 100% 98%',
    accent: '25 95% 53%',
    price: 0.01,
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin-login');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate('/admin-login');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [themesRes, uploadsRes] = await Promise.all([
        supabase.from('themes').select('*').order('created_at', { ascending: false }),
        supabase.from('user_uploads').select('*').order('created_at', { ascending: false }),
      ]);

      if (themesRes.data) {
        const parsedThemes = themesRes.data.map(t => ({
          ...t,
          color_code: t.color_code as unknown as ThemeColorCode,
        }));
        setThemes(parsedThemes);
      }
      if (uploadsRes.data) {
        setUploads(uploadsRes.data as Upload[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTheme = async () => {
    try {
      const { error } = await supabase.from('themes').insert({
        name: newTheme.name,
        color_code: {
          primary: newTheme.primary,
          background: newTheme.background,
          accent: newTheme.accent,
        },
        price: newTheme.price,
        is_active: true,
      });

      if (error) throw error;

      toast({ title: '主题添加成功' });
      setShowAddTheme(false);
      setNewTheme({
        name: '',
        primary: '350 89% 60%',
        background: '350 100% 98%',
        accent: '25 95% 53%',
        price: 0.01,
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: '添加失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleThemeActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('themes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast({
        title: '更新失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteTheme = async (id: string) => {
    if (!confirm('确定要删除这个主题吗？')) return;

    try {
      const { error } = await supabase.from('themes').delete().eq('id', id);
      if (error) throw error;
      toast({ title: '主题已删除' });
      fetchData();
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateUploadStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('user_uploads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: `已${status === 'approved' ? '通过' : '拒绝'}` });
      fetchData();
    } catch (error: any) {
      toast({
        title: '更新失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-secondary text-secondary-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="font-bold text-foreground">嗨呀！管理后台</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-2 rounded-full bg-destructive/10 text-destructive"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('themes')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'themes'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
        >
          主题管理
        </button>
        <button
          onClick={() => setActiveTab('uploads')}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            activeTab === 'uploads'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
        >
          音频审核
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">加载中...</div>
        ) : activeTab === 'themes' ? (
          <div className="space-y-4">
            {/* Add Theme Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddTheme(!showAddTheme)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-primary/50 text-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加新主题
            </motion.button>

            {/* Add Theme Form */}
            {showAddTheme && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-card rounded-xl p-4 border border-border space-y-4"
              >
                <input
                  type="text"
                  value={newTheme.name}
                  onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                  placeholder="主题名称"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newTheme.primary}
                    onChange={(e) => setNewTheme({ ...newTheme, primary: e.target.value })}
                    placeholder="Primary HSL"
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                  />
                  <input
                    type="text"
                    value={newTheme.background}
                    onChange={(e) => setNewTheme({ ...newTheme, background: e.target.value })}
                    placeholder="Background HSL"
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                  />
                  <input
                    type="text"
                    value={newTheme.accent}
                    onChange={(e) => setNewTheme({ ...newTheme, accent: e.target.value })}
                    placeholder="Accent HSL"
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                  />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={newTheme.price}
                  onChange={(e) => setNewTheme({ ...newTheme, price: parseFloat(e.target.value) })}
                  placeholder="价格"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border"
                />
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddTheme}
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                  >
                    保存
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddTheme(false)}
                    className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground"
                  >
                    取消
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Theme List */}
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, hsl(${theme.color_code.primary}), hsl(${theme.color_code.accent}))`,
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">¥{theme.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleThemeActive(theme.id, theme.is_active)}
                      className={`p-2 rounded-full ${
                        theme.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {theme.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTheme(theme.id)}
                      className="p-2 rounded-full bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无用户上传</p>
              </div>
            ) : (
              uploads.map((upload) => (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Music className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{upload.file_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {upload.file_size ? `${(upload.file_size / 1024).toFixed(1)} KB` : '未知大小'} •{' '}
                          {new Date(upload.created_at).toLocaleDateString('zh-CN')}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                            upload.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : upload.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {upload.status === 'approved' ? '已通过' : upload.status === 'rejected' ? '已拒绝' : '待审核'}
                        </span>
                      </div>
                    </div>
                    {upload.status === 'pending' && (
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateUploadStatus(upload.id, 'approved')}
                          className="p-2 rounded-full bg-green-100 text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateUploadStatus(upload.id, 'rejected')}
                          className="p-2 rounded-full bg-red-100 text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPage;
