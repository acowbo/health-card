(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HealthCard = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function HealthCard(props) {
    props = props || {};
    return React.createElement('div', {
      style: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        maxWidth: '320px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }
    },
      React.createElement('div', { style: { fontSize: '14px', opacity: 0.7, marginBottom: '8px' } }, '✅ 卡片加载成功'),
      React.createElement('div', { style: { fontSize: '36px', fontWeight: 800, margin: '8px 0' } },
        (props.weight || '68.5') + ' kg'
      ),
      React.createElement('div', { style: { fontSize: '13px', opacity: 0.7 } },
        '目标 ' + (props.targetWeight || '62') + ' kg'
      ),
      React.createElement('div', {
        style: {
          marginTop: '16px', padding: '10px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '10px', fontSize: '12px',
        }
      }, props.tip || '今日状态良好，继续保持！')
    );
  }

  exports.HealthCard = HealthCard;

}));
