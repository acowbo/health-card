(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  const S = {
    card: { fontFamily:"-apple-system,'PingFang SC',sans-serif", background:'linear-gradient(145deg,#1a1a2e,#16213e)', borderRadius:'24px', padding:'24px', color:'#fff', boxShadow:'0 20px 60px rgba(0,0,0,0.4)', width:'100%', maxWidth:'380px', margin:'0 auto', boxSizing:'border-box' },
    header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' },
    dateLabel: { fontSize:'12px', color:'rgba(255,255,255,0.5)', marginBottom:'4px' },
    title: { fontSize:'18px', fontWeight:700 },
    weightRow: { display:'flex', alignItems:'flex-end', gap:'12px', marginBottom:'22px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' },
    weightVal: { fontSize:'48px', fontWeight:800, lineHeight:1, background:'linear-gradient(135deg,#63b3ed,#9f7aea)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
    weightUnit: { fontSize:'16px', color:'rgba(255,255,255,0.5)' },
    wTarget: { fontSize:'11px', color:'rgba(255,255,255,0.35)', marginLeft:'auto', alignSelf:'flex-end' },
    secLabel: { fontSize:'11px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.8px', marginBottom:'12px' },
    calRow: { display:'flex', justifyContent:'space-between', marginBottom:'10px' },
    calItem: { textAlign:'center' },
    dot: { color:'rgba(255,255,255,0.15)', fontSize:'20px', alignSelf:'center' },
    progBg: { height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'6px', overflow:'hidden' },
    progMeta: { display:'flex', justifyContent:'space-between', marginTop:'5px', fontSize:'10px', color:'rgba(255,255,255,0.35)' },
    exBox: { display:'flex', alignItems:'center', gap:'12px', padding:'14px', background:'rgba(255,255,255,0.05)', borderRadius:'14px', marginBottom:'18px' },
    exIcon: { width:'40px', height:'40px', background:'linear-gradient(135deg,#48c78e,#38b2ac)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 },
    exName: { fontSize:'14px', fontWeight:600 },
    exDetail: { fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'2px' },
    exCal: { fontSize:'13px', fontWeight:700, color:'#48c78e', marginLeft:'auto' },
    tipBox: { background:'linear-gradient(135deg,rgba(99,179,237,0.12),rgba(159,122,234,0.12))', border:'1px solid rgba(99,179,237,0.2)', borderRadius:'14px', padding:'12px 16px' },
    tipText: { fontSize:'12px', color:'rgba(255,255,255,0.7)', lineHeight:1.6 },
    footer: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'18px', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.06)' },
    brand: { fontSize:'11px', color:'rgba(255,255,255,0.2)' },
    goalTxt: { fontSize:'11px', color:'rgba(255,255,255,0.35)' },
    goalHi: { color:'#9f7aea', fontWeight:600 },
  };

  function badge(s) {
    const m = {
      '优秀': ['rgba(72,199,142,0.2)', '#48c78e', 'rgba(72,199,142,0.4)'],
      '良好': ['rgba(99,179,237,0.2)', '#63b3ed', 'rgba(99,179,237,0.4)'],
      '需改善': ['rgba(252,129,74,0.2)', '#fc814a', 'rgba(252,129,74,0.4)'],
    };
    const c = m[s] || m['良好'];
    return { padding:'5px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:600, background:c[0], color:c[1], border:'1px solid '+c[2] };
  }

  function HealthCard(props) {
    props = props || {};
    const weight  = props.weight        != null ? props.weight        : '—';
    const wChange = props.weightChange  != null ? Number(props.weightChange) : 0;
    const target  = props.targetWeight  != null ? props.targetWeight  : '—';
    const calIn   = props.caloriesIn    != null ? Number(props.caloriesIn)   : 0;
    const calOut  = props.caloriesOut   != null ? Number(props.caloriesOut)  : 0;
    const calGoal = props.calorieTarget != null ? Number(props.calorieTarget): 1650;
    const exType  = props.exerciseType    || '暂无运动';
    const exDur   = props.exerciseDuration ? Number(props.exerciseDuration) : 0;
    const exIcon  = props.exerciseIcon    || '🏃';
    const status  = props.status          || '良好';
    const tip     = props.tip             || '';
    const now     = new Date();
    const date    = props.date || (now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日');

    const calNet = calIn - calOut;
    const pct    = calGoal > 0 ? Math.min((calIn / calGoal) * 100, 100) : 0;
    const over   = calIn > calGoal;
    const gap    = (typeof weight==='number' && typeof target==='number') ? (weight-target).toFixed(1) : null;
    const chgTxt = wChange < 0 ? '↓ '+Math.abs(wChange)+' kg' : wChange > 0 ? '↑ '+wChange+' kg' : '持平';
    const chgStyle = { fontSize:'13px', padding:'3px 10px', borderRadius:'12px', fontWeight:600, marginBottom:'6px',
      background: wChange<0?'rgba(72,199,142,0.15)':wChange>0?'rgba(252,129,74,0.15)':'rgba(255,255,255,0.08)',
      color: wChange<0?'#48c78e':wChange>0?'#fc814a':'rgba(255,255,255,0.5)' };
    const calValStyle = (t) => ({ fontSize:'22px', fontWeight:700, color:{in:'#fc814a',out:'#48c78e',net:'#9f7aea'}[t]||'#fff' });
    const fillStyle = { height:'100%', borderRadius:'6px', width:pct+'%',
      background: over ? 'linear-gradient(90deg,#fc814a,#f56565)' : 'linear-gradient(90deg,#63b3ed,#9f7aea)' };

    return React.createElement('div', {style: S.card},
      React.createElement('div', {style: S.header},
        React.createElement('div', null,
          React.createElement('div', {style: S.dateLabel}, date),
          React.createElement('div', {style: S.title}, '健康日报 📋')
        ),
        React.createElement('div', {style: badge(status)}, status)
      ),
      React.createElement('div', {style: S.weightRow},
        React.createElement('div', {style: {display:'flex',alignItems:'baseline',gap:'4px'}},
          React.createElement('div', {style: S.weightVal}, String(weight)),
          React.createElement('div', {style: S.weightUnit}, 'kg')
        ),
        React.createElement('div', {style: chgStyle}, chgTxt),
        React.createElement('div', {style: S.wTarget}, '目标 '+target+' kg')
      ),
      React.createElement('div', {style: {marginBottom:'20px'}},
        React.createElement('div', {style: S.secLabel}, '热量收支'),
        React.createElement('div', {style: S.calRow},
          React.createElement('div', {style: S.calItem},
            React.createElement('div', {style: calValStyle('in')}, String(calIn)),
            React.createElement('div', {style: {fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}, '摄入 kcal')
          ),
          React.createElement('div', {style: S.dot}, '·'),
          React.createElement('div', {style: S.calItem},
            React.createElement('div', {style: calValStyle('out')}, String(calOut)),
            React.createElement('div', {style: {fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}, '消耗 kcal')
          ),
          React.createElement('div', {style: S.dot}, '·'),
          React.createElement('div', {style: S.calItem},
            React.createElement('div', {style: calValStyle('net')}, (calNet>=0?'+':'')+calNet),
            React.createElement('div', {style: {fontSize:'10px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}, '净值 kcal')
          )
        ),
        React.createElement('div', {style: S.progBg},
          React.createElement('div', {style: fillStyle})
        ),
        React.createElement('div', {style: S.progMeta},
          React.createElement('span', null, '今日目标'),
          React.createElement('span', null, calIn+' / '+calGoal+' kcal')
        )
      ),
      React.createElement('div', {style: S.exBox},
        React.createElement('div', {style: S.exIcon}, exIcon),
        React.createElement('div', {style: {flex:1}},
          React.createElement('div', {style: S.exName}, exType),
          exDur ? React.createElement('div', {style: S.exDetail}, exDur+' 分钟') : null
        ),
        calOut ? React.createElement('div', {style: S.exCal}, calOut+' kcal') : null
      ),
      tip ? React.createElement('div', {style: S.tipBox},
        React.createElement('div', {style: S.tipText}, '💡 '+tip)
      ) : null,
      React.createElement('div', {style: S.footer},
        React.createElement('div', {style: S.brand}, '瘦得漂亮 AI'),
        gap !== null ? React.createElement('div', {style: S.goalTxt},
          '距目标还差 ',
          React.createElement('span', {style: S.goalHi}, gap+' kg')
        ) : null
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
