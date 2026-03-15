(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 瘦得漂亮 AI · 健康日报卡片 v2
   * 覆盖功能点：单日分析 / 多日趋势 / 饮食运动推荐
   * 所有 props 均为字符串，避免平台传参类型问题
   *
   * Props:
   *   date          - "2026年3月15日"
   *   weight        - "67.5"
   *   weightChange  - "↓0.3"（含方向符号）或 "+0.5"
   *   targetWeight  - "62"
   *   goalProgress  - "45% 已完成"
   *   calIn         - "1480"
   *   calOut        - "320"
   *   calNet        - "+1160" 或 "-200"
   *   exercise      - "跑步 35分钟 · 320kcal"
   *   diet          - "三餐均衡，蛋白质偏少"（可选）
   *   tip           - AI 建议文字
   *   status        - "优秀" | "良好" | "需改善"
   *   phase         - "减脂期" | "维持期" | "增肌期"（可选）
   */
  function HealthCard(props) {
    props = props || {};

    const p = {
      date:         String(props.date         || ''),
      weight:       String(props.weight       || '—'),
      weightChange: String(props.weightChange || ''),
      targetWeight: String(props.targetWeight || '—'),
      goalProgress: String(props.goalProgress || ''),
      calIn:        String(props.calIn        || ''),
      calOut:       String(props.calOut       || ''),
      calNet:       String(props.calNet       || ''),
      exercise:     String(props.exercise     || ''),
      diet:         String(props.diet         || ''),
      tip:          String(props.tip          || '今日数据已记录，加油！'),
      status:       String(props.status       || '良好'),
      phase:        String(props.phase        || ''),
    };

    // ── 状态色 ──
    const statusMap = {
      '优秀':  { bg:'rgba(72,199,142,0.15)', color:'#48c78e', border:'rgba(72,199,142,0.35)', glow:'0 0 12px rgba(72,199,142,0.25)' },
      '良好':  { bg:'rgba(99,179,237,0.15)', color:'#63b3ed', border:'rgba(99,179,237,0.35)', glow:'0 0 12px rgba(99,179,237,0.25)' },
      '需改善':{ bg:'rgba(252,129,74,0.15)', color:'#fc814a', border:'rgba(252,129,74,0.35)', glow:'0 0 12px rgba(252,129,74,0.25)' },
    };
    const sc = statusMap[p.status] || statusMap['良好'];

    // ── 净值色 ──
    const netNum    = parseFloat(p.calNet) || 0;
    const netColor  = netNum > 200 ? '#fc814a' : netNum < -50 ? '#48c78e' : '#63b3ed';

    // ── 体重变化色 ──
    const isDown    = p.weightChange.startsWith('↓') || p.weightChange.startsWith('-');
    const isUp      = p.weightChange.startsWith('↑') || (p.weightChange.startsWith('+') && p.weightChange !== '+0');
    const chgColor  = isDown ? '#48c78e' : isUp ? '#fc814a' : 'rgba(255,255,255,0.4)';

    const el = React.createElement;

    // ── 通用容器 ──
    const card = (style, ...children) => el('div', { style }, ...children);

    return card({
      fontFamily: "-apple-system,'PingFang SC','Helvetica Neue',sans-serif",
      background: 'linear-gradient(160deg,#0f0c29 0%,#1a1040 50%,#1e1b4b 100%)',
      borderRadius: '24px',
      padding: '0',
      color: '#fff',
      maxWidth: '380px',
      width: '100%',
      margin: '0 auto',
      boxSizing: 'border-box',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
      overflow: 'hidden',
      position: 'relative',
    },

      /* 顶部渐变装饰条 */
      card({ height: '3px', background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa,#63b3ed)', flexShrink: 0 }),

      /* 内容区 */
      card({ padding: '20px' },

        /* ─── 头部 ─── */
        card({ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'18px' },
          card({ flex: 1 },
            p.date ? card({ fontSize:'11px', color:'rgba(255,255,255,0.35)', marginBottom:'3px', letterSpacing:'0.5px' }, p.date) : null,
            card({ display:'flex', alignItems:'center', gap:'8px' },
              card({ fontSize:'16px', fontWeight:700, letterSpacing:'0.3px' }, '健康日报'),
              p.phase ? card({
                fontSize:'10px', padding:'2px 8px', borderRadius:'10px',
                background:'rgba(139,92,246,0.2)', color:'#a78bfa', border:'1px solid rgba(139,92,246,0.3)',
                fontWeight:500,
              }, p.phase) : null
            )
          ),
          card({
            padding:'5px 13px', borderRadius:'20px', fontSize:'12px', fontWeight:600,
            background: sc.bg, color: sc.color, border:'1px solid '+sc.border,
            boxShadow: sc.glow, flexShrink: 0,
          }, p.status)
        ),

        /* ─── 体重主区域 ─── */
        card({
          display:'flex', alignItems:'flex-end', gap:'12px',
          marginBottom:'18px', paddingBottom:'18px',
          borderBottom:'1px solid rgba(255,255,255,0.07)',
        },
          card({ flex: 1 },
            card({ display:'flex', alignItems:'baseline', gap:'6px', lineHeight:1 },
              card({
                fontSize:'52px', fontWeight:900, lineHeight:1,
                background:'linear-gradient(135deg,#a5b4fc,#818cf8,#6366f1)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                fontVariantNumeric:'tabular-nums',
              }, p.weight),
              card({ fontSize:'16px', color:'rgba(255,255,255,0.4)', paddingBottom:'8px' }, 'kg')
            ),
            p.weightChange
              ? card({ display:'flex', alignItems:'center', gap:'6px', marginTop:'6px' },
                  card({
                    fontSize:'12px', padding:'3px 10px', borderRadius:'10px', fontWeight:600,
                    background: isDown?'rgba(72,199,142,0.12)':isUp?'rgba(252,129,74,0.12)':'rgba(255,255,255,0.06)',
                    color: chgColor, border:'1px solid '+chgColor.replace(')',',0.3)').replace('rgb','rgba'),
                  }, p.weightChange+' kg')
                )
              : null
          ),
          card({ textAlign:'right' },
            card({ fontSize:'10px', color:'rgba(255,255,255,0.3)', marginBottom:'3px' }, '目标'),
            card({ fontSize:'20px', fontWeight:700, color:'rgba(255,255,255,0.6)' }, p.targetWeight),
            card({ fontSize:'10px', color:'rgba(255,255,255,0.3)' }, 'kg'),
            p.goalProgress ? card({ fontSize:'10px', color:'#a78bfa', marginTop:'4px' }, p.goalProgress) : null
          )
        ),

        /* ─── 热量区域（有数据才显示）─── */
        (p.calIn || p.calNet) ? card({ marginBottom:'14px' },
          card({ fontSize:'10px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.8px', marginBottom:'10px' }, 'CALORIE'),
          card({ display:'flex', gap:'8px' },
            /* 摄入 */
            p.calIn ? card({
              flex:1, padding:'10px 12px', borderRadius:'12px',
              background:'rgba(252,129,74,0.08)', border:'1px solid rgba(252,129,74,0.15)',
            },
              card({ fontSize:'10px', color:'rgba(252,129,74,0.7)', marginBottom:'3px' }, '摄入'),
              card({ fontSize:'18px', fontWeight:700, color:'#fc814a' }, p.calIn),
              card({ fontSize:'9px', color:'rgba(255,255,255,0.25)' }, 'kcal')
            ) : null,
            /* 消耗 */
            p.calOut ? card({
              flex:1, padding:'10px 12px', borderRadius:'12px',
              background:'rgba(72,199,142,0.08)', border:'1px solid rgba(72,199,142,0.15)',
            },
              card({ fontSize:'10px', color:'rgba(72,199,142,0.7)', marginBottom:'3px' }, '消耗'),
              card({ fontSize:'18px', fontWeight:700, color:'#48c78e' }, p.calOut),
              card({ fontSize:'9px', color:'rgba(255,255,255,0.25)' }, 'kcal')
            ) : null,
            /* 净值 */
            p.calNet ? card({
              flex:1, padding:'10px 12px', borderRadius:'12px',
              background:'rgba(99,179,237,0.08)', border:'1px solid rgba(99,179,237,0.15)',
            },
              card({ fontSize:'10px', color:'rgba(99,179,237,0.7)', marginBottom:'3px' }, '净值'),
              card({ fontSize:'18px', fontWeight:700, color: netColor }, p.calNet),
              card({ fontSize:'9px', color:'rgba(255,255,255,0.25)' }, 'kcal')
            ) : null
          )
        ) : null,

        /* ─── 运动 ─── */
        p.exercise ? card({
          display:'flex', alignItems:'center', gap:'10px',
          padding:'11px 14px', marginBottom:'14px',
          background:'rgba(255,255,255,0.04)', borderRadius:'14px',
          border:'1px solid rgba(255,255,255,0.07)',
        },
          card({ fontSize:'20px', flexShrink:0 }, '🏃'),
          card({ flex:1, fontSize:'13px', color:'rgba(255,255,255,0.75)', lineHeight:1.4 }, p.exercise)
        ) : null,

        /* ─── 饮食 ─── */
        p.diet ? card({
          display:'flex', alignItems:'center', gap:'10px',
          padding:'11px 14px', marginBottom:'14px',
          background:'rgba(255,255,255,0.04)', borderRadius:'14px',
          border:'1px solid rgba(255,255,255,0.07)',
        },
          card({ fontSize:'20px', flexShrink:0 }, '🥗'),
          card({ flex:1, fontSize:'13px', color:'rgba(255,255,255,0.75)', lineHeight:1.4 }, p.diet)
        ) : null,

        /* ─── AI 建议 ─── */
        card({
          padding:'13px 15px',
          background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))',
          border:'1px solid rgba(99,102,241,0.25)',
          borderRadius:'14px',
          marginBottom:'14px',
        },
          card({ fontSize:'12px', color:'rgba(255,255,255,0.75)', lineHeight:1.7 }, '💡 '+p.tip)
        ),

        /* ─── 底部品牌 ─── */
        card({ display:'flex', justifyContent:'flex-end' },
          card({ fontSize:'10px', color:'rgba(255,255,255,0.18)', letterSpacing:'0.5px' }, '瘦得漂亮 AI')
        )
      )
    );
  }

  exports.HealthCard = HealthCard;

}));
