Ext.define('app.business.finance.financeFunction', {})
/**
 * 对选中的付息计划进行合并付款，录入一个总的付息金额，如果有当天有多条记录的话，则按比例进行分配到每一个付息计划。
 * 
 * 先到后台去判断选择的日期的那天的付息计划是不是只有一条，并且都没有付过款。是否到了付息日期
 * 
 * @param {} param
 */
function rateUnionReturn(param) {
  var record = param.record,
    grid = param.grid;
  if (record.get('tfPayoutstatus') != '可支付') {
    EU.toastWarn('您选择的付息计划尚不可以进行支付或已支付完成！');
    return;
  }
  // 先检查是否有2条以上的当天付息计划，如果只有一条，让他执行另一个付息的操作。
  // 返回共有几条，以及计划的总金额
  EU.RS({
    url : 'liabilityplan/rateunionreturncheck.do',
    params : {
      rateplanid : record.get('tfRateplanid')
    },
    disableMask : true,
    callback : function(result) {
      if (!result.success) {
        EU.toastWarn(result.msg);
        return;
      }
      if (result.msg.count == 1) {
        EU.toastWarn('本合同的付息计划在：' + Ext.Date.format(record.get('tfDate'), 'Y-m-d') + '只有一条记录，请使用“付息”功能进行支付。');
        return;
      }
      // 
      Ext.widget('window', {
        title : record.get('liabilitydetail.liability.tfName') + '在' + Ext.Date.format(record.get('tfDate'), 'Y-m-d')
            + '的合并支付',
        modal : true,
        layout : 'fit',
        width : 500,
        listeners : {
          show : function(window) {
            window.down('[name=returnAmount]').focus();
          }
        },
        items : [{
              xtype : 'form',
              padding : 5,
              buttons : [{
                    text : '确定',
                    handler : function(button) {
                      var window = button.up('window'),
                        form = window.down('form');
                      EU.RS({
                        url : 'liabilityplan/rateunionreturn.do',
                        params : {
                          rateplanid : record.get('tfRateplanid'),
                          returnamount : form.findField('returnAmount').getValue(),
                          pzh : form.findField('pzh').getValue(),
                          remark : form.findField('remark').getValue(),
                          jzrq : form.findField('jzrq').getSubmitValue()
                        },
                        target : window,
                        callback : function(result) {
                          if (!result.success) {
                            EU.toastWarn(result.msg);
                            return;
                          } else {
                            EU.toastWarn(window.getTitle() + '已完成!');
                            grid.getStore().reload();
                            window.close();
                          }
                        }
                      })
                    }
                  }],
              items : [{
                    xtype : 'fieldset',
                    layout : 'vbox',
                    defaults : {
                      labelAlign : 'right'
                    },
                    title : '付息设置',
                    items : [{
                          xtype : 'numberfield',
                          value : result.msg.count,
                          fieldLabel : '当日计划付息条数',
                          readOnly : true,
                          unittext : '条',
                          width : '50%',
                          disabled : true
                        }, {
                          xtype : 'moneyfield',
                          value : result.msg.planAmount,
                          fieldLabel : '当日计划付息金额',
                          readOnly : true,
                          unittext : '元',
                          width : '50%',
                          disabled : true
                        }, {
                          xtype : 'moneyfield',
                          name : 'returnAmount',
                          value : result.msg.planAmount,
                          fieldLabel : '实际付息金额',
                          unittext : '元',
                          width : '50%'
                        }, {
                          xtype : 'textfield',
                          name : 'pzh',
                          fieldLabel : '凭证号',
                          width : '100%',
                          enforceMaxLength : true,
                          maxLength : 50
                        }, {
                          name : 'jzrq',
                          fieldLabel : '记帐日期',
                          width : '100%',
                          format : 'Y-m-d',
                          xtype : 'datefield',
                          submitFormat : 'Y-m-d'
                        }, {
                          width : '100%',
                          xtype : 'textarea',
                          name : 'remark',
                          fieldLabel : '备注',
                          enforceMaxLength : true,
                          maxLength : 200
                        }, {
                          xtype : 'container',
                          width : '100%',
                          html : '<br/>  如果“实际付息金额”与“当日计划付息金额”不相等，则将会对所有的当日付息计划按照比例进行支付。'
                        }]
                  }]
            }]
      }).show();
    }
  })
}
