
/**
 * 合同可操作的状态状态，当计划和提款不符，有需要还本，和付息的记录时，显示感叹号
 */
Ext.define('app.business.finance.liabilityCanDoColumn', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.liabilitycandocolumn',
  width : 36,
  menuText : '合同待操作提示说明',
  stopSelection : false,
  initComponent : function() {
    var me = this;
    me.text = '提<br/>示';
    me.sortable = false;
    me.align = 'start';
    me.menuDisabled = true;
    me.callParent();
  },
  items : [{
    getClass : function(v, meta, rec) {
      if (rec.get('tfAmount') != rec.get('tfAlreadyplan') || rec.get('allowPayoutPlanCount') > 0
          || rec.get('allowPayoutRateCount') > 0 || (rec.get('detailNotRatePlanCount') > 0)) {
        return 'actionyellow x-fa fa-exclamation-circle fa-fw';
      } else return null;
    },
    getTip : function(v, meta, rec) {
      var tip = '';
      if (rec.get('tfAmount') != rec.get('tfAlreadyplan')) {
        tip += '还本计划总额与实际提款不符<br/>'
      }
      if (rec.get('allowPayoutPlanCount') > 0) {
        tip += '有还本计划需要支付<br/>'
      }
      if (rec.get('allowPayoutRateCount') > 0) {
        tip += '有付息计划需要支付<br/>'
      }
      if (rec.get('detailNotRatePlanCount') > 0){
        tip += '有举借需要制订付息计划<br/>'
      }
      if (tip) return tip
      else return null;
    }
  }]
})
