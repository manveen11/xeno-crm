'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Key, Box, Check, AlertCircle } from 'lucide-react';

interface SettingsClientProps {
  initialHasApiKey: boolean;
  initialModel: string;
}

export default function SettingsClient({ initialHasApiKey, initialModel }: SettingsClientProps) {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(initialHasApiKey);
  const [model, setModel] = useState(initialModel);
  const [models, setModels] = useState<any[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Automatically fetch models on mount if API key is already set
  useEffect(() => {
    if (initialHasApiKey) {
      fetchModels();
    }
  }, [initialHasApiKey]);

  const fetchModels = async (keyToUse?: string) => {
    setIsFetchingModels(true);
    setError('');
    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyToUse ? { apiKey: keyToUse } : {}),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setModels(data.models || []);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch models');
      setModels([]);
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleFetchModelsClick = () => {
    if (apiKey) {
      fetchModels(apiKey);
    } else if (isApiKeySet) {
      fetchModels();
    } else {
      setError('Please enter an API key first');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = { model };
      if (apiKey !== '') {
        payload.apiKey = apiKey;
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      setSuccess('Settings saved successfully');
      if (apiKey) {
        setIsApiKeySet(true);
        setApiKey('');
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-[family-name:var(--font-display)] text-ink tracking-tight mb-2">Settings</h1>
        <p className="text-ink-muted">Configure your AI agent preferences and API keys.</p>
      </div>

      <div className="bg-surface border border-hairline rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-hairline bg-canvas/50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            Gemini API Configuration
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Provide your own Google AI Studio API key to bypass rate limits and select specific models. 
            If left empty, we'll use our default key with the gemini-2.5-flash model.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key Input */}
          <div>
            <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">
              Custom API Key
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={isApiKeySet ? '••••••••••••••••••••••••••••••••' : 'Enter your Gemini API key'}
                  className="w-full h-12 bg-canvas border border-hairline rounded-xl pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all font-mono text-[14px]"
                />
                {isApiKeySet && !apiKey && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium text-[#16A34A] bg-[#F0FDF4] px-2 py-1 rounded-md border border-[#22C55E]/20">
                    <Check className="w-3 h-3" /> Set
                  </div>
                )}
              </div>
              <button
                onClick={handleFetchModelsClick}
                disabled={isFetchingModels || (!apiKey && !isApiKeySet)}
                className="h-12 px-5 bg-canvas border border-hairline text-ink font-medium rounded-xl hover:bg-surface transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingModels ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Fetch Models
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-[13px] font-semibold text-ink uppercase tracking-wider mb-2">
              Select Model
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-12 bg-canvas border border-hairline rounded-xl pl-10 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all font-medium text-[15px]"
              >
                {models.length > 0 ? (
                  models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.id} ({m.id})
                    </option>
                  ))
                ) : (
                  <option value={model}>{model} (Default)</option>
                )}
              </select>
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
                ▼
              </div>
            </div>
            {models.length === 0 && isApiKeySet && !isFetchingModels && (
              <p className="text-[12px] text-ink-muted mt-2">
                Click "Fetch Models" to load available models for your API key.
              </p>
            )}
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-[#DC2626] bg-[#FEF2F2] p-3 rounded-lg border border-[#FECACA]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 text-sm text-[#16A34A] bg-[#F0FDF4] p-3 rounded-lg border border-[#22C55E]/20 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-hairline bg-canvas/50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-6 bg-ink text-canvas rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
