import { useState, useEffect, useRef, useCallback } from 'react';
import Nav from '../components/Nav.jsx';
import Toast from '../components/Toast.jsx';
import * as api from '../api.js';

function useToast() {
  const [state, setState] = useState({ msg: '', visible: false });
  const timer = useRef(null);
  const show = useCallback((msg) => {
    clearTimeout(timer.current);
    setState({ msg, visible: true });
    timer.current = setTimeout(() => setState(s => ({ ...s, visible: false })), 2600);
  }, []);
  return [state, show];
}

function Sparkline({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28, marginTop: 10 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: '2px 2px 0 0',
          background: i === data.length - 1 ? color : 'var(--border-2)',
          minHeight: 2,
          height: `${Math.max(8, (v / max) * 100)}%`,
        }} />
      ))}
    </div>
  );
}

function StatCard({ label, value, change, trend, color, sparkData }) {
  const isUp = change?.startsWith('+');
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '18px 18px 14px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
      <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 5, color }}>{value}</div>
      {change && (
        <div style={{ fontSize: 11, color: isUp ? 'var(--green)' : '#F87171', display: 'flex', alignItems: 'center', gap: 3 }}>
          {change}
        </div>
      )}
      {sparkData && <Sparkline data={sparkData} color={color} />}
    </div>
  );
}

function BarChart({ data, days }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <div
              title={`${days[i]||''}: ${v}`}
              style={{
                width: '100%',
                height: `${Math.max(3, (v / max) * 100)}%`,
                borderRadius: '4px 4px 0 0',
                background: i === data.length - 1
                  ? 'linear-gradient(180deg,#4ADE80,rgba(74,222,128,0.5))'
                  : 'var(--surface-3)',
                cursor: 'pointer', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8.5, color: 'var(--text-3)' }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

// Fallback demo data when backend returns nothing
function buildDemoData(days) {
  const n = parseInt(days);
  const labels = n <= 7
    ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].slice(-n)
    : Array.from({ length: n }, (_, i) => i % 5 === 0 ? String(i + 1) : '');
  return {
    totalViews: 2841, totalClicks: 1247, ctr: '43.9%', uniqueVisitors: 1903,
    viewsDelta: '+18%', clicksDelta: '+24%', ctrDelta: '+5.2pp', visitorsDelta: '-3%',
    viewsTrend:    [38,52,46,68,74,90,80],
    clicksTrend:   [22,38,40,55,60,74,89],
    ctrTrend:      [60,55,65,70,68,72,75],
    visitorsTrend: [80,76,70,65,60,58,55],
    chartViews:    Array.from({ length: n }, (_, i) => Math.round(200 + Math.random() * 400)),
    chartDays:     labels,
    links: [
      { icon:'🌐', title:'My Portfolio',   url:'example.com',   clicks:542, ctr:'19.1%', pct:100 },
      { icon:'🚀', title:'Latest Project', url:'project.com',   clicks:312, ctr:'11.0%', pct:58  },
      { icon:'⚡', title:'Book a Call',    url:'cal.com/me',    clicks:198, ctr:'7.0%',  pct:37  },
      { icon:'📸', title:'Instagram',      url:'instagram.com', clicks:145, ctr:'5.1%',  pct:27  },
      { icon:'🐦', title:'X / Twitter',    url:'x.com',         clicks:50,  ctr:'1.8%',  pct:9   },
    ],
  };
}

export default function Analytics() {
  const [days, setDays]     = useState('7');
  const [data, setData]     = useState(null);
  const [page, setPage]     = useState(null);
  const [toast, showToast]  = useToast();

  useEffect(() => {
    api.getMyPage().then(d => setPage(d.page)).catch(() => {});
  }, []);

  useEffect(() => {
    api.getAnalytics(days)
      .then(setData)
      .catch(() => setData(buildDemoData(days)));
  }, [days]);

  const d = data || buildDemoData(days);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', fontFamily: 'Inter,sans-serif' }}>
      <Nav
        slug={page?.slug}
        published={page?.published}
        onPublish={() => {}}
        saving={false}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', scrollbarWidth: 'thin', scrollbarColor: 'var(--border-2) transparent' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>Analytics</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
              {page?.slug ? `cenner.hr/p/${page.slug}` : 'Your link page'} — updated just now
            </div>
          </div>
          {/* Period selector */}
          <div style={{
            marginLeft: 'auto', display: 'flex', gap: 2,
            background: 'var(--surface)', border: '1px solid var(--border-2)',
            borderRadius: 8, padding: 3,
          }}>
            {['7','30','90'].map(p => (
              <button
                key={p}
                onClick={() => setDays(p)}
                style={{
                  padding: '5px 12px', borderRadius: 6,
                  fontSize: 12, fontWeight: 500,
                  color: days === p ? 'var(--text)' : 'var(--text-3)',
                  background: days === p ? 'var(--surface-2)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
                }}
              >{p}d</button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard label="Profile Views"    value={d.totalViews?.toLocaleString()}    change={d.viewsDelta}    color="var(--green)"         sparkData={d.viewsTrend} />
          <StatCard label="Total Clicks"     value={d.totalClicks?.toLocaleString()}   change={d.clicksDelta}   color="var(--pink)"          sparkData={d.clicksTrend} />
          <StatCard label="Click Rate"       value={d.ctr}                              change={d.ctrDelta}      color="#60A5FA"              sparkData={d.ctrTrend} />
          <StatCard label="Unique Visitors"  value={d.uniqueVisitors?.toLocaleString()} change={d.visitorsDelta} color="#A78BFA"             sparkData={d.visitorsTrend} />
        </div>

        {/* Daily chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 650, letterSpacing: '-0.01em' }}>Daily Views</div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: 'var(--text-3)' }}>
              <span><span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', marginRight: 4 }} />Views</span>
            </div>
          </div>
          {d.chartViews && <BarChart data={d.chartViews} days={d.chartDays || []} />}
        </div>

        {/* Link table */}
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Link Performance <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 12 }}>/ {days === '7' ? '7 days' : days === '30' ? '30 days' : '90 days'}</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 90px 80px 130px',
            padding: '11px 18px', borderBottom: '1px solid var(--border)',
            fontSize: 10, fontWeight: 650, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.07em',
          }}>
            <div>Link</div><div>Clicks</div><div>CTR</div><div>Share</div>
          </div>

          {(d.links || []).map((lk, i) => (
            <div
              key={i}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 90px 80px 130px',
                padding: '13px 18px',
                borderBottom: i < d.links.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 12.5, alignItems: 'center',
                letterSpacing: '-0.01em', transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                  {lk.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 550 }}>{lk.title}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 1 }}>{lk.url}</div>
                </div>
              </div>
              <div style={{ fontWeight: 650 }}>{lk.clicks?.toLocaleString()}</div>
              <div style={{ color: 'var(--text-2)' }}>{lk.ctr}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 3, background: 'var(--border-2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${lk.pct}%`, background: 'linear-gradient(90deg,var(--green),var(--pink))', borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', width: 26, textAlign: 'right' }}>{lk.pct}%</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  );
}
