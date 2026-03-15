(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 瘦得漂亮 AI · 健康摘要卡片（阳光版）
   * Props:
   *   content  - AI 生成的摘要文字（字符串）
   */
  function HealthCard(props) {
    props = props || {};
    const content = String(props.content || '今日健康数据已记录，继续加油 💪');

    // 根据内容判断情绪色调
    const isWarn    = /超标|偏高|需注意|警告|超出/.test(content);
    const isSuccess = /完美|棒|不错|达标|优秀|坚持/.test(content);
    const isPlan    = /计划|建议|方案|推荐|周期/.test(content);

    // 主题配色 - 全部使用暖色/活力色系
    const theme = isWarn
      ? { bg: 'rgba(255,243,224,0.85)', bar: 'linear-gradient(90deg,#FF8C00,#FFA500,#FFB347)', accent: '#E65100', light: 'rgba(255,248,240,0.6)', dot: '#FF8C00' }
      : isSuccess
      ? { bg: 'rgba(240,255,244,0.85)', bar: 'linear-gradient(90deg,#00C853,#69F0AE,#B9F6CA)', accent: '#00796B', light: 'rgba(240,255,246,0.6)', dot: '#00C853' }
      : isPlan
      ? { bg: 'rgba(255,248,225,0.85)', bar: 'linear-gradient(90deg,#FF6D00,#FFAB40,#FFD180)', accent: '#E65100', light: 'rgba(255,251,236,0.6)', dot: '#FF6D00' }
      : { bg: 'rgba(255,249,240,0.85)', bar: 'linear-gradient(90deg,#FF6B6B,#FF8E53,#FFAD5E)', accent: '#D84315', light: 'rgba(255,245,236,0.6)', dot: '#FF6B6B' };

    const e = React.createElement;

    return e('div', {
      style: {
        fontFamily: "-apple-system,'PingFang SC',sans-serif",
        background: theme.bg,
        borderRadius: '16px',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }
    },

      /* 顶部彩条 */
      e('div', { style: { height: '4px', background: theme.bar } }),

      /* 内容区 */
      e('div', { style: { padding: '12px 14px 10px' } },

        /* 品牌头 */
        e('div', { style: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' } },
          e('div', {
            style: {
              width: '26px', height: '26px', borderRadius: '8px',
              background: theme.bar,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', flexShrink: 0,
            }
          }, '🌟'),
          e('div', { style: { fontSize:'13px', fontWeight:700, color: theme.accent } }, '瘦得漂亮 · 健康摘要'),
          e('div', {
            style: {
              marginLeft:'auto', width:'7px', height:'7px',
              borderRadius:'50%', background: theme.dot,
            }
          })
        ),

        /* 主文字 */
        e('div', {
          style: {
            padding: '13px 15px',
            background: theme.light,
            borderLeft: '3px solid ' + theme.dot,
            borderRadius: '0 10px 10px 0',
            fontSize: '14px',
            lineHeight: 1.8,
            color: '#444',
            fontWeight: 400,
            letterSpacing: '0.3px',
            wordBreak: 'break-all',
          }
        }, content),

        /* 底部品牌 */
        e('div', { style: { marginTop:'7px', textAlign:'right' } },
          e('span', { style: { fontSize:'10px', color:'#bbb', letterSpacing:'0.5px' } }, 'AI · 仅供参考')
        )
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
