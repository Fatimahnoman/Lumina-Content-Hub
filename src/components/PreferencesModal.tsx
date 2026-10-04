import { useState } from 'react';
import { X, Type, Contrast, Check } from 'lucide-react';
import type { ReaderPrefs } from '@/lib/hooks';

interface PreferencesModalProps {
  prefs: ReaderPrefs;
  onSetFontSize: (size: ReaderPrefs['fontSize']) => void;
  onToggleContrast: () => void;
  onClose: () => void;
}

export function PreferencesModal({
  prefs,
  onSetFontSize,
  onToggleContrast,
  onClose,
}: PreferencesModalProps) {
  const fontSizes: { label: string; value: ReaderPrefs['fontSize']; preview: string }[] = [
    { label: 'Small', value: 'small', preview: 'A' },
    { label: 'Medium', value: 'medium', preview: 'A' },
    { label: 'Large', value: 'large', preview: 'A' },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0D1220]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Reader Preferences</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Type className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium text-white">Font Size</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {fontSizes.map((fs) => (
              <button
                key={fs.value}
                onClick={() => onSetFontSize(fs.value)}
                className={`relative flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-200 ${
                  prefs.fontSize === fs.value
                    ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-300'
                    : 'border-white/[0.06] bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {prefs.fontSize === fs.value && (
                  <Check className="w-3 h-3 absolute top-2 right-2 text-indigo-400" />
                )}
                <span
                  className="mb-1 font-bold"
                  style={{
                    fontSize: fs.value === 'large' ? '1.5rem' : fs.value === 'medium' ? '1.2rem' : '1rem',
                  }}
                >
                  {fs.preview}
                </span>
                <span className="text-xs">{fs.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Contrast className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium text-white">High-Contrast Mode</span>
          </div>
          <button
            onClick={onToggleContrast}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
              prefs.highContrast
                ? 'border-indigo-400/40 bg-indigo-500/10'
                : 'border-white/[0.06] bg-white/[0.03]'
            }`}
          >
            <span className={`text-sm ${prefs.highContrast ? 'text-indigo-300' : 'text-gray-400'}`}>
              {prefs.highContrast ? 'Enabled' : 'Disabled'}
            </span>
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                prefs.highContrast ? 'bg-indigo-500' : 'bg-white/[0.08]'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  prefs.highContrast ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Increases text contrast for better readability in challenging lighting conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
