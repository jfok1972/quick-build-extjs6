
/**
 * 合同状态
 */
Ext.define('app.business.finance.liabilityStatusColumn', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.liabilityStatusColumn',
  width : 36,
  menuText : '合同当前状态',
  stopSelection : false,
  initComponent : function() {
    var me = this;
    me.text = '状<br/>态';
    me.filter = {
      type : 'list',
      options : ['未提款', '还款中', '已完成'],
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
          if (v == '未提款') {
            return 'actionyellow x-fa fa-exclamation-triangle fa-fw';
          } else if (v == '还款中') {
            return 'approveaction x-fa fa-bolt fa-fw';
          } else if (v == '已完成') { return 'actionblue x-fa fa-check fa-fw'; }
        },
        getTip : function(v, meta, rec) {
          return v;
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            button = grid.down('button#planReturn');
          grid.getSelectionModel().select(rec);
          if (button) {
            button.fireEvent('click', button);
          }
        }
      }]
})
