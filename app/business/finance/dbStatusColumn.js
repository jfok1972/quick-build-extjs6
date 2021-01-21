
/**
 * 担保状态
 */
Ext.define('app.business.finance.dbStatusColumn', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.dbStatusColumn',
  width : 36,
  menuText : '担保状态',
  stopSelection : false,
  initComponent : function() {
    var me = this;
    me.text = '状<br/>态';
    me.filter = {
      type : 'list',
      options : ['担保中', '已到期'],
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
          if (v == '担保中') return 'approveaction x-fa fa-bolt fa-fw'; // 返回一个可以审批的class
          return 'actionblue x-fa fa-check fa-fw'; // 返回一个可以审批的class
        },
        getTip : function(v, meta, rec) {
          return v;
        }
      }]
})
