import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Trash2,
  Info,
  Server,
  Zap,
  HelpCircle,
  ExternalLink,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiTestConnection, ConnectionTestResult } from '../utils/apiClient';
import { getUserApiKey, setUserApiKey, testGeminiApiKey } from '../services/aiGenerator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemoMode: boolean;
  onToggleForceDemo: (forced: boolean) => void;
  forceDemo: boolean;
  onResetDemoWorkspace: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDemoMode,
  onToggleForceDemo,
  forceDemo,
  onResetDemoWorkspace
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    error?: string;
    model: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getUserApiKey());
      setSavedFeedback(false);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setUserApiKey(apiKeyInput);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleClearKey = () => {
    setUserApiKey('');
    setApiKeyInput('');
    setTestResult(null);
  };

  const handleRunConnectionTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      // If user typed a key in the input, test that directly; otherwise test stored/backend
      const keyToTest = apiKeyInput.trim() || getUserApiKey();
      if (keyToTest) {
        const res = await testGeminiApiKey(keyToTest);
        setTestResult(res);
      } else {
        const res = await apiTestConnection();
        setTestResult({
          success: res.success,
          latencyMs: res.latencyMs,
          model: res.model || 'gemini-1.5-flash',
          error: res.error
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        model: 'unknown',
        error: `Could not verify connection: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  const hasKey = apiKeyInput.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Workspace & AI Settings</h2>
              <p className="text-[11px] text-slate-500">Dual-Engine setup & Google Gemini API configuration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual-Engine Architecture Card */}
        <div className="bg-gradient-to-br from-brand-50/70 to-slate-50 border border-brand-100 rounded-2xl p-4 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-brand-600" />
              <span>Dual-Engine Architecture</span>
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase border ${
                hasKey
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-violet-100 text-violet-800 border-violet-300'
              }`}
            >
              {hasKey ? 'Gemini 1.5 Flash Active' : 'Built-in Synthesis Engine'}
            </span>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            <strong>1. Google Gemini API:</strong> When an API key is provided, calls Gemini 1.5 Flash for dynamic generation.<br />
            <strong>2. Built-in Fallback Engine:</strong> If no key is provided (or if Gemini hits rate/quota limits), it <strong>automatically falls back</strong> to the multi-variable synthesis engine without crashing or showing errors!
          </p>
        </div>

        {/* User-supplied Gemini API Key Input */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-brand-600" />
              <span>Google Gemini API Key (Optional)</span>
            </label>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-brand-600 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AIzaSy... key or leave blank for Built-in Engine"
              className="w-full text-xs pr-20 pl-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSaveKey}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Key Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>

            {hasKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="px-3 py-2 border border-slate-200 hover:bg-slate-200/60 text-slate-600 rounded-xl text-xs transition flex items-center space-x-1"
                title="Remove API Key and use Built-in Engine"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRunConnectionTest}
              disabled={testing}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition text-xs flex items-center space-x-1 shadow-xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-brand-600' : 'text-slate-500'}`} />
              <span>{testing ? 'Testing...' : 'Test Key'}</span>
            </button>
          </div>

          {/* Test Results Display */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-[11px] space-y-1.5 animate-in fade-in duration-150 ${
                testResult.success
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center space-x-1.5">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>{testResult.success ? 'Gemini 1.5 Flash Connected' : 'Verification Note'}</span>
                </span>
                {testResult.latencyMs !== undefined && (
                  <span className="font-mono text-[10px] bg-white/70 px-1.5 py-0.5 rounded border border-current/20">
                    ⚡ {testResult.latencyMs}ms
                  </span>
                )}
              </div>

              {testResult.error && (
                <p className="text-[10px] text-amber-900 leading-tight">
                  {testResult.error}
                  <span className="block mt-1 text-slate-600">
                    💡 No problem! The Built-in Synthesis Engine will handle all content generation automatically.
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Force Built-in Demo Mode Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
          <div>
            <div className="font-bold text-slate-800">Force Built-in Synthesis Engine</div>
            <div className="text-[11px] text-slate-500">
              Generate instant copy without calling external APIs to conserve quota.
            </div>
          </div>
          <button
            onClick={() => onToggleForceDemo(!forceDemo)}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
              forceDemo ? 'bg-brand-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                forceDemo ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Reset Demo Workspace Only */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Reset the dedicated Demo Workspace back to its original Apex Dental Studio dataset? Your user projects will not be affected.'
                )
              ) {
                onResetDemoWorkspace();
                onClose();
              }
            }}
            className="text-slate-500 hover:text-rose-600 flex items-center space-x-1.5 transition text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Demo Workspace Only</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
