Ext.define('expand.overrides.Progress', {
  override : 'Ext.Progress',
  updateValue : function(value, oldValue) {
    var me = this,
      barEl = me.barEl,
      textTpl = me.getTextTpl();
    if (textTpl) {
      me.setText(textTpl.apply({
        value : value,
        roundPercent : Ext.util.Format.round(value * 100, 4), // 增加一个4位小数的值，否则会有误差
        percent : Math.round(value * 100)
      }));
    }
    if (me.getAnimate()) {
      barEl.stopAnimation();
      barEl.animate(Ext.apply({
        from : {
          width : (oldValue * 100) + '%'
        },
        to : {
          width : (value * 100) + '%'
        }
      }, me.animate));
    } else {
      barEl.setStyle('width', (value * 100) + '%');
    }
  }
});