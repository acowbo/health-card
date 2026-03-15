(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 健康日报卡片 - 精简版
   * Props (均为字符串):
   *   weight       - 体重，如 "67.5"
   *   targetWeight - 目标体重，如 "62"
   *   status       - "优秀" | "良好" | "需改善"
   *   tip          - AI 分析/建议（可多句，支持换行）
   *   date         - 日期，如 "2026年3月15日"（可选）
   */
  function HealthCard(props) {
    props = props || {};

    const weight  = String(props.weight       || '—');
    const target  = String(props.targetWeight || '—');
    const status  = String(props.status       || '良好');
    const tip     = String(props.tip          || '');
    const date    = String(props.date         || '');

    const sc = {
      '优秀':  { bg:'rgba(72,199,142,0.15)', color:'#48c78e', border:'rgba(72,199,142,0.3)' },
      '良好':  { bg:'rgba(99,179,237,0.15)', color:'#63b3ed', border:'rgba(99,179,237,0.3)' },
      '需改善':{ bg:'rgba(252,129,74,0.15)', color:'#fc814a', border:'rgba(252,129,74,0.3)' },
    }[status] || { bg:'rgba(99,179,237,0.15)', color:'#63b3ed', border:'rgba(99,179,237,0.3)' };

    const e = React.createElement;

    return e('div', {
      style: {
        fontFamily: "-apple-system,'PingFang SC',sans-serif",
        background: 'linear-gradient(150deg,#0f0c29,#1a1040,#1e1b4b)',
        borderRadius: '22px',
        overflow: 'hidden',
        maxWidth: '360px',
        width: '100%',
        margin: '0 auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        boxSizing: 'border-box',
        color: '#fff',
      }
    },

      /* 顶部彩条 */
      e('div', { style: { height:'3px', background:'linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa,#63b3ed)' } }),

      /* 主内容 */
      e('div', { style: { padding:'20px' } },

        /* 头部 */
        e('div', { style: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' } },
          e('div', null,
            date ? e('div', { style: { fontSize:'11px', color:'rgba(255,255,255,0.35)', marginBottom:'2px' } }, date) : null,
            e('div', { style: { fontSize:'15px', fontWeight:700 } }, '健康日报 📋')
          ),
          e('div', {
            style: {
              padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:600,
              background: sc.bg, color: sc.color, border:'1px solid '+sc.border,
            }
          }, status)
        ),

        /* 体重 */
        e('div', {
          style: {
            display:'flex', alignItems:'flex-end', justifyContent:'space-between',
            paddingBottom:'18px', marginBottom:'18px',
            borderBottom:'1px solid rgba(255,255,255,0.07)',
          }
        },
          e('div', { style: { display:'flex', alignItems:'baseline', gap:'6px' } },
            e('span', {
              style: {
                fontSize:'54px', fontWeight:900, lineHeight:1,
                background:'linear-gradient(135deg,#a5b4fc,#818cf8)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }
            }, weight),
            e('span', { style: { fontSize:'16px', color:'rgba(255,255,255,0.4)', paddingBottom:'8px' } }, 'kg')
          ),
          e('div', { style: { textAlign:'right', paddingBottom:'4px' } },
            e('div', { style: { fontSize:'10px', color:'rgba(255,255,255,0.3)' } }, '目标'),
            e('div', { style: { fontSize:'22px', fontWeight:700, color:'rgba(255,255,255,0.55)' } }, target+' kg')
          )
        ),

        /* AI 建议 */
        tip ? e('div', {
          style: {
            padding:'14px 16px',
            background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',
            border:'1px solid rgba(99,102,241,0.2)',
            borderRadius:'14px',
            marginBottom:'14px',
          }
        },
          e('div', { style: { fontSize:'12px', color:'rgba(255,255,255,0.75)', lineHeight:1.7 } }, '💡 '+tip)
        ) : null,

        /* 底部品牌 */
        e('div', { style: { textAlign:'right' } },
          e('span', { style: { fontSize:'10px', color:'rgba(255,255,255,0.15)', letterSpacing:'0.5px' } }, '瘦得漂亮 AI')
        )
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
