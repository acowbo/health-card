(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) {
  'use strict';

  /**
   * 瘦得漂亮 AI · 健康摘要卡片（高度修复版）
   */
  function HealthCard(props) {
    props = props || {};
    const content = String(props.content || '今日健康数据已记录，继续加油 💪');

    const isSuccess = /完美|棒|不错|达标|优秀|坚持/.test(content);
    const isWarn = /超标|偏高|需注意|警告|超出/.test(content);
    const isPlan = /计划|建议|方案|推荐|周期/.test(content);

    // 浅色质感多主题
    const theme = isSuccess
      ? { bar: 'linear-gradient(90deg,#10B981,#34D399)', accent: '#059669', box: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' }
      : isWarn
        ? { bar: 'linear-gradient(90deg,#F97316,#FB923C)', accent: '#EA580C', box: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.2)' }
        : isPlan
          ? { bar: 'linear-gradient(90deg,#F59E0B,#FCD34D)', accent: '#D97706', box: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' }
          : { bar: 'linear-gradient(90deg,#F43F5E,#FB7185,#FDA4AF)', accent: '#E11D48', box: 'rgba(244,63,94,0.05)', border: 'rgba(244,63,94,0.18)' };

    const e = React.createElement;

    return e('div', {
      style: {
        fontFamily: "-apple-system,'PingFang SC',sans-serif",
        // 为了对抗平台底部的默认留白，使用负的外高度强制抵消。
        // 可以根据实际情况调整 -20px 或 -30px
        marginBottom: '-30px',
        width: '100%',
        boxSizing: 'border-box',
      }
    },
      /* 实际的可视卡片容器 */
      e('div', {
        style: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F5 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,122,0,0.15)',
          boxShadow: '0 4px 16px rgba(255,122,0,0.04)',
          // 这里不写高度，完全由内容撑开
        }
      },
        /* 顶部细彩条 */
        e('div', { style: { height: '3px', background: theme.bar } }),

        /* 内容区 - 底部内边距由于外层负边距，不需要压得太扁 */
        e('div', { style: { padding: '12px 14px 10px' } },

          /* 品牌头 */
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' } },
            e('div', {
              style: {
                width: '24px', height: '24px', borderRadius: '8px',
                background: theme.bar,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', flexShrink: 0,
                boxShadow: '0 2px 6px ' + theme.border
              }
            }, '✨'),
            e('div', { style: { fontSize: '13px', fontWeight: 700, color: theme.accent, letterSpacing: '0.2px' } }, '瘦得漂亮摘要'),
            e('div', { style: { marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: theme.accent, opacity: 0.5 } })
          ),

          /* 主文字区块 */
          e('div', {
            style: {
              padding: '12px 14px',
              background: theme.box,
              border: '1px solid ' + theme.border,
              borderRadius: '10px',
              fontSize: '14px',
              lineHeight: 1.75,
              color: '#374151',
              fontWeight: 400,
              letterSpacing: '0.2px',
              wordBreak: 'break-all',
            }
          }, content),

          /* 底部 */
          e('div', { style: { marginTop: '-30px', textAlign: 'right' } },
            e('span', { style: { fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.5px', lineHeight: 1 } }, 'AI · 仅供参考')
          )
        )
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
