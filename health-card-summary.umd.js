(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 瘦得漂亮 AI · 摘要卡片
   * 只需一个字段：content（LLM3 的完整输出文本）
   *
   * Props:
   *   content  - AI 生成的一句精华摘要（字符串）
   */
  function HealthCard(props) {
    props = props || {};
    const content = String(props.content || '今日健康数据已记录 💪');

    // 根据内容关键词判断类型，动态调整配色
    const isDanger  = /超标|偏高|需改善|注意|警告/.test(content);
    const isSuccess = /优秀|完美|达标|坚持|棒|不错|良好/.test(content);
    const isPlan    = /计划|建议|方案|推荐|目标/.test(content);

    const theme = isDanger
      ? { a: '#fc814a', b: '#f56565', glow: 'rgba(252,129,74,0.15)' }
      : isSuccess
      ? { a: '#48c78e', b: '#38b2ac', glow: 'rgba(72,199,142,0.15)' }
      : isPlan
      ? { a: '#a78bfa', b: '#818cf8', glow: 'rgba(167,139,250,0.15)' }
      : { a: '#63b3ed', b: '#6366f1', glow: 'rgba(99,179,237,0.15)' };

    const e = React.createElement;

    return e('div', {
      style: {
        fontFamily: "-apple-system,'PingFang SC',sans-serif",
        background: 'linear-gradient(150deg,#0f0c29,#1a1040,#1e1b4b)',
        borderRadius: '20px',
        overflow: 'hidden',
        maxWidth: '360px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        color: '#fff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }
    },

      /* 顶部彩条 */
      e('div', { style: { height: '3px', background: 'linear-gradient(90deg,'+theme.a+','+theme.b+',#a78bfa)' } }),

      /* 内容区 */
      e('div', { style: { padding: '20px' } },

        /* 品牌头 */
        e('div', { style: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' } },
          e('div', {
            style: {
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg,'+theme.a+','+theme.b+')',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }
          }, '✦'),
          e('div', { style: { fontSize:'13px', fontWeight:600, color:'rgba(255,255,255,0.7)' } }, '瘦得漂亮 · 健康摘要'),
        ),

        /* 主内容 */
        e('div', {
          style: {
            padding: '16px 18px',
            background: theme.glow,
            border: '1px solid '+theme.a.replace(')', ', 0.25)').replace('rgb', 'rgba'),
            borderRadius: '14px',
            lineHeight: 1.75,
            fontSize: '14px',
            color: '#f0f0f5',
            letterSpacing: '0.2px',
            wordBreak: 'break-all',
          }
        }, content),

        /* 底部 */
        e('div', { style: { marginTop: '14px', display:'flex', justifyContent:'flex-end' } },
          e('span', { style: { fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.5px' } }, 'AI · 仅供参考')
        )
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
