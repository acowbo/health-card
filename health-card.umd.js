/**
 * 健康日报卡片 - UMD React 组件
 * 百宝箱 H5 卡片规范：React + UMD 格式，CSS 内联，React/ReactDOM 为 external
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('react'));
  } else {
    root.HealthCard = factory(root.React);
  }
}(typeof self !== 'undefined' ? self : this, function (React) {
  'use strict';

  var e = React.createElement;

  /* ─── 样式（全部内联） ─── */
  var styles = {
    card: {
      fontFamily: "-apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif",
      background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
      borderRadius: '24px',
      padding: '24px',
      color: '#fff',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      width: '100%',
      maxWidth: '380px',
      margin: '0 auto',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    dateLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' },
    title: { fontSize: '18px', fontWeight: 700 },
    badge: function(status) {
      var colorMap = {
        '优秀': { bg: 'rgba(72,199,142,0.2)', color: '#48c78e', border: 'rgba(72,199,142,0.4)' },
        '良好': { bg: 'rgba(99,179,237,0.2)', color: '#63b3ed', border: 'rgba(99,179,237,0.4)' },
        '需改善': { bg: 'rgba(252,129,74,0.2)', color: '#fc814a', border: 'rgba(252,129,74,0.4)' },
      };
      var c = colorMap[status] || colorMap['良好'];
      return {
        padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
        background: c.bg, color: c.color, border: '1px solid ' + c.border,
      };
    },
    weightRow: {
      display: 'flex', alignItems: 'flex-end', gap: '12px',
      marginBottom: '22px', paddingBottom: '20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    weightValue: {
      fontSize: '48px', fontWeight: 800, lineHeight: 1,
      background: 'linear-gradient(135deg, #63b3ed, #9f7aea)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    weightUnit: { fontSize: '16px', color: 'rgba(255,255,255,0.5)' },
    weightChange: function(diff) {
      var isDown = diff < 0;
      var isUp = diff > 0;
      return {
        fontSize: '13px', padding: '3px 10px', borderRadius: '12px', fontWeight: 600,
        marginBottom: '6px',
        background: isDown ? 'rgba(72,199,142,0.15)' : isUp ? 'rgba(252,129,74,0.15)' : 'rgba(255,255,255,0.08)',
        color: isDown ? '#48c78e' : isUp ? '#fc814a' : 'rgba(255,255,255,0.5)',
      };
    },
    weightTarget: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginLeft: 'auto', alignSelf: 'flex-end' },
    sectionLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', marginBottom: '12px' },
    calorieNumbers: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    calItem: { textAlign: 'center' },
    calValue: function(type) {
      var colorMap = { 'in': '#fc814a', 'out': '#48c78e', 'net': '#9f7aea' };
      return { fontSize: '22px', fontWeight: 700, color: colorMap[type] || '#fff' };
    },
    calLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
    progressBg: { height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' },
    progressFill: function(pct, over) {
      return {
        height: '100%', borderRadius: '6px', width: pct + '%',
        background: over
          ? 'linear-gradient(90deg, #fc814a, #f56565)'
          : 'linear-gradient(90deg, #63b3ed, #9f7aea)',
        transition: 'width 1s ease',
      };
    },
    progressMeta: { display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.35)' },
    exerciseBox: {
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px', background: 'rgba(255,255,255,0.05)',
      borderRadius: '14px', marginBottom: '18px',
    },
    exerciseIcon: {
      width: '40px', height: '40px',
      background: 'linear-gradient(135deg, #48c78e, #38b2ac)',
      borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '20px', flexShrink: 0,
    },
    exerciseName: { fontSize: '14px', fontWeight: 600 },
    exerciseDetail: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
    exerciseCal: { fontSize: '13px', fontWeight: 700, color: '#48c78e', marginLeft: 'auto' },
    tipBox: {
      background: 'linear-gradient(135deg, rgba(99,179,237,0.12), rgba(159,122,234,0.12))',
      border: '1px solid rgba(99,179,237,0.2)',
      borderRadius: '14px', padding: '12px 16px',
    },
    tipText: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 },
    footer: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: '18px', paddingTop: '14px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    brand: { fontSize: '11px', color: 'rgba(255,255,255,0.2)' },
    goalText: { fontSize: '11px', color: 'rgba(255,255,255,0.35)' },
    goalHighlight: { color: '#9f7aea', fontWeight: 600 },
    divider: { color: 'rgba(255,255,255,0.15)', fontSize: '20px', alignSelf: 'center' },
  };

  /* ─── 组件 ─── */
  function HealthCard(props) {
    var d = props || {};

    var weight       = d.weight       != null ? d.weight       : '—';
    var weightChange = d.weightChange != null ? d.weightChange : 0;
    var targetWeight = d.targetWeight != null ? d.targetWeight : '—';
    var caloriesIn   = d.caloriesIn  != null ? d.caloriesIn   : 0;
    var caloriesOut  = d.caloriesOut != null ? d.caloriesOut  : 0;
    var calorieTarget= d.calorieTarget!= null ? d.calorieTarget: 1650;
    var exerciseType = d.exerciseType  || '暂无运动记录';
    var exerciseDur  = d.exerciseDuration || 0;
    var exerciseIcon = d.exerciseIcon  || '🏃';
    var status       = d.status        || '良好';
    var tip          = d.tip           || '';
    var date         = d.date          || (function() {
      var now = new Date();
      return now.getFullYear() + '年' + (now.getMonth()+1) + '月' + now.getDate() + '日';
    })();

    var calNet = caloriesIn - caloriesOut;
    var pct    = calorieTarget > 0 ? Math.min((caloriesIn / calorieTarget) * 100, 100) : 0;
    var over   = caloriesIn > calorieTarget;
    var gap    = (typeof weight === 'number' && typeof targetWeight === 'number')
                   ? (weight - targetWeight).toFixed(1) : null;

    var diff = typeof weightChange === 'number' ? weightChange : 0;
    var changeText = diff < 0 ? '↓ ' + Math.abs(diff) + ' kg'
                   : diff > 0 ? '↑ ' + diff + ' kg' : '持平';

    return e('div', { style: styles.card },

      /* 顶部 */
      e('div', { style: styles.header },
        e('div', null,
          e('div', { style: styles.dateLabel }, date),
          e('div', { style: styles.title }, '健康日报 📋')
        ),
        e('div', { style: styles.badge(status) }, status)
      ),

      /* 体重 */
      e('div', { style: styles.weightRow },
        e('div', { style: { display: 'flex', alignItems: 'baseline', gap: '4px' } },
          e('div', { style: styles.weightValue }, String(weight)),
          e('div', { style: styles.weightUnit }, 'kg')
        ),
        e('div', { style: styles.weightChange(diff) }, changeText),
        e('div', { style: styles.weightTarget }, '目标 ' + targetWeight + ' kg')
      ),

      /* 热量 */
      e('div', { style: { marginBottom: '20px' } },
        e('div', { style: styles.sectionLabel }, '热量收支'),
        e('div', { style: styles.calorieNumbers },
          e('div', { style: styles.calItem },
            e('div', { style: styles.calValue('in') }, String(caloriesIn)),
            e('div', { style: styles.calLabel }, '摄入 kcal')
          ),
          e('div', { style: styles.divider }, '·'),
          e('div', { style: styles.calItem },
            e('div', { style: styles.calValue('out') }, String(caloriesOut)),
            e('div', { style: styles.calLabel }, '消耗 kcal')
          ),
          e('div', { style: styles.divider }, '·'),
          e('div', { style: styles.calItem },
            e('div', { style: styles.calValue('net') }, (calNet >= 0 ? '+' : '') + calNet),
            e('div', { style: styles.calLabel }, '净值 kcal')
          )
        ),
        e('div', { style: styles.progressBg },
          e('div', { style: styles.progressFill(pct, over) })
        ),
        e('div', { style: styles.progressMeta },
          e('span', null, '今日目标'),
          e('span', null, caloriesIn + ' / ' + calorieTarget + ' kcal')
        )
      ),

      /* 运动 */
      e('div', { style: styles.exerciseBox },
        e('div', { style: styles.exerciseIcon }, exerciseIcon),
        e('div', { style: { flex: 1 } },
          e('div', { style: styles.exerciseName }, exerciseType),
          exerciseDur ? e('div', { style: styles.exerciseDetail }, exerciseDur + ' 分钟') : null
        ),
        caloriesOut ? e('div', { style: styles.exerciseCal }, caloriesOut + ' kcal') : null
      ),

      /* Tip */
      e('div', { style: styles.tipBox },
        e('div', { style: styles.tipText }, '💡 ' + tip)
      ),

      /* 底部 */
      e('div', { style: styles.footer },
        e('div', { style: styles.brand }, '瘦得漂亮 AI'),
        gap !== null
          ? e('div', { style: styles.goalText },
              '距目标还差 ',
              e('span', { style: styles.goalHighlight }, gap + ' kg')
            )
          : null
      )
    );
  }

  return HealthCard;
}));
