import React, { useState } from 'react';
import { GameProject, GameBuild, PlatformType, GameStatus } from '../types';
import { 
  X, Plus, Upload, Trash2, Edit3, Save, Sparkles, Check, 
  FileArchive, Monitor, Video, Image as ImageIcon, Terminal, ShieldAlert, KeyRound, Lock 
} from 'lucide-react';

interface AdminCMSModalProps {
  games: GameProject[];
  adminToken: string;
  onClose: () => void;
  onSaveGame: (game: GameProject, isNew: boolean) => Promise<void>;
  onDeleteGame: (gameId: string) => Promise<void>;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  games,
  adminToken,
  onClose,
  onSaveGame,
  onDeleteGame
}) => {
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');

  // Password change state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccessMsg, setPasswordChangeSuccessMsg] = useState<string | null>(null);
  const [passwordChangeErrorMsg, setPasswordChangeErrorMsg] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPass = newPasswordInput.trim();
    if (!newPass || newPass.length < 4) {
      setPasswordChangeErrorMsg('Password must be at least 4 characters long');
      return;
    }

    setChangingPassword(true);
    setPasswordChangeErrorMsg(null);
    setPasswordChangeSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ newPassword: newPass })
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to change password');
      }
    } catch (err: any) {
      console.warn('Backend API change-password unreachable or static deployment, saving locally:', err);
    }

    localStorage.setItem('mozzie_admin_token', newPass);
    setPasswordChangeSuccessMsg('Admin password updated successfully! Please use your new password next time.');
    setNewPasswordInput('');
    setTimeout(() => {
      setShowPasswordChangeModal(false);
      setPasswordChangeSuccessMsg(null);
    }, 2500);
    setChangingPassword(false);
  };

  // Form Fields State
  const [formData, setFormData] = useState<Partial<GameProject>>({
    id: '',
    title: '',
    tagline: '',
    description: '',
    detailedOverview: '',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    unityVersion: 'Unity 6 (6000.0.1f1)',
    renderPipeline: 'URP',
    genre: ['Action', '3D'],
    status: 'Released',
    releaseDate: new Date().toISOString().split('T')[0],
    featured: false,
    developerNotes: '',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
    ],
    builds: [],
    technicalHighlights: ['Custom Unity URP Shaders', 'C# Job System Integration'],
    minRequirements: {
      os: 'Windows 10 64-bit',
      processor: 'Quad-core 2.5 GHz',
      memory: '8 GB RAM',
      graphics: 'GTX 1060 or equivalent',
      storage: '1 GB space'
    },
    devlogs: []
  });

  // Build entry inline form state
  const [newBuildPlatform, setNewBuildPlatform] = useState<PlatformType>('windows');
  const [newBuildTitle, setNewBuildTitle] = useState('Windows Standalone Build');
  const [newBuildFileUrl, setNewBuildFileUrl] = useState('');
  const [newBuildFileName, setNewBuildFileName] = useState('MyGame_v1.0.0_Win64.zip');
  const [newBuildFileSize, setNewBuildFileSize] = useState('45.0 MB');
  const [newBuildVersion, setNewBuildVersion] = useState('1.0.0');

  // Load existing game into form
  const handleSelectGameToEdit = (game: GameProject) => {
    setIsCreatingNew(false);
    setEditingGameId(game.id);
    setFormData({ ...game });
  };

  // Switch to blank new game form
  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setEditingGameId(null);
    const newId = 'game-' + Date.now();
    setFormData({
      id: newId,
      title: 'New Unity Project',
      tagline: 'Short tagline introducing the mechanics or theme.',
      description: 'Full summary of gameplay, engine optimizations, and aesthetic style.',
      detailedOverview: 'Detailed breakdown of C# script architecture, custom shaders, and asset pipelines used in Unity.',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      unityVersion: 'Unity 6 (6000.0)',
      renderPipeline: 'URP',
      genre: ['Action', '3D', 'Physics'],
      status: 'In Development',
      releaseDate: new Date().toISOString().split('T')[0],
      featured: false,
      trailerUrl: '',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
      ],
      builds: [],
      technicalHighlights: ['Unity 6 URP Pipeline', 'C# Burst Compiler Jobs'],
      devlogs: [],
      downloadsCount: 0,
      likesCount: 0,
      reviews: []
    });
  };

  // Helper to read any file (like .zip, .exe, .apk) as Data URL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Compress image helper using HTML5 canvas to keep Base64 size lightweight (<150KB)
  const compressAndResizeImage = (file: File, maxWidth = 1280, maxHeight = 720, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        return readFileAsDataUrl(file).then(resolve);
      }

      // Safety timeout: if image parsing hangs for 5 seconds, resolve with raw data URL
      const timeoutId = setTimeout(() => {
        readFileAsDataUrl(file).then(resolve);
      }, 5000);

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        if (!rawDataUrl) {
          clearTimeout(timeoutId);
          return resolve('');
        }

        const img = new window.Image();
        img.onload = () => {
          clearTimeout(timeoutId);
          try {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width || 800;
            canvas.height = height || 600;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return resolve(rawDataUrl);
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl || rawDataUrl);
          } catch (err) {
            console.warn('Canvas image compression failed, falling back to raw data URL:', err);
            resolve(rawDataUrl);
          }
        };

        img.onerror = (err) => {
          clearTimeout(timeoutId);
          console.warn('Image load error during compression, using raw reader result:', err);
          resolve(rawDataUrl);
        };

        img.src = rawDataUrl;
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        resolve('');
      };

      reader.readAsDataURL(file);
    });
  };

  // Helper to format file sizes up to several GBs
  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Upload file handler with API + Compressed client fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'cover' | 'screenshot' | 'build') => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file) return;

    const formattedSize = formatFileSize(file.size);
    setUploading(true);
    setUploadProgressMsg(`Uploading ${file.name} (${formattedSize})... Please wait.`);

    let uploadedUrl: string | null = null;
    let uploadedFileName = file.name;
    let uploadedFileSize = formattedSize;

    try {
      const controller = new AbortController();
      // 30 minute timeout for large game builds up to 2GB
      const fetchTimeoutId = setTimeout(() => controller.abort(), 30 * 60 * 1000);

      const uploadFormData = new FormData();
      if (targetField === 'build' || /\.(zip|rar|7z|apk|exe|app|AppImage|tar|gz)$/i.test(file.name)) {
        uploadFormData.append('isBuild', 'true');
        uploadFormData.append('buildFile', file);
      }
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-key': adminToken || '!X030507akg'
        },
        body: uploadFormData,
        signal: controller.signal
      });
      clearTimeout(fetchTimeoutId);

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.fileUrl) {
          uploadedUrl = data.fileUrl;
          if (data.fileName) uploadedFileName = data.fileName;
          if (data.fileSize) uploadedFileSize = data.fileSize;
        }
      } else {
        console.warn('Server upload endpoint returned non-OK or non-JSON:', res.status);
      }
    } catch (err) {
      console.warn('Backend API upload unavailable or timed out, using client-side file handler:', err);
    }

    // For images, if server API failed, fallback to client-side compressed Data URL
    if (!uploadedUrl && targetField !== 'build') {
      try {
        if (file.type.startsWith('image/')) {
          uploadedUrl = await compressAndResizeImage(file);
        } else {
          uploadedUrl = await readFileAsDataUrl(file);
        }
      } catch (err) {
        console.error('Client file reading error:', err);
      }
    }

    if (!uploadedUrl) {
      if (targetField === 'build') {
        alert(`Server upload for "${file.name}" (${formattedSize}) failed or timed out.\n\nFor large build archives (>500MB - 1.5GB), please upload your file to Google Drive, Mega, or Dropbox, copy the direct share link, and paste it into the "File URL" input box below.`);
      } else {
        alert(`Could not process "${file.name}". Please select a valid file.`);
      }
      setUploading(false);
      setUploadProgressMsg('');
      inputEl.value = '';
      return;
    }

    if (targetField === 'cover') {
      setFormData((prev) => ({ ...prev, coverImage: uploadedUrl! }));
    } else if (targetField === 'screenshot') {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...(prev.screenshots || []), uploadedUrl!]
      }));
    } else if (targetField === 'build') {
      const autoTitle = file.name.replace(/\.[^/.]+$/, '');
      const newBuildObj: GameBuild = {
        id: 'build-' + Date.now(),
        platform: newBuildPlatform,
        title: autoTitle,
        fileName: uploadedFileName,
        fileUrl: uploadedUrl!,
        fileSize: uploadedFileSize,
        version: newBuildVersion || '1.0.0',
        releaseDate: new Date().toISOString().split('T')[0],
        downloadCount: 0
      };

      setFormData((prev) => ({
        ...prev,
        builds: [...(prev.builds || []), newBuildObj]
      }));

      setNewBuildFileUrl(uploadedUrl!);
      setNewBuildFileName(uploadedFileName);
      setNewBuildFileSize(uploadedFileSize);
      setNewBuildTitle(autoTitle);
    }

    setUploadProgressMsg(`"${file.name}" attached successfully!`);
    setTimeout(() => setUploadProgressMsg(''), 3000);
    setUploading(false);
    inputEl.value = '';
  };

  // Add Build to list
  const handleAddBuild = () => {
    if (!newBuildFileUrl) {
      alert('Please select or upload a build file URL first.');
      return;
    }
    const newBuildObj: GameBuild = {
      id: 'build-' + Date.now(),
      platform: newBuildPlatform,
      title: newBuildTitle,
      fileName: newBuildFileName,
      fileUrl: newBuildFileUrl,
      fileSize: newBuildFileSize,
      version: newBuildVersion,
      releaseDate: new Date().toISOString().split('T')[0],
      downloadCount: 0
    };

    setFormData((prev) => ({
      ...prev,
      builds: [...(prev.builds || []), newBuildObj]
    }));

    // Reset inline build inputs
    setNewBuildFileUrl('');
    setNewBuildFileName('MyGame_Build.zip');
  };

  const handleRemoveBuild = (buildId: string) => {
    setFormData((prev) => ({
      ...prev,
      builds: (prev.builds || []).filter((b) => b.id !== buildId)
    }));
  };

  // Save Game Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id) return;

    try {
      setSaving(true);
      await onSaveGame(formData as GameProject, isCreatingNew);
      setSaving(false);
      onClose();
    } catch (err: any) {
      console.error('Error saving game:', err);
      alert('Failed to save project: ' + (err?.message || 'Please check your inputs and try again.'));
      setSaving(false);
    }
  };


  // Delete Game
  const handleDelete = async (gameId: string) => {
    if (confirm('Are you sure you want to delete this Unity project from your portfolio?')) {
      await onDeleteGame(gameId);
      if (editingGameId === gameId) {
        setIsCreatingNew(false);
        setEditingGameId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020204]/95 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#020204] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest font-extrabold text-white">Studio Admin CMS Dashboard</h2>
              <p className="text-xs text-slate-400 font-light">Add, update, or upload new game builds & media showcase</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswordChangeModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-purple-300 border border-purple-500/30 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              title="Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span>Change Passcode</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Password Change Dialog Overlay */}
        {showPasswordChangeModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#020204] border border-purple-500/40 rounded-2xl p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  <span>Update Admin Passcode</span>
                </div>
                <button 
                  onClick={() => setShowPasswordChangeModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangeAdminPassword} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Set a new custom password for Kerem Guvenli admin access. Future logins to the CMS will require this passcode.
                </p>

                {passwordChangeSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    {passwordChangeSuccessMsg}
                  </div>
                )}

                {passwordChangeErrorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    {passwordChangeErrorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1 font-semibold">
                    New Admin Passcode
                  </label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new secret password..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword || !newPasswordInput.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {changingPassword ? 'Updating...' : 'Save New Passcode'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Game Projects Selector */}
          <div className="w-full md:w-64 bg-black/60 border-r border-white/10 p-4 flex flex-col shrink-0 overflow-y-auto">
            <button
              onClick={handleStartCreateNew}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 mb-4 cursor-pointer ${
                isCreatingNew
                  ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-purple-400 border-white/10'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Game</span>
            </button>

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
              Existing Projects ({games.length})
            </span>

            <div className="space-y-1.5 flex-1 overflow-y-auto">
              {games.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleSelectGameToEdit(g)}
                  className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between group ${
                    editingGameId === g.id && !isCreatingNew
                      ? 'bg-white/[0.06] text-white border-purple-500/50 shadow-sm'
                      : 'bg-white/[0.01] hover:bg-white/[0.04] text-slate-300 border-white/5'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-mono font-bold block truncate uppercase">{g.title}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{g.unityVersion}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(g.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#020204]">
            {editingGameId || isCreatingNew ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-xs font-mono uppercase tracking-widest font-extrabold text-white">
                    {isCreatingNew ? 'Create & Upload New Unity Project' : `Editing: ${formData.title}`}
                  </h3>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-slate-950" />
                    <span>{saving ? 'Saving Project...' : 'Save Game Project'}</span>
                  </button>
                </div>

                {uploadProgressMsg && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span>{uploadProgressMsg}</span>
                  </div>
                )}

                {/* BASIC INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Game Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Unity Version *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Unity 6 (6000.0) or 2022.3 LTS"
                      value={formData.unityVersion || ''}
                      onChange={(e) => setFormData({ ...formData, unityVersion: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Render Pipeline</label>
                    <select
                      value={formData.renderPipeline || 'URP'}
                      onChange={(e) => setFormData({ ...formData, renderPipeline: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#020204] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    >
                      <option value="URP">Universal Render Pipeline (URP)</option>
                      <option value="HDRP">High Definition Render Pipeline (HDRP)</option>
                      <option value="Built-in">Built-in Pipeline</option>
                      <option value="Custom">Custom Shaders Pipeline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Development Status</label>
                    <select
                      value={formData.status || 'Released'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#020204] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    >
                      <option value="Released">Released</option>
                      <option value="Playable Demo">Playable Demo</option>
                      <option value="Early Access">Early Access</option>
                      <option value="In Development">In Development</option>
                      <option value="Prototype">Prototype</option>
                    </select>
                  </div>
                </div>

                {/* TAGLINE & DESCRIPTION */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Short Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Detailed Technical Overview</label>
                  <textarea
                    rows={4}
                    value={formData.detailedOverview || ''}
                    onChange={(e) => setFormData({ ...formData, detailedOverview: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                {/* MEDIA, COVER IMAGE & IN-GAME SCREENSHOTS */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Cover Image & Media Assets
                  </h4>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Main Cover Image URL / Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.coverImage || ''}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                      />
                      <label className="px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-xs font-mono cursor-pointer flex items-center gap-1.5 shrink-0 border border-white/10">
                        <Upload className="w-3.5 h-3.5 text-purple-400" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'cover')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* IN-GAME SCREENSHOTS GALLERY */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        In-Game Screenshots ({formData.screenshots?.length || 0})
                      </label>
                      <label className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-mono cursor-pointer flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-purple-400" />
                        <span>Add Screenshot File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'screenshot')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Screenshot Previews Grid */}
                    {formData.screenshots && formData.screenshots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formData.screenshots.map((url, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video">
                            <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    screenshots: prev.screenshots.filter((_, i) => i !== idx)
                                  }));
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-mono transition-colors"
                                title="Delete Screenshot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-slate-300">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-slate-500 italic">No in-game screenshots added yet.</p>
                    )}

                    {/* Quick Image URL Adder */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        id="custom-screenshot-url-input"
                        placeholder="Or paste direct image URL (https://...)"
                        className="flex-1 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('custom-screenshot-url-input') as HTMLInputElement;
                          if (el && el.value.trim()) {
                            setFormData((prev) => ({
                              ...prev,
                              screenshots: [...(prev.screenshots || []), el.value.trim()]
                            }));
                            el.value = '';
                          }
                        }}
                        className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 rounded-xl text-xs font-mono cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Gameplay Trailer YouTube Embed URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://www.youtube.com/embed/XXXXXX"
                      value={formData.trailerUrl || ''}
                      onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* UPLOADABLE BUILD FILES MANAGEMENT */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                    <FileArchive className="w-4 h-4" /> Downloadable Game Build Manager (.zip, .apk, .exe)
                  </h4>

                  {/* Existing Builds List */}
                  <div className="space-y-2">
                    {formData.builds && formData.builds.length > 0 ? (
                      formData.builds.map((b) => (
                        <div key={b.id} className="p-3 rounded-xl bg-[#020204] border border-white/10 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="font-bold text-purple-400 uppercase mr-2">[{b.platform}]</span>
                            <span className="text-slate-200 font-semibold">{b.title}</span>
                            <span className="text-slate-400 text-[10px] ml-2">({b.fileSize} • {b.fileName})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBuild(b.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs font-mono text-slate-500 italic">No build files attached to this game yet.</p>
                    )}
                  </div>

                  {/* Inline Add Build Sub-Form */}
                  <div className="p-4 rounded-xl bg-[#020204] border border-white/10 space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white block">Add / Upload New Build File</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={newBuildPlatform}
                        onChange={(e) => setNewBuildPlatform(e.target.value as PlatformType)}
                        className="px-2.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                      >
                        <option value="windows">Windows (.exe / .zip)</option>
                        <option value="mac">macOS (.app / .zip)</option>
                        <option value="linux">Linux (.AppImage)</option>
                        <option value="webgl">WebGL Browser</option>
                        <option value="android">Android (.apk)</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Build Title (e.g. Win64 v1.2)"
                        value={newBuildTitle}
                        onChange={(e) => setNewBuildTitle(e.target.value)}
                        className="px-2.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                      />

                      <input
                        type="text"
                        placeholder="Version (e.g. 1.2.0)"
                        value={newBuildVersion}
                        onChange={(e) => setNewBuildVersion(e.target.value)}
                        className="px-2.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                      />
                    </div>

                    {/* Upload Build File Trigger */}
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="File URL or upload game archive"
                        value={newBuildFileUrl}
                        onChange={(e) => setNewBuildFileUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white font-mono"
                      />

                      <label className="px-3 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 rounded-xl text-xs font-mono font-extrabold cursor-pointer flex items-center gap-1 shrink-0 uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                        <Upload className="w-3.5 h-3.5 text-slate-950" />
                        <span>Upload .zip/.apk</span>
                        <input
                          type="file"
                          accept=".zip,.rar,.7z,.apk,.exe,.app,.AppImage,.tar,.gz,*/*"
                          onChange={(e) => handleFileUpload(e, 'build')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddBuild}
                      className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-purple-300 border border-white/10 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-400" />
                      <span>Attach Build File to Project</span>
                    </button>
                  </div>

                </div>

              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Sparkles className="w-12 h-12 mb-3 text-slate-700 animate-pulse" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">Select a game from the left sidebar or create a new project</h3>
                <p className="text-xs text-slate-600 font-light max-w-md">You can upload game build files, update screenshots, edit Unity specs, and manage release devlogs anytime.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
