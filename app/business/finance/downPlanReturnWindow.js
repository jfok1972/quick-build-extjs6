
/**
 * 
 * 本金展期还款的提交窗口
 * 
 */
Ext.define('app.business.finance.downPlanReturnWindow', {
  extend : 'Ext.window.Window',
  modal : true,
  title : '本金展期设置',
  layout : 'fit',
  width : 650,
  bodyPadding : '5px 5px',
  shadow : 'frame',
  shadowOffset : 30,
  initComponent : function() {
    var me = this,
      record = this.record,
      grid = this.grid;
    me.items = [{
          xtype : 'form',
          buttons : [{
                text : '确  定',
                iconCls : 'x-fa fa-save',
                handler : function(button) {
                  var window = button.up('window'),
                    form = window.down('form'),
                    amount = form.findField('amount').getValue(),
                    datefield = form.findField('date'),
                    rate = form.findField('rate').getValue();
                  if (amount > record.get('tfPlanamount')) {
                    EU.toastWarn('展期金额不能大于原计划金额!');
                    return;
                  }
                  if (rate > 1 || rate < 0) {
                    EU.toastWarn('展期年利率必须在0--100%之间!');
                    return;
                  }
                  //console.log(datefield.getValue());
                  //console.log(Ext.Date.dateFormat(datefield.getValue(), "Y-m-d"));
                  var date = Ext.Date.dateFormat(datefield.getValue(), "Y-m-d");
                  if (date <= Ext.Date.dateFormat(record.get('tfDate'), "Y-m-d")) {
                    EU.toastWarn('展期日期必须在 ' + Ext.Date.dateFormat(record.get('tfDate'), "Y-m-d") + ' 之后!');
                    return;
                  }
                  Ext.MessageBox.confirm('确定', '确定把：' + amount + '元，展期到' + date + '日还款吗?', function(btn) {
                    if (btn == 'yes') {
                      EU.RS({
                        url : 'liabilityplan/downplan.do',
                        target : window,
                        params : {
                          planid : record.get('tfPlanid'),
                          amount : amount,
                          date : date,
                          rate : rate,
                          remark : form.findField('remark').getValue(),
                          rebuildrate : form.findField('rebuildrateplan').getValue(),
                          ratetype : form.findField('ratetype').getValue(),
                          firstratedate : Ext.Date.dateFormat(form.findField('firstratedate').getValue(), "Y-m-d")
                        },
                        callback : function(result) {
                          if (result.success) {
                            EU.toastInfo('展期操作已完成，请检查相关记录和利息还款计划确保正确性。')
                            //grid.refreshAll();
                            var formwindow = grid.up('window');
                            if (formwindow) {
                              var grids = formwindow.query('modulegrid[objectName=Liabilitydetailrateplan]');
                              for (var i in grids) {
                                if (grids[i].rendered) grids[i].refreshAll();
                              }
                              var grids = formwindow.query('modulegrid[objectName=Liabilitydetailplan]');
                              for (var i in grids) {
                                if (grids[i].rendered) grids[i].refreshAll();
                              }
                            }
                            window.close();
                          } else {
                            EU.toastWarn(result.msg);
                          }
                        }
                      })
                    }
                  })
                }
              }],
          items : [{
                xtype : 'fieldset',
                defaults : {
                  labelAlign : 'right',
                  labelWidth : 130
                },
                layout : 'auto',
                title : '展期信息',
                items : [{
                      format : 'Y-m-d',
                      xtype : 'datefield',
                      submitFormat : 'Y-m-d',
                      fieldLabel : '展期日期',
                      value : record.get('tfDate'),
                      name : 'date',
                      flex : 1
                    }, {
                      xtype : 'numberfield',
                      fieldLabel : '展期金额',
                      name : 'amount',
                      value : record.get('tfPlanamount'),
                      unittext : '元',
                      maxValue : record.get('tfPlanamount'),
                      minValue : 0.01
                    }, {
                      xtype : 'moneyfield',
                      fieldLabel : '展期年利率',
                      name : 'rate',
                      value : 0,
                      minValue : 0,
                      maxValue : 100,
                      decimalPrecision : 4,
                      percent : true,
                      unittext : '(不填则使用原利率)',
                      width : '60%'
                    }, {
                      xtype : 'combobox',
                      fieldLabel : '展期付息方式',
                      name : 'ratetype',
                      displayField : 'text',
                      valueField : 'id',
                      queryMode : 'local',
                      editable : false,
                      width : '80%',
                      unittext : '(不填则使用原付息方式)',
                      store : {
                        data : [{
                              id : '10',
                              text : '到期一次性付息'
                            }, {
                              id : '20',
                              text : '按月平均付息'
                            }, {
                              id : '30',
                              text : '按季平均付息'
                            }, {
                              id : '40',
                              text : '按年平均付息'
                            }, {
                              id : '50',
                              text : '按半年平均付息'
                            }]
                      }
                    }, {
                      format : 'Y-m-d',
                      xtype : 'datefield',
                      submitFormat : 'Y-m-d',
                      fieldLabel : '展期后首次付息日期',
                      name : 'firstratedate',
                      unittext : '(不填根据原付息计划自动推算)',
                      width : '80%'
                    }, {
                      xtype : 'checkbox',
                      name : 'rebuildrateplan',
                      fieldLabel : '制作展期阶段付息计划',
                      boxLabel : '<span style="color:red;">(展期金额的利息计划从原还本计划日期开始到展期日期重新制作，原付息计划不变。)</span>',
                      value : true
                    }, {
                      width : '100%',
                      xtype : 'textarea',
                      name : 'remark',
                      fieldLabel : '备注',
                      enforceMaxLength : true,
                      maxLength : 200
                    }, {
                      xtype : 'container',
                      html : '<h3>注意事项：</h3>' + //
                          '<ol>1.展期操作只能在该还款计划未还款时才能操作，已还款的不能用此功能进行操作。</ol>' + //
                          '<ol>2.展期金额的利息计划从原还本计划日期开始到展期日期重新制作，原付息计划不变。</ol>' //
                    }]
              }]
        }];
    me.callParent();
  }
})
