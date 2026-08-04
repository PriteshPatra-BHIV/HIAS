import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Clock, Save, RefreshCcw, Bell } from 'lucide-react';
import { API_ENDPOINTS } from '../api/config';

export default function Settings() {
  const [settings, setSettings] = useState({
    emergency_mode: false,
    access_window_start: '07:00',
    access_window_end: '21:00',
    require_admin_approval: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.SETTINGS);
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(API_ENDPOINTS.SETTINGS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading system configurations...</div>;

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.01em' }}>
            <SettingsIcon color="var(--accent-primary)" size={20} /> System Preferences & Engine Rules
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Configure deterministic rule checks, emergency bypass, and time windows</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 2px 8px var(--accent-glow)' }}
        >
          {saving ? <RefreshCcw size={14} className="spin" /> : <Save size={14} />}
          SAVE CHANGES
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Emergency Mode */}
        <div className="card" style={{ border: settings.emergency_mode ? '1px solid var(--danger-border)' : '1px solid var(--border-color)', backgroundColor: settings.emergency_mode ? 'var(--danger-bg)' : 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                <ShieldAlert size={20} color={settings.emergency_mode ? 'var(--danger)' : 'var(--text-secondary)'} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>Emergency Bypass Protocol</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Force open all physical gate locks and bypass all ID verification checks.</p>
              </div>
            </div>
            <div 
              onClick={() => setSettings({...settings, emergency_mode: !settings.emergency_mode})}
              style={{ width: '44px', height: '24px', backgroundColor: settings.emergency_mode ? 'var(--danger)' : 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
            >
              <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.emergency_mode ? '22px' : '2px', transition: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Access Windows */}
        <div className="card">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              <Clock size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>General Access Window</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Set allowed scan timeframe for general resident access.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>START TIME</label>
              <input 
                type="time" 
                value={settings.access_window_start}
                onChange={(e) => setSettings({...settings, access_window_start: e.target.value})}
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>END TIME</label>
              <input 
                type="time" 
                value={settings.access_window_end}
                onChange={(e) => setSettings({...settings, access_window_end: e.target.value})}
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>

        {/* System Behavior */}
        <div className="card">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              <Bell size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>Human-in-the-loop Preferences</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Adjust verification queue thresholds for low-confidence scans.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Require Admin Review for face match confidence under 80%</span>
              <input 
                type="checkbox" 
                checked={settings.require_admin_approval}
                onChange={(e) => setSettings({...settings, require_admin_approval: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
