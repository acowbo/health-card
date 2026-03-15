/**
 * 健康日报卡片 - UMD React 组件
 * 符合百宝箱 H5 卡片规范：React UMD + CSS内联 + default export 结构
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('react'));
  } else {
    // 兼容平台通过 window.HealthCard.default 查找组件的方式
    root.HealthCard = factory(root.React);
  }
}(typeof self !== 'undefined' ? self : this, function (React) {
  'use strict';

  // 容错处理：React 可能由平台全局注入
  var _React = React || (typeof window !== 'undefined' && window.React);
  if (!_React) {
    console.error('[HealthCard] React is not available');
    return { default: function() { return null; } };
  }

  var e = _React.createElement;

  /* ─── 内联样式 ─── */
  var S = {
    card: {
      fontFamily: "-apple-system,'PingFang SC','Helvetica Neue',sans-serif",
      background: 'linear-gradient(145deg,#1a1a2e,#16213e)',
      borderRadius: '24px', padding: '24px', color: '#fff',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      width: '100%', maxWidth: '380px', margin: '0 auto',
      boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
    },
    header:   { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' },
    dateLabel:{ fontSize:'12px', color:'rgba(255,255,255,0.5)', marginBottom:'4px' },
    title:    { fontSize:'18px', fontWeight:700 },
    badge: function(s) {
      var m = { '优秀':['rgba(72,199,142,0.2)','#48c78e','rgba(72,199,142,0.4)'], '良好':['rgba(99,179,237,0.2)','#63b3ed','rgba(99,179,237,0.4)'], '需改善':['rgba(252,129,74,0.2)','#fc814a','rgba(252,129,74,0.4)'] };
      var c = m[s] || m['良好'];
      return { padding:'5px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:600, background:c[0], color:c[1], border:'1px solid '+c[2] };
    },
    weightRow:  { display:'flex', alignItems:'flex-end', gap:'12px', marginBottom:'22px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' },
    weightVal:  { fontSize:'48px', fontWeight:800, lineHeight:1, background:'linear-gradient(135deg,#63b3ed,#9f7aea)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' },
    weightUnit: { fontSize:'16px', color:'rgba(255,255,255,0.5)' },
    wChange: function(d) {
      return { fontSize:'13px', padding:'3px 10px', borderRadius:'12px', fontWeight:600, marginBottom:'6px',
        background: d<0?'rgba(72,199,142,0.15)':d>0?'rgba(252,129,74,0.15)':'rgba(255,255,255,0.08)',
        color:      d<0?'#48c78e':d>0?'#fc814a':'rgba(255,255,255,0.5)' };
    },
    wTarget:  { fontSize:'11px', color:'rgba(255,255,255,0.35)', marginLeft:'auto', alignSelf:'flex-end' },
    secLabel: { fontSize:'11px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.8px', marginBottom:'12px' },
    calRow:   { display:'flex', justifyContent:'space-between', marginBottom:'10px' },
    calItem:  { textAlign:'center' },
    calVal: function(t){ return { fontSize:'22px', fontWeight:700, color:{in:'#fc814a',out:'#48c78e',net:'#9f7aea'}[t]||'#fff' }; },
    calLbl:   { fontSize:'10px', color:'rgba(255,255,255,0.4)', marginTop:'2px' },
    dot:      { color:'rgba(255,255,255,0.15)', fontSize:'20px', alignSelf:'center' },
    progBg:   { height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'6px', overflow:'hidden' },
    progFill: function(p,o){ return { height:'100%', borderRadius:'6px', width:p+'%', background:o?'linear-gradient(90deg,#fc814a,#f56565)':'linear-gradient(90deg,#63b3ed,#9f7aea)' }; },
    progMeta: { display:'flex', justifyContent:'space-between', marginTop:'5px', fontSize:'10px', color:'rgba(255,255,255,0.35)' },
    exBox:    { display:'flex', alignItems:'center', gap:'12px', padding:'14px', background:'rgba(255,255,255,0.05)', borderRadius:'14px', marginBottom:'18px' },
    exIcon:   { width:'40px', height:'40px', background:'linear-gradient(135deg,#48c78e,#38b2ac)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 },
    exName:   { fontSize:'14px', fontWeight:600 },
    exDetail: { fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'2px' },
    exCal:    { fontSize:'13px', fontWeight:700, color:'#48c78e', marginLeft:'auto' },
    tipBox:   { background:'linear-gradient(135deg,rgba(99,179,237,0.12),rgba(159,122,234,0.12))', border:'1px solid rgba(99,179,237,0.2)', borderRadius:'14px', padding:'12px 16px' },
    tipText:  { fontSize:'12px', color:'rgba(255,255,255,0.7)', lineHeight:1.6 },
    footer:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'18px', paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,0.06)' },
    brand:    { fontSize:'11px', color:'rgba(255,255,255,0.2)' },
    goalTxt:  { fontSize:'11px', color:'rgba(255,255,255,0.35)' },
    goalHi:   { color:'#9f7aea', fontWeight:600 },
  };

  /* ─── 组件主体 ─── */
  function HealthCard(props) {
    var p = props || {};
    var weight    = p.weight        != null ? p.weight        : '—';
    var wChange   = p.weightChange  != null ? Number(p.weightChange) : 0;
    var target    = p.targetWeight  != null ? p.targetWeight  : '—';
    var calIn     = p.caloriesIn    != null ? Number(p.caloriesIn)   : 0;
    var calOut    = p.caloriesOut   != null ? Number(p.caloriesOut)  : 0;
    var calGoal   = p.calorieTarget != null ? Number(p.calorieTarget): 1650;
    var exType    = p.exerciseType    || '暂无运动记录';
    var exDur     = p.exerciseDuration != null ? Number(p.exerciseDuration) : 0;
    var exIcon    = p.exerciseIcon    || '🏃';
    var status    = p.status          || '良好';
    var tip       = p.tip             || '';
    var date      = p.date            || (function(){ var n=new Date(); return n.getFullYear()+'年'+(n.getMonth()+1)+'月'+n.getDate()+'日'; })();

    var calNet = calIn - calOut;
    var pct    = calGoal > 0 ? Math.min((calIn / calGoal) * 100, 100) : 0;
    var over   = calIn > calGoal;
    var gap    = (typeof weight === 'number' && typeof target === 'number') ? (weight - target).toFixed(1) : null;
    var chgTxt = wChange < 0 ? '↓ '+Math.abs(wChange)+' kg' : wChange > 0 ? '↑ '+wChange+' kg' : '持平';

    return e('div', { style: S.card },
      e('div', { style: S.header },
        e('div', null,
          e('div', { style: S.dateLabel }, date),
          e('div', { style: S.title }, '健康日报 📋')
        ),
        e('div', { style: S.badge(status) }, status)
      ),
      e('div', { style: S.weightRow },
        e('div', { style: { display:'flex', alignItems:'baseline', gap:'4px' } },
          e('div', { style: S.weightVal }, String(weight)),
          e('div', { style: S.weightUnit }, 'kg')
        ),
        e('div', { style: S.wChange(wChange) }, chgTxt),
        e('div', { style: S.wTarget }, '目标 '+target+' kg')
      ),
      e('div', { style: { marginBottom:'20px' } },
        e('div', { style: S.secLabel }, '热量收支'),
        e('div', { style: S.calRow },
          e('div', { style: S.calItem }, e('div', { style: S.calVal('in') }, String(calIn)), e('div', { style: S.calLbl }, '摄入 kcal')),
          e('div', { style: S.dot }, '·'),
          e('div', { style: S.calItem }, e('div', { style: S.calVal('out') }, String(calOut)), e('div', { style: S.calLbl }, '消耗 kcal')),
          e('div', { style: S.dot }, '·'),
          e('div', { style: S.calItem }, e('div', { style: S.calVal('net') }, (calNet>=0?'+':'')+calNet), e('div', { style: S.calLbl }, '净值 kcal'))
        ),
        e('div', { style: S.progBg }, e('div', { style: S.progFill(pct, over) })),
        e('div', { style: S.progMeta }, e('span', null, '今日目标'), e('span', null, calIn+' / '+calGoal+' kcal'))
      ),
      e('div', { style: S.exBox },
        e('div', { style: S.exIcon }, exIcon),
        e('div', { style: { flex:1 } },
          e('div', { style: S.exName }, exType),
          exDur ? e('div', { style: S.exDetail }, exDur+' 分钟') : null
        ),
        calOut ? e('div', { style: S.exCal }, calOut+' kcal') : null
      ),
      tip ? e('div', { style: S.tipBox }, e('div', { style: S.tipText }, '💡 '+tip)) : null,
      e('div', { style: S.footer },
        e('div', { style: S.brand }, '瘦得漂亮 AI'),
        gap !== null
          ? e('div', { style: S.goalTxt }, '距目标还差 ', e('span', { style: S.goalHi }, gap+' kg'))
          : null
      )
    );
  }

  // 同时提供 default 属性，兼容平台按 Webpack 规范查找
  HealthCard.default = HealthCard;

  return HealthCard;
}));
