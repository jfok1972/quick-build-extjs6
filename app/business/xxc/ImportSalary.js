
/**
 *上传薪资Excel表导入数据
 */
Ext.define('app.business.xxc.ImportSalary', {
  extend : 'Ext.window.Window',
  requires : ['app.view.platform.module.form.field.ManyToOneComboBox',
      'app.view.platform.module.form.field.ManyToOneTreePicker'],
  alias : 'widget.xxcimportsalary',
  width : 700,
  modal : true,
  iconCls : 'x-fa fa-cloud-upload',
  shadow : 'frame',
  shadowOffset : 30,
  title : '上传薪资Excel表导入数据',
  layout : 'auto',
  items : [{
        xtype : 'form',
        method : 'POST',
        buttons : [{
              text : '确定上传',
              scale : 'medium',
              iconCls : 'x-fa fa-save',
              handler : function(button) {
                var form = button.up('form');
                var window = button.up('window');
                if (!form.getForm().isValid()) {
                  EU.toastError(window.getFormError(form));
                  return;
                } else {
                  var uploadfield = form.down('filefield');
                  if (!Ext.String.endsWith(uploadfield.getValue().toLowerCase(), 'xlsx')) {
                    EU.toastWarn('请选择一个后缀名为.xlsx的Excel文件进行上传！');
                    return;
                  }
                  var firstTime = new Date();
                  form.submit({
                    timeout : 300,
                    url : 'xxc/salarygroup/upload.do',
                    waitMsg : '正在上传及处理数据，请耐心等候...<br/>(根据记录数的多少，此操作可能持续几分钟)',
                    success : function(form, action) {
                      var second = (new Date().getTime() - firstTime.getTime()) / 1000;
                      Ext.Msg.show({
                        title : '导入薪资文件成功',
                        message : action.result.msg + '<br/><br/>导入过程共用时：' + second + '秒！',
                        buttons : Ext.Msg.OK,
                        icon : Ext.Msg.INFO,
                        fn : function() {
                          window.close();
                        }
                      });
                      window.config.grid.refreshAll();
                    },
                    failure : function(form, action) {
                      var second = (new Date().getTime() - firstTime.getTime()) / 1000;
                      var msg = action.result.msg;
                      if (Ext.isArray(msg)) msg = msg.join('<br/>');
                      Ext.Msg.show({
                        title : '导入薪资文件出错',
                        message : msg + '<br/><br/>导入过程共用时：' + second + '秒！',
                        buttons : Ext.Msg.OK,
                        icon : Ext.Msg.ERROR
                      });
                    }
                  });
                }
              }
            }],
        items : [{
              xtype : 'fieldset',
              margin : '5px 5px',
              title : '基本信息',
              layout : {
                type : 'vbox',
                align : 'stretch'
              },
              defaults : {
                labelAlign : 'right',
                msgTarget : 'side'
              },
              items : [{
                    xtype : 'textfield',
                    fieldLabel : '导入说明',
                    name : 'title',
                    maxLength : 100,
                    enforceMaxLength : true,
                    emptyText : '如不填此项，则默认为上传文件表格中的第一行第一列的文字'
                  }, {
                    xtype : 'manytoonetreepicker',
                    fieldLabel : '发放部门',
                    name : 'FOrganization',
                    allowBlank : false,
                    fieldtype : 'FOrganization',
                    fieldDefine : {
                      allowParentValue : false
                    }
                  }, {
                    xtype : 'manytoonecombobox',
                    fieldLabel : '业务性质',
                    name : 'xxcGroupType',
                    fieldtype : 'XxcGroupType',
                    allowBlank : false
                  }, {
                    xtype : 'fieldcontainer',
                    layout : {
                      type : 'hbox',
                      align : 'stretch'
                    },
                    defaults : {
                      labelAlign : 'right',
                      msgTarget : 'side'
                    },
                    items : [{
                          xtype : 'numberfield',
                          fieldLabel : '薪资记录数',
                          name : 'count',
                          flex : 1,
                          unittext : '条',
                          allowBlank : false,
                          hideTrigger : true
                        }, {
                          xtype : 'moneyfield',
                          fieldLabel : '薪资金额总额',
                          decimalPrecision : 2,
                          name : 'amount',
                          flex : 1,
                          unittext : '元',
                          allowBlank : false
                        }]
                  }, {
                    xtype : 'fieldcontainer',
                    layout : {
                      type : 'hbox',
                      align : 'stretch'
                    },
                    defaults : {
                      labelAlign : 'right',
                      msgTarget : 'side'
                    },
                    items : [{
                          format : 'Y-m-d',
                          xtype : 'datefield',
                          submitFormat : 'Y-m-d',
                          fieldLabel : '薪资起始日期',
                          name : 'startDate',
                          flex : 1
                        }, {
                          format : 'Y-m-d',
                          xtype : 'datefield',
                          submitFormat : 'Y-m-d',
                          fieldLabel : '薪资终止日期',
                          name : 'endDate',
                          flex : 1
                        }]
                  }, {
                    xtype : 'filefield',
                    emptyText : '选择一个Excel文件',
                    fieldLabel : '上传的文件',
                    name : 'uploaditem',
                    buttonText : '选择上传文件',
                    allowBlank : false
                  }, {
                    xtype : 'textarea',
                    fieldLabel : '备注信息',
                    name : 'remark'
                  }]
            }]
      }],
  listeners : {
    show : function(window) {
      EU.RS({
        url : "platform/dataobject/getnewdefault.do",
        params : {
          objectname : 'XxcSalaryGroup'
        },
        target : window,
        callback : function(result) {
          var data = result.data;
          for (var i in data) {
          }
          window.down('form').setValues(result.data);
        }
      });
    }
  },
  getFormError : function(form) {
    var fields = form.getForm().getFields();
    var errorMessage = '';
    var firstField = null;
    fields.each(function(field) {
      Ext.each(field.getErrors(), function(error) {
        if (!firstField) firstField = field;
        errorMessage = errorMessage + field.getFieldLabel() + " : " + error + '</br>';
      });
    });
    firstField.focus();
    return errorMessage;
  }
})
