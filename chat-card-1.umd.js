(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ChatCard = {}, global.React));
})(this, (function (exports, React) {
  'use strict';

  /**
   * 瘦得漂亮 AI · 文字回复卡片
   * Props: { content: "回复文字" }
   * 平台传入 { content: "..." }，支持纯文字或 JSON.content
   */

  var e = React.createElement;

  function safe(v, fallback) {
    if (v === null || v === undefined || v === 'null' || v === '') return fallback;
    return v;
  }

  function ChatCard(props) {
    props = props || {};

    // 解析 content
    var content = '';
    if (typeof props.content === 'string') {
      var raw = props.content.trim();
      // 去除 markdown 代码块
      var mdMatch = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
      if (mdMatch) raw = mdMatch[1].trim();
      // 尝试 JSON 解析取 content 字段
      if (raw.charAt(0) === '{') {
        try {
          var parsed = JSON.parse(raw);
          content = safe(parsed.content, raw);
        } catch (err) {
          content = raw;
        }
      } else {
        content = raw;
      }
    }
    if (!content) content = '\u6211\u5728\uFF0C\u6709\u4EC0\u4E48\u6211\u53EF\u4EE5\u5E2E\u5230\u4F60\uFF1F';

    // 根据内容关键词推断主题色
    var isSuccess = /完美|棒|不错|达标|优秀|坚持|良好|减脂|健康/.test(content);
    var isWarn = /超标|偏高|注意|警告|风险|就医/.test(content);
    var isPlan = /计划|建议|方案|推荐|目标|步骤/.test(content);

    var accent = isSuccess ? '#059669' : isWarn ? '#EA580C' : isPlan ? '#7C3AED' : '#E11D48';
    var bar = isSuccess ? '#10B981,#34D399' : isWarn ? '#F97316,#FB923C' : isPlan ? '#8B5CF6,#A78BFA' : '#F43F5E,#FB7185,#FDA4AF';
    var soft = isSuccess ? 'rgba(16,185,129,0.06)' : isWarn ? 'rgba(249,115,22,0.06)' : isPlan ? 'rgba(139,92,246,0.06)' : 'rgba(244,63,94,0.04)';
    var border = isSuccess ? 'rgba(16,185,129,0.15)' : isWarn ? 'rgba(249,115,22,0.15)' : isPlan ? 'rgba(139,92,246,0.15)' : 'rgba(244,63,94,0.12)';

    // 段落分割
    var paragraphs = content.split(/\n+/).filter(function (p) { return p.trim(); });

    return e('div', {
      style: {
        fontFamily: "-apple-system,'PingFang SC',sans-serif",
        marginBottom: '-30px',
        width: '100%',
        boxSizing: 'border-box',
      }
    },
      e('div', {
        style: {
          background: 'linear-gradient(135deg,#FFFFFF 0%,#F9FFFE 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid ' + border,
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }
      },

        // 顶部彩条
        e('div', { style: { height: '3px', background: 'linear-gradient(90deg,' + bar + ')' } }),

        e('div', { style: { padding: '14px 14px 12px' } },

          // 品牌头
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' } },
            e('div', {
              style: {
                width: '28px', height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg,' + bar + ')',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0,
              }
            }, '\uD83E\uDD65'),
            e('div', { style: {} },
              e('div', { style: { fontSize: '13px', fontWeight: 700, color: accent, lineHeight: 1.2 } }, '\u5065\u5EB7\u53C2\u8C0B'),
              e('div', { style: { fontSize: '10px', color: '#9CA3AF', marginTop: '1px' } }, '\u7626\u5F97\u6F02\u4EAE AI')
            )
          ),

          // 内容区
          e('div', {
            style: {
              background: soft,
              border: '1px solid ' + border,
              borderRadius: '12px',
              padding: '12px 14px',
            }
          },
            paragraphs.map(function (p, i) {
              return e('div', {
                key: i,
                style: {
                  fontSize: '14px',
                  lineHeight: 1.8,
                  color: '#374151',
                  marginBottom: i < paragraphs.length - 1 ? '8px' : 0,
                }
              }, p.trim());
            })
          ),

          // 底部引导
          e('div', {
            style: {
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }
          },
            e('div', {
              style: {
                width: '4px', height: '4px',
                borderRadius: '50%',
                background: accent,
                opacity: 0.5,
              }
            }),
            e('div', {
              style: {
                width: '4px', height: '4px',
                borderRadius: '50%',
                background: accent,
                opacity: 0.3,
              }
            }),
            e('div', {
              style: {
                width: '4px', height: '4px',
                borderRadius: '50%',
                background: accent,
                opacity: 0.15,
              }
            }),
            e('span', {
              style: {
                fontSize: '11px',
                color: '#9CA3AF',
                marginLeft: '4px',
              }
            }, '\u6709\u4EFB\u4F55\u95EE\u9898\u90FD\u53EF\u4EE5\u7EE7\u7EED\u544A\u8BC9\u6211~')
          )
        )
      )
    );
  }

  exports.ChatCard = ChatCard;

}));
