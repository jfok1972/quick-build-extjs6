
/**
 * 请款单制作
 */
Ext.define('app.business.mudupm.AgreementPayment', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.businessmudupmagreementpayment',
  width : 36,
  text : '可请款',
  menuText : '请款单的制作',
  stopSelection : false,
  items : [{
        getClass : function(v, meta, rec) {
          if (v == '是') {
            return 'actionyellow x-fa fa-exclamation-triangle fa-fw';
          } else {
            return '';
          }
        },
        getTip : function(v, meta, rec) {
          if (v == '是') { return '最大可请款金额: ' + Ext.util.Format.number(rec.get('paymentAllowAmount'), '0,000.00 元'); }
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            button = grid.down('button#AgreementPayment');
          grid.getSelectionModel().select(rec);
          if (button) {
            button.fireEvent('click', button);
          }
        }
      }]
})
