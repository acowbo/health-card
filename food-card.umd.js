(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FoodCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 瘦得漂亮 AI · 食物识别卡片
   *
   * 平台传入 { content: "JSON字符串" }
   * JSON 结构：
   * {
   *   foods: [{ name, amount, calories }],
   *   totalCalories: 386,
   *   nutrition: { protein: "高"/"中"/"低", carbs: "高"/"中"/"低", fat: "高"/"中"/"低" },
   *   meal: "早餐"/"午餐"/"晚餐"/"加餐"（可选）
   *   feedback: "建议文字"
   * }
   */

  var e = React.createElement;

  var GREEN  = { bar: '#10B981,#34D399', accent: '#059669', light: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)', tag: 'rgba(16,185,129,0.12)', tagText: '#047857' };
  var ORANGE = { bar: '#F97316,#FB923C', accent: '#EA580C', light: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.18)', tag: 'rgba(249,115,22,0.12)', tagText: '#C2410C' };
  var BLUE   = { bar: '#3B82F6,#60A5FA', accent: '#2563EB', light: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.18)', tag: 'rgba(59,130,246,0.12)', tagText: '#1D4ED8' };

  function getTheme(totalCal) {
    if (!totalCal) return GREEN;
    if (totalCal > 800) return ORANGE;
    if (totalCal > 500) return BLUE;
    return GREEN;
  }

  function safe(v, fallback) {
    if (v === null || v === undefined || v === 'null' || v === '') return fallback;
    return v;
  }

  function NutritionBadge(label, level, colors) {
    var levelColors = {
      '高': { bg: 'rgba(249,115,22,0.1)', text: '#C2410C' },
      '中': { bg: 'rgba(59,130,246,0.1)', text: '#1D4ED8' },
      '低': { bg: 'rgba(16,185,129,0.1)', text: '#047857' },
    };
    var c = levelColors[level] || levelColors['中'];
    return e('div', {
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8px 12px',
        background: c.bg,
        borderRadius: '10px',
        flex: 1,
      }
    },
      e('div', { style: { fontSize: '13px', fontWeight: 700, color: c.text } }, level),
      e('div', { style: { fontSize: '10px', color: '#9CA3AF', marginTop: '2px' } }, label)
    );
  }

  function FoodCard(props) {
    props = props || {};

    // 解析 content 字段
    var data = {};
    if (typeof props.content === 'string') {
      var raw = props.content.trim();
      if (raw.charAt(0) === '{') {
        try { data = JSON.parse(raw); } catch (err) {}
      } else {
        // 纯文字兜底
        return e('div', { style: { fontFamily: "-apple-system,'PingFang SC',sans-serif", marginBottom: '-30px', width: '100%', boxSizing: 'border-box' } },
          e('div', { style: { background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' } },
            e('div', { style: { height: '3px', background: 'linear-gradient(90deg,#10B981,#34D399)' } }),
            e('div', { style: { padding: '14px' } },
              e('div', { style: { fontSize: '14px', lineHeight: 1.75, color: '#374151' } }, raw),
              e('div', { style: { marginTop: '8px', textAlign: 'right', fontSize: '10px', color: '#9CA3AF' } }, 'AI · 仅供参考')
            )
          )
        );
      }
    }

    var foods    = Array.isArray(data.foods) ? data.foods : [];
    var totalCal = data.totalCalories ? Number(data.totalCalories) : null;
    var nutrition = data.nutrition || {};
    var meal     = safe(data.meal, '');
    var feedback = safe(data.feedback, null);
    var t        = getTheme(totalCal);

    return e('div', { style: { fontFamily: "-apple-system,'PingFang SC',sans-serif", marginBottom: '-30px', width: '100%', boxSizing: 'border-box' } },
      e('div', { style: { background: 'linear-gradient(160deg,#f0fdf4 0%,#ffffff 60%)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 4px 20px rgba(16,185,129,0.08)' } },

        // 顶部彩条
        e('div', { style: { height: '3px', background: 'linear-gradient(90deg,' + t.bar + ')' } }),

        e('div', { style: { padding: '14px 14px 12px' } },

          // 品牌头
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' } },
            e('div', { style: { width: '28px', height: '28px', borderRadius: '10px', background: 'linear-gradient(135deg,#10B981,#34D399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, boxShadow: '0 2px 8px rgba(16,185,129,0.3)' } }, '\u{1F955}'),
            e('div', { style: { flex: 1 } },
              e('div', { style: { fontSize: '13px', fontWeight: 700, color: '#059669' } }, '\u98DF\u7269\u8BC6\u522B\u5206\u6790'),
              meal ? e('div', { style: { fontSize: '11px', color: '#9CA3AF', marginTop: '1px' } }, meal) : null
            ),
            totalCal !== null ? e('div', { style: { textAlign: 'right' } },
              e('div', { style: { fontSize: '22px', fontWeight: 800, color: t.accent, lineHeight: 1 } }, totalCal),
              e('div', { style: { fontSize: '10px', color: '#9CA3AF', marginTop: '2px' } }, 'kcal \u603B\u70ED\u91CF')
            ) : null
          ),

          // 食物列表
          foods.length > 0 ? e('div', { style: { marginBottom: '10px' } },
            e('div', { style: { fontSize: '11px', color: '#9CA3AF', marginBottom: '6px', letterSpacing: '0.5px' } }, '\u8BC6\u522B\u7ED3\u679C'),
            foods.map(function(food, i) {
              var cal = food.calories ? Number(food.calories) : null;
              var pct = (totalCal && cal) ? Math.min((cal / totalCal) * 100, 100) : 0;
              return e('div', { key: i, style: { marginBottom: i < foods.length - 1 ? '8px' : 0 } },
                e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' } },
                  e('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                    e('span', { style: { fontSize: '14px', fontWeight: 600, color: '#1F2937' } }, safe(food.name, '\u672A\u77E5\u98DF\u7269')),
                    food.amount ? e('span', { style: { fontSize: '11px', color: '#9CA3AF', background: 'rgba(0,0,0,0.04)', padding: '1px 6px', borderRadius: '6px' } }, food.amount) : null
                  ),
                  cal !== null ? e('span', { style: { fontSize: '13px', fontWeight: 700, color: t.accent } }, cal + ' kcal') : null
                ),
                totalCal ? e('div', { style: { height: '3px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', overflow: 'hidden' } },
                  e('div', { style: { height: '100%', width: pct + '%', background: 'linear-gradient(90deg,' + t.bar + ')', borderRadius: '2px' } })
                ) : null
              );
            })
          ) : null,

          // 分割线
          (foods.length > 0 && (nutrition.protein || nutrition.carbs || nutrition.fat)) ?
            e('div', { style: { height: '1px', background: 'rgba(0,0,0,0.05)', margin: '10px 0' } }) : null,

          // 营养结构
          (nutrition.protein || nutrition.carbs || nutrition.fat) ? e('div', { style: { marginBottom: '10px' } },
            e('div', { style: { fontSize: '11px', color: '#9CA3AF', marginBottom: '6px', letterSpacing: '0.5px' } }, '\u8425\u517B\u7ED3\u6784'),
            e('div', { style: { display: 'flex', gap: '8px' } },
              nutrition.protein ? NutritionBadge('\u86CB\u767D\u8D28', nutrition.protein) : null,
              nutrition.carbs   ? NutritionBadge('\u78B3\u6C34\u5316\u5408\u7269', nutrition.carbs) : null,
              nutrition.fat     ? NutritionBadge('\u8102\u80AA', nutrition.fat) : null
            )
          ) : null,

          // 建议条
          feedback ? e('div', { style: { marginTop: '10px', padding: '10px 12px', background: t.tag, border: '1px solid ' + t.border, borderRadius: '10px', fontSize: '13px', color: t.tagText, lineHeight: 1.6, fontWeight: 500 } },
            '\u{1F4AC} ' + feedback
          ) : null,

          // 底部
          e('div', { style: { marginTop: '10px', textAlign: 'right' } },
            e('span', { style: { fontSize: '10px', color: '#9CA3AF' } }, 'AI \xB7 \u70ED\u91CF\u4EC5\u4F9B\u53C2\u8003')
          )
        )
      )
    );
  }

  exports.FoodCard = FoodCard;

}));
