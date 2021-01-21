
/**
 * 资金拔付
 */
Ext.define('app.business.mudupm.Payout', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.businessmudupmpayout',
  width : 36,
  text : '支付',
  menuText : '请款单的支付',
  stopSelection : false,
  items : [{
        getClass : function(v, meta, rec) {
          if (v == '未审核' || v == '待拔付') {
            return 'actionyellow x-fa fa-exclamation-triangle fa-fw'; // 返回一个可以审批的class
          } else if (v == '可支付') {
            return 'approveaction x-fa fa-pencil fa-fw'; // 返回一个可以审批的class
          } else if (v == '已支付') { return 'actionblue x-fa fa-check fa-fw'; // 返回一个可以审批的class
          }
        },
        getTip : function(v, meta, rec) {
          return v;
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            button = grid.down('button#paymentPayout');
          grid.getSelectionModel().select(rec);
          if (button) {
            button.fireEvent('click', button);
          }
        }
      }]
})
