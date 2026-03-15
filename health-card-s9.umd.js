(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 瘦得漂亮 AI · 健康摘要卡片（高级浅色暖调版）
   */
  function HealthCard(props) {
    props = props || {};
    const content = String(props.content || '今日健康数据已记录，继续加油 💪');

    // 固定橙色/暖色主调
    const theme = {
      bar: 'linear-gradient(90deg,#FF7A00,#FFA040)',
      accent: '#FF7A00',
      box: 'rgba(255,122,0,0.06)',
      border: 'rgba(255,122,0,0.2)'
    };

    const e = React.createElement;

    return e('div', {
      style: {
        fontFamily: "-apple-system,'PingFang SC',sans-serif",
        // 背景使用纯白+极淡暖橙色以配合UI主题
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F5 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(255,122,0,0.15)',
        boxShadow: '0 4px 16px rgba(255,122,0,0.04)',
      }
    },
      /* 顶部细彩条 */
      e('div', { style: { height: '3px', background: theme.bar } }),

      /* 内容区 */
      /* 内容区 - 底部内边距进一步缩小到6px，防平台框架撑大 */
      e('div', { style: { padding: '12px 14px 6px' } },

        /* 品牌头 */
        e('div', { style: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' } },
          e('div', {
            style: {
              width:'24px', height:'24px', borderRadius:'8px',
              background: theme.bar,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'12px', flexShrink:0,
              boxShadow: '0 2px 6px ' + theme.border
            }
          }, '✨'),
          e('div', { style: { fontSize:'13px', fontWeight:700, color: theme.accent, letterSpacing:'0.2px' } }, '瘦得漂亮摘要'),
          e('div', { style: { marginLeft:'auto', width:'6px', height:'6px', borderRadius:'50%', background: theme.accent, opacity:0.5 } })
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
        e('div', { style: { marginTop:'6px', textAlign:'right' } },
          e('span', { style: { fontSize:'10px', color:'#9CA3AF', letterSpacing:'0.5px', lineHeight: 1 } }, 'AI · 仅供参考')
        )
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
