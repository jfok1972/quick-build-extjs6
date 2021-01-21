Ext.define('app.view.platform.datamining.columngroup.editColumnWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.dataminingcolumngroupeditcolumnwindow',
  modal : true,
  width : 600,
  title : '修改字段属性内容',
  layout : 'fit',
  bodyPadding : '5px 5px',
  buttons : [{
        text : '保存',
        iconCls : 'x-fa fa-save',
        handler : function(button) {
          var window = button.up('window');
          window.record.set('value', window.down('[name=value]').getValue());
          window.record.set('text', window.down('[name=text]').getValue());
          window.record.set('condition', window.down('[name=condition]').getValue());
          window.close();
        }
      }],
  initComponent : function() {
    var me = this,
      record = this.record;
    me.items = [{
          xtype : 'fieldset',
          title : '字段属性',
          layout : 'form',
          defaults : {
            labelAlign : 'right'
          },
          items : [{
                xtype : 'textfield',
                fieldLabel : '显示文本',
                name : 'text',
                value : record.get('text')
              }, {
                xtype : 'textfield',
                fieldLabel : '实际值',
                name : 'value',
                value : record.get('value')
              }, {
                xtype : 'textarea',
                fieldLabel : '条件设置',
                name : 'condition',
                height : 100,
                value : record.get('condition')
              }]
        }]
    me.callParent();
  }
});
