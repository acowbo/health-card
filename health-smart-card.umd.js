(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthSmartCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  /**
   * 瘦得漂亮 AI · 万能健康卡片 v4
   *
   * 通过 type 字段自动切换卡片类型：
   *   "daily"  - 单日打卡（体重+饮食+运动+反馈）
   *   "trend"  - 多日趋势分析（折线图+综合点评）
   *   "plan"   - 个性化方案（热量目标+三餐+运动推荐）
   *
   * 不传 type 时自动推断：有 days 数组→trend，有 meals→plan，否则→daily
   */

  const e = React.createElement;

  // ── 工具函数 ─────────────────────────────────────────
  function safe(v, fallback) {
    if (v === null || v === undefined || v === 'null' || v === 'undefined' || v === '') return fallback;
    return v;
  }
  function num(v) {
    var n = Number(v);
    return isNaN(n) ? null : n;
  }
  function inferType(p) {
    if (p.type === 'daily' || p.type === 'trend' || p.type === 'plan') return p.type;
    if (Array.isArray(p.days) && p.days.length > 0) return 'trend';
    if (p.meals || p.dailyCalorieGoal || p.exercisePlan) return 'plan';
    return 'daily';
  }

  // ── 主题 ─────────────────────────────────────────────
  var themes = {
    great: { bar: '#10B981,#34D399', accent: '#059669', soft: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.18)', tagBg: 'rgba(16,185,129,0.1)', tagText: '#047857', icon: '\u{1F31F}' },
    warn:  { bar: '#F97316,#FB923C', accent: '#EA580C', soft: 'rgba(249,115,22,0.07)', border: 'rgba(249,115,22,0.18)', tagBg: 'rgba(249,115,22,0.1)', tagText: '#C2410C', icon: '\u26A1' },
    good:  { bar: '#F43F5E,#FB7185,#FDA4AF', accent: '#E11D48', soft: 'rgba(244,63,94,0.05)', border: 'rgba(244,63,94,0.15)', tagBg: 'rgba(244,63,94,0.08)', tagText: '#BE123C', icon: '\u{1F4AA}' },
    plan:  { bar: '#8B5CF6,#A78BFA', accent: '#7C3AED', soft: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.18)', tagBg: 'rgba(139,92,246,0.1)', tagText: '#6D28D9', icon: '\u{1F4CB}' },
    trend: { bar: '#3B82F6,#60A5FA', accent: '#2563EB', soft: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.18)', tagBg: 'rgba(59,130,246,0.1)', tagText: '#1D4ED8', icon: '\u{1F4C8}' },
  };

  function getTheme(type, status) {
    if (type === 'plan') return themes.plan;
    if (type === 'trend') return themes.trend;
    if (status && themes[status]) return themes[status];
    return themes.good;
  }

  // ── 通用组件 ─────────────────────────────────────────
  function Wrap(t, title, date, children) {
    return e('div', { style: { fontFamily: "-apple-system,'PingFang SC',sans-serif", marginBottom: '-30px', width: '100%', boxSizing: 'border-box' } },
      e('div', { style: { background: 'linear-gradient(135deg,#FFFFFF 0%,#FFF9F5 100%)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,122,0,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' } },
        e('div', { style: { height: '3px', background: 'linear-gradient(90deg,' + t.bar + ')' } }),
        e('div', { style: { padding: '14px 14px 12px' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' } },
            e('div', { style: { width: '26px', height: '26px', borderRadius: '8px', background: 'linear-gradient(90deg,' + t.bar + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 } }, t.icon),
            e('div', { style: { fontSize: '13px', fontWeight: 700, color: t.accent } }, title),
            date ? e('div', { style: { marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF' } }, date) : null
          ),
          children,
          e('div', { style: { marginTop: '10px', textAlign: 'right' } },
            e('span', { style: { fontSize: '10px', color: '#9CA3AF' } }, 'AI \xB7 \u4EC5\u4F9B\u53C2\u8003')
          )
        )
      )
    );
  }

  function Card(t, icon, label, children, extra) {
    return e('div', { style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
        e('div', { style: { fontSize: '22px', flexShrink: 0, lineHeight: 1 } }, icon),
        e('div', { style: { flex: 1, minWidth: 0 } },
          e('div', { style: { fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' } }, label),
          children
        ),
        extra || null
      )
    );
  }

  function Feedback(t, text) {
    if (!text) return null;
    return e('div', { style: { marginTop: '6px', padding: '10px 14px', background: t.tagBg, borderRadius: '10px', fontSize: '13px', color: t.tagText, fontWeight: 500, lineHeight: 1.6 } }, '\u{1F4AC} ' + text);
  }

  function ProgressBar(pct, over) {
    var fill = over ? 'linear-gradient(90deg,#F97316,#EF4444)' : 'linear-gradient(90deg,#63b3ed,#9f7aea)';
    return e('div', { style: { marginTop: '8px' } },
      e('div', { style: { height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' } },
        e('div', { style: { height: '100%', width: Math.min(pct, 100) + '%', background: fill, borderRadius: '4px' } })
      )
    );
  }

  // ── 单日打卡卡片 ─────────────────────────────────────
  function DailyCard(props) {
    var t = getTheme('daily', props.status);
    var weight = safe(props.weight, null);
    var weightChange = num(safe(props.weightChange, null));
    var calIn = num(safe(props.caloriesIn, null));
    var calOut = num(safe(props.caloriesOut, null));
    var calGoal = num(safe(props.calorieGoal, 1650));
    var food = safe(props.food, null);
    var exercise = safe(props.exercise, null);
    var feedback = safe(props.feedback, null);

    var calNet = (calIn !== null && calOut !== null) ? calIn - calOut : null;
    var calPct = calIn !== null ? (calIn / calGoal) * 100 : 0;
    var calOver = calIn !== null && calIn > calGoal;

    function weightTag() {
      if (weightChange === null) return null;
      if (weightChange < 0) return e('span', { style: { fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#047857', fontWeight: 600 } }, '\u2193 ' + Math.abs(weightChange) + ' kg');
      if (weightChange > 0) return e('span', { style: { fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(249,115,22,0.1)', color: '#C2410C', fontWeight: 600 } }, '\u2191 ' + weightChange + ' kg');
      return e('span', { style: { fontSize: '12px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)', color: '#6B7280', fontWeight: 600 } }, '\u6301\u5E73');
    }

    var items = [];

    // 体重
    if (weight) {
      items.push(Card(t, '\u2696\uFE0F', '\u4ECA\u65E5\u4F53\u91CD',
        e('div', { style: { display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' } },
          e('span', { style: { fontSize: '22px', fontWeight: 800, color: '#1F2937' } }, weight),
          e('span', { style: { fontSize: '12px', color: '#9CA3AF' } }, 'kg'),
          weightTag()
        )
      ));
    }

    // 热量
    if (calIn !== null) {
      items.push(e('div', { key: 'cal', style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          e('div', { style: { fontSize: '22px', flexShrink: 0, lineHeight: 1 } }, '\u{1F37D}\uFE0F'),
          e('div', { style: { flex: 1, minWidth: 0 } },
            e('div', { style: { fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' } }, '\u70ED\u91CF\u6536\u652F'),
            e('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
              e('span', { style: { fontSize: '13px', fontWeight: 700, color: '#F97316' } }, '\u6444\u5165 ' + calIn + ' kcal'),
              calOut !== null ? e('span', { style: { color: '#D1D5DB' } }, '\xB7') : null,
              calOut !== null ? e('span', { style: { fontSize: '13px', fontWeight: 700, color: '#10B981' } }, '\u6D88\u8017 ' + calOut + ' kcal') : null,
              calNet !== null ? e('span', { style: { fontSize: '11px', color: '#6B7280' } }, '\u51C0 ' + (calNet > 0 ? '+' : '') + calNet) : null
            ),
            food ? e('div', { style: { fontSize: '12px', color: '#6B7280', marginTop: '3px' } }, food) : null
          )
        ),
        ProgressBar(calPct, calOver),
        e('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '10px', color: '#9CA3AF' } },
          e('span', null, calOver ? '\u26A0\uFE0F \u8D85\u51FA\u76EE\u6807' : '\u4ECA\u65E5\u70ED\u91CF\u8FDB\u5EA6'),
          e('span', null, calIn + ' / ' + calGoal + ' kcal')
        )
      ));
    }

    // 运动
    if (exercise) {
      items.push(Card(t, '\u{1F3C3}', '\u4ECA\u65E5\u8FD0\u52A8',
        e('div', { style: { fontSize: '14px', fontWeight: 600, color: '#1F2937' } }, exercise),
        calOut !== null ? e('div', { style: { fontSize: '13px', fontWeight: 700, color: '#10B981', flexShrink: 0 } }, calOut + ' kcal') : null
      ));
    }

    // 无数据引导
    if (items.length === 0) {
      items.push(e('div', { key: 'empty', style: { padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' } }, '\u6682\u65E0\u6570\u636E\uFF0C\u8BF7\u544A\u8BC9\u6211\u4ECA\u5929\u7684\u4F53\u91CD\u3001\u996E\u98DF\u6216\u8FD0\u52A8\u60C5\u51B5~'));
    }

    items.push(Feedback(t, feedback));

    return Wrap(t, '\u4ECA\u65E5\u5065\u5EB7\u6253\u5361', safe(props.date, ''), items);
  }

  // ── 趋势分析卡片 ─────────────────────────────────────
  function SvgLine(points, color, w, h) {
    if (!points || points.length < 2) return null;
    var vals = points.map(function(p) { return num(p.value); }).filter(function(v) { return v !== null; });
    if (vals.length < 2) return null;
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var range = max - min || 1;
    var padY = 20;
    var padX = 10;
    var innerW = w - padX * 2;
    var innerH = h - padY * 2;

    var coords = vals.map(function(v, i) {
      var x = padX + (i / (vals.length - 1)) * innerW;
      var y = padY + innerH - ((v - min) / range) * innerH;
      return { x: x, y: y, v: v };
    });

    var pathD = coords.map(function(c, i) { return (i === 0 ? 'M' : 'L') + c.x.toFixed(1) + ',' + c.y.toFixed(1); }).join(' ');

    var dots = coords.map(function(c, i) {
      return e('circle', { key: 'd' + i, cx: c.x, cy: c.y, r: 3, fill: color, stroke: '#fff', strokeWidth: 1.5 });
    });

    var labels = coords.map(function(c, i) {
      return e('text', { key: 't' + i, x: c.x, y: c.y - 8, textAnchor: 'middle', fontSize: '9', fill: '#6B7280', fontWeight: 600 }, c.v);
    });

    var dateLabels = points.map(function(p, i) {
      if (i >= coords.length) return null;
      return e('text', { key: 'dl' + i, x: coords[i].x, y: h - 4, textAnchor: 'middle', fontSize: '8', fill: '#9CA3AF' }, safe(p.date, ''));
    });

    return e('svg', { width: '100%', height: h, viewBox: '0 0 ' + w + ' ' + h, style: { display: 'block' } },
      e('path', { d: pathD, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      dots,
      labels,
      dateLabels
    );
  }

  function TrendCard(props) {
    var t = getTheme('trend');
    var days = Array.isArray(props.days) ? props.days : [];
    var feedback = safe(props.feedback, null);
    var summary = safe(props.summary, null);
    var goalRate = safe(props.goalRate, null);

    var items = [];

    // 体重趋势
    var weightPts = days.filter(function(d) { return num(d.weight) !== null; }).map(function(d) { return { date: d.date, value: num(d.weight) }; });
    if (weightPts.length >= 2) {
      var first = weightPts[0].value;
      var last = weightPts[weightPts.length - 1].value;
      var diff = (last - first).toFixed(1);
      var diffLabel = diff > 0 ? '+' + diff + ' kg' : diff + ' kg';
      var diffColor = diff <= 0 ? '#10B981' : '#F97316';

      items.push(e('div', { key: 'wt', style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            e('span', { style: { fontSize: '18px' } }, '\u2696\uFE0F'),
            e('span', { style: { fontSize: '12px', fontWeight: 600, color: '#374151' } }, '\u4F53\u91CD\u8D8B\u52BF')
          ),
          e('span', { style: { fontSize: '12px', fontWeight: 700, color: diffColor, padding: '2px 8px', borderRadius: '10px', background: diff <= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(249,115,22,0.1)' } }, diffLabel)
        ),
        SvgLine(weightPts, '#3B82F6', 300, 100)
      ));
    }

    // 热量趋势
    var calInPts = days.filter(function(d) { return num(d.caloriesIn) !== null; }).map(function(d) { return { date: d.date, value: num(d.caloriesIn) }; });
    var calOutPts = days.filter(function(d) { return num(d.caloriesOut) !== null; }).map(function(d) { return { date: d.date, value: num(d.caloriesOut) }; });

    if (calInPts.length >= 2) {
      items.push(e('div', { key: 'ct', style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' } },
          e('span', { style: { fontSize: '18px' } }, '\u{1F525}'),
          e('span', { style: { fontSize: '12px', fontWeight: 600, color: '#374151' } }, '\u70ED\u91CF\u8D8B\u52BF'),
          e('span', { style: { fontSize: '10px', color: '#F97316', marginLeft: '4px' } }, '\u25CF \u6444\u5165'),
          calOutPts.length >= 2 ? e('span', { style: { fontSize: '10px', color: '#10B981', marginLeft: '4px' } }, '\u25CF \u6D88\u8017') : null
        ),
        SvgLine(calInPts, '#F97316', 300, 90),
        calOutPts.length >= 2 ? e('div', { style: { marginTop: '4px' } }, SvgLine(calOutPts, '#10B981', 300, 90)) : null
      ));
    }

    // 目标达成率
    if (goalRate !== null) {
      var rate = num(goalRate);
      items.push(e('div', { key: 'gr', style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' } },
          e('span', { style: { fontSize: '18px' } }, '\u{1F3AF}'),
          e('span', { style: { fontSize: '12px', fontWeight: 600, color: '#374151' } }, '\u76EE\u6807\u8FBE\u6210\u7387'),
          e('span', { style: { marginLeft: 'auto', fontSize: '16px', fontWeight: 800, color: t.accent } }, (rate || 0) + '%')
        ),
        ProgressBar(rate || 0, false)
      ));
    }

    // 综合点评
    if (summary) {
      items.push(e('div', { key: 'sum', style: { padding: '10px 14px', background: t.tagBg, borderRadius: '10px', fontSize: '13px', color: t.tagText, fontWeight: 500, lineHeight: 1.6, marginBottom: '8px' } }, '\u{1F4DD} ' + summary));
    }

    if (items.length === 0) {
      items.push(e('div', { key: 'empty', style: { padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' } }, '\u6682\u65E0\u8D8B\u52BF\u6570\u636E\uFF0C\u8BF7\u63D0\u4F9B\u591A\u5929\u7684\u5065\u5EB7\u6570\u636E~'));
    }

    items.push(Feedback(t, feedback));

    return Wrap(t, '\u5065\u5EB7\u8D8B\u52BF\u5206\u6790', safe(props.dateRange, ''), items);
  }

  // ── 个性化方案卡片 ─────────────────────────────────────
  function PlanCard(props) {
    var t = getTheme('plan');
    var dailyCalorieGoal = num(safe(props.dailyCalorieGoal, null));
    var meals = safe(props.meals, null); // { breakfast, lunch, dinner, snack }
    var macros = safe(props.macros, null); // { protein, carbs, fat }
    var exercisePlan = safe(props.exercisePlan, null);
    var exerciseType = safe(props.exerciseType, null);
    var duration = safe(props.duration, null);
    var targetWeight = safe(props.targetWeight, null);
    var currentWeight = safe(props.currentWeight, null);
    var estimatedWeeks = safe(props.estimatedWeeks, null);
    var feedback = safe(props.feedback, null);

    var items = [];

    // 目标概览
    if (currentWeight || targetWeight || estimatedWeeks) {
      var goalParts = [];
      if (currentWeight) goalParts.push(e('span', { key: 'cw' }, '\u5F53\u524D ' + currentWeight + ' kg'));
      if (targetWeight) goalParts.push(e('span', { key: 'tw' }, ' \u2192 \u76EE\u6807 ' + targetWeight + ' kg'));
      if (estimatedWeeks) goalParts.push(e('span', { key: 'ew', style: { color: t.accent, fontWeight: 700 } }, ' \u00B7 \u7EA6 ' + estimatedWeeks + ' \u5468'));

      items.push(Card(t, '\u{1F3AF}', '\u76EE\u6807\u6982\u89C8',
        e('div', { style: { fontSize: '14px', fontWeight: 600, color: '#1F2937' } }, goalParts)
      ));
    }

    // 每日热量目标
    if (dailyCalorieGoal) {
      var macroBar = null;
      if (macros && typeof macros === 'object') {
        var protein = num(macros.protein) || 0;
        var carbs = num(macros.carbs) || 0;
        var fat = num(macros.fat) || 0;
        var total = protein + carbs + fat || 1;
        macroBar = e('div', { style: { marginTop: '8px' } },
          e('div', { style: { display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden' } },
            e('div', { style: { width: (protein / total * 100) + '%', background: '#3B82F6' } }),
            e('div', { style: { width: (carbs / total * 100) + '%', background: '#F59E0B' } }),
            e('div', { style: { width: (fat / total * 100) + '%', background: '#EF4444' } })
          ),
          e('div', { style: { display: 'flex', gap: '10px', marginTop: '4px', fontSize: '10px', color: '#6B7280' } },
            e('span', null, '\u{1F535} \u86CB\u767D ' + protein + 'g'),
            e('span', null, '\u{1F7E1} \u78B3\u6C34 ' + carbs + 'g'),
            e('span', null, '\u{1F534} \u8102\u80AA ' + fat + 'g')
          )
        );
      }

      items.push(e('div', { key: 'calgoal', style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
        e('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          e('div', { style: { fontSize: '22px', flexShrink: 0, lineHeight: 1 } }, '\u{1F525}'),
          e('div', { style: { flex: 1 } },
            e('div', { style: { fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' } }, '\u6BCF\u65E5\u70ED\u91CF\u76EE\u6807'),
            e('div', { style: { fontSize: '20px', fontWeight: 800, color: '#1F2937' } }, dailyCalorieGoal + ' kcal')
          )
        ),
        macroBar
      ));
    }

    // 三餐建议
    if (meals && typeof meals === 'object') {
      var mealIcons = { breakfast: '\u{1F373}', lunch: '\u{1F35A}', dinner: '\u{1F957}', snack: '\u{1F34E}' };
      var mealNames = { breakfast: '\u65E9\u9910', lunch: '\u5348\u9910', dinner: '\u665A\u9910', snack: '\u52A0\u9910' };
      var mealItems = [];
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach(function(key) {
        if (meals[key]) {
          mealItems.push(
            e('div', { key: key, style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: key !== 'snack' ? '1px solid rgba(0,0,0,0.04)' : 'none' } },
              e('span', { style: { fontSize: '16px' } }, mealIcons[key] || '\u{1F37D}'),
              e('span', { style: { fontSize: '12px', fontWeight: 600, color: '#374151', width: '32px' } }, mealNames[key] || key),
              e('span', { style: { fontSize: '12px', color: '#6B7280', flex: 1 } }, meals[key])
            )
          );
        }
      });

      if (mealItems.length > 0) {
        items.push(e('div', { key: 'meals', style: { padding: '10px 12px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', marginBottom: '8px' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' } },
            e('span', { style: { fontSize: '18px' } }, '\u{1F37D}\uFE0F'),
            e('span', { style: { fontSize: '12px', fontWeight: 600, color: '#374151' } }, '\u4E09\u9910\u642D\u914D\u5EFA\u8BAE')
          ),
          mealItems
        ));
      }
    }

    // 运动推荐
    if (exercisePlan || exerciseType) {
      items.push(Card(t, '\u{1F3CB}\uFE0F', '\u8FD0\u52A8\u63A8\u8350',
        e('div', null,
          e('div', { style: { fontSize: '14px', fontWeight: 600, color: '#1F2937' } }, exerciseType || exercisePlan),
          duration ? e('div', { style: { fontSize: '12px', color: '#6B7280', marginTop: '2px' } }, '\u5EFA\u8BAE\u65F6\u957F\uFF1A' + duration) : null,
          exercisePlan && exerciseType ? e('div', { style: { fontSize: '12px', color: '#6B7280', marginTop: '2px' } }, exercisePlan) : null
        )
      ));
    }

    if (items.length === 0) {
      items.push(e('div', { key: 'empty', style: { padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' } }, '\u8BF7\u63D0\u4F9B\u4F53\u91CD\u3001\u8EAB\u9AD8\u3001\u76EE\u6807\u4F53\u91CD\u7B49\u4FE1\u606F\uFF0C\u6211\u6765\u5236\u5B9A\u4E13\u5C5E\u65B9\u6848~'));
    }

    items.push(Feedback(t, feedback));

    return Wrap(t, '\u4E2A\u6027\u5316\u5065\u5EB7\u65B9\u6848', safe(props.date, ''), items);
  }

  // ── 纯文字兜底卡片 ─────────────────────────────────────
  function FallbackCard(props) {
    var content = safe(props.content, null) || safe(props.feedback, null) || safe(props.summary, null);
    if (!content) content = '\u6682\u65E0\u5185\u5BB9\uFF0C\u8BF7\u544A\u8BC9\u6211\u4F60\u7684\u5065\u5EB7\u6570\u636E\u6216\u76EE\u6807\u5427~';

    // 根据内容关键词推断主题
    var isSuccess = /完美|棒|不错|达标|优秀|坚持|良好/.test(content);
    var isWarn = /超标|偏高|需注意|警告|超出/.test(content);
    var isPlan = /计划|建议|方案|推荐|目标|周期/.test(content);
    var t = isSuccess ? themes.great : isWarn ? themes.warn : isPlan ? themes.plan : themes.good;

    return e('div', { style: { fontFamily: "-apple-system,'PingFang SC',sans-serif", marginBottom: '-30px', width: '100%', boxSizing: 'border-box' } },
      e('div', { style: { background: 'linear-gradient(135deg,#FFFFFF 0%,#FFF9F5 100%)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,122,0,0.15)', boxShadow: '0 4px 16px rgba(255,122,0,0.04)' } },
        e('div', { style: { height: '3px', background: 'linear-gradient(90deg,' + t.bar + ')' } }),
        e('div', { style: { padding: '12px 14px 10px' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' } },
            e('div', { style: { width: '24px', height: '24px', borderRadius: '8px', background: 'linear-gradient(90deg,' + t.bar + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 } }, '\u2728'),
            e('div', { style: { fontSize: '13px', fontWeight: 700, color: t.accent } }, '\u7626\u5F97\u6F02\u4EAE\u6478\u8981')
          ),
          e('div', { style: { padding: '12px 14px', background: t.soft, border: '1px solid ' + t.border, borderRadius: '10px', fontSize: '14px', lineHeight: 1.75, color: '#374151', wordBreak: 'break-all' } }, content),
          e('div', { style: { marginTop: '8px', textAlign: 'right' } },
            e('span', { style: { fontSize: '10px', color: '#9CA3AF' } }, 'AI \xB7 \u4EC5\u4F9B\u53C2\u8003')
          )
        )
      )
    );
  }

  // ── 判断是否有有效结构化数据 ────────────────────────────
  function hasStructuredData(p) {
    if (Array.isArray(p.days) && p.days.length > 0) return true;
    if (p.meals || p.dailyCalorieGoal || p.exercisePlan) return true;
    if (safe(p.weight, null)) return true;
    if (num(safe(p.caloriesIn, null)) !== null) return true;
    if (safe(p.exercise, null)) return true;
    return false;
  }

  // ── 主入口 ───────────────────────────────────────────
  function HealthSmartCard(props) {
    props = props || {};

    // 平台传入 { content: "..." }，尝试解析 content 为 JSON
    var data = props;
    if (typeof props.content === 'string') {
      var raw = props.content.trim();
      // 尝试 JSON 解析
      if (raw.charAt(0) === '{') {
        try {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            data = parsed;
          }
        } catch (err) {
          // 解析失败，当纯文字处理
        }
      }
    }

    // 没有任何结构化数据 → 兜底纯文字卡片
    if (!hasStructuredData(data)) {
      return FallbackCard(data.content ? data : props);
    }

    var type = inferType(data);
    if (type === 'trend') return TrendCard(data);
    if (type === 'plan') return PlanCard(data);
    return DailyCard(data);
  }

  exports.HealthSmartCard = HealthSmartCard;

}));
