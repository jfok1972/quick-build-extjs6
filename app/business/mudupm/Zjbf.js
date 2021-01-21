
/**
 * 资金拔付
 */
Ext.define('app.business.mudupm.Zjbf', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.businessmudupmzjbf',
  width : 36,
  text : '拔付',
  menuText : '请款金额资金拔付',
  stopSelection : false,
  items : [{
        getClass : function(v, meta, rec) {
          if (v == '未审核') {
            return 'actionyellow x-fa fa-exclamation-triangle fa-fw'; // 返回一个可以审批的class
          } else if (v == '可拔付') {
            return 'approveaction x-fa fa-pencil fa-fw'; // 返回一个可以审批的class
          } else if (v == '已拔付') { return 'actionblue x-fa fa-check fa-fw'; // 返回一个可以审批的class
          }
        },
        getTip : function(v, meta, rec) {
          return v;
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            button = grid.down('button#paymentZjbf');
          grid.getSelectionModel().select(rec);
          if (button) {
            button.fireEvent('click', button);
          }
        }
      }]
})
