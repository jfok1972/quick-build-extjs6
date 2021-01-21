
/**
 * 付息计划状态
 */
Ext.define('app.business.finance.rateReturnStatusColumn', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.rateReturnStatusColumn',
  width : 36,
  menuText : '合同付息计划的支付',
  stopSelection : false,
  initComponent : function() {
    var me = this;
    me.text = '支<br/>付';
    me.filter = {
      type : 'list',
      options : ['可支付', '不可支付', '已支付完成'],
      serializer : function(filter) {
        var result = {
          operator : filter.operator,
          value : filter.value,
          property : filter.property
        }
        if (Ext.isArray(filter.value)) {
          result.value = filter.value.join(',');
        }
        return result;
      }
    }
    me.callParent();
  },
  items : [{
        getClass : function(v, meta, rec) {
          if (v == '不可支付') {
            return 'actionyellow x-fa fa-exclamation-triangle fa-fw'; // 返回一个可以审批的class
          } else if (v == '可支付') {
            return 'approveaction x-fa fa-jpy fa-fw'; // 返回一个可以审批的class
          } else if (v == '已支付完成') { return 'actionblue x-fa fa-check fa-fw'; // 返回一个可以审批的class
          }
        },
        getTip : function(v, meta, rec) {
          return v;
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            button = grid.down('button#rateReturn');
          grid.getSelectionModel().select(rec);
          if (button) {
            button.fireEvent('click', button);
          }
        }
      }]
})
