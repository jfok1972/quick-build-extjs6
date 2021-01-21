
/**
 * 
 * 本金提前还款的提交窗口
 * 
 */
Ext.define('app.business.finance.aheadPlanReturnWindow', {
  extend : 'Ext.window.Window',
  modal : true,
  title : '本金提前还款设置',
  layout : 'fit',
  width : 600,
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
                    datefield = form.findField('date');
                  if (amount > record.get('tfPlanamount')) {
                    EU.toastWarn('提前还款金额不能大于原计划金额!');
                    return;
                  }
                  //console.log(datefield.getValue());
                  //console.log(Ext.Date.dateFormat(datefield.getValue(), "Y-m-d"));
                  var date = Ext.Date.dateFormat(datefield.getValue(), "Y-m-d");
                  if (date >= Ext.Date.dateFormat(record.get('tfDate'), "Y-m-d")) {
                    EU.toastWarn('提前还款日期必须在 ' + Ext.Date.dateFormat(record.get('tfDate'), "Y-m-d") + ' 之前!');
                    return;
                  }
                  Ext.MessageBox.confirm('确定', '确定把：' + amount + '元，提前到' + date + '日还款吗?', function(btn) {
                    if (btn == 'yes') {
                      EU.RS({
                        url : 'liabilityplan/aheadplan.do',
                        target : window,
                        params : {
                          planid : record.get('tfPlanid'),
                          amount : amount,
                          date : date,
                          rebuildrate : form.findField('rebuildrateplan').getValue()
                        },
                        callback : function(result) {
                          if (result.success) {
                            EU.toastInfo('提前还款操作已完成，请检查相关记录和利息还款计划确保正确性。')
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
                layout : 'auto',
                title : '还款信息',
                items : [{
                      xtype : 'numberfield',
                      fieldLabel : '提前还款金额',
                      name : 'amount',
                      value : record.get('tfPlanamount'),
                      unittext : '元',
                      maxValue : record.get('tfPlanamount'),
                      minValue : 0.01
                    }, {
                      format : 'Y-m-d',
                      xtype : 'datefield',
                      submitFormat : 'Y-m-d',
                      fieldLabel : '提前还款日期',
                      value : record.get('tfDate'),
                      name : 'date',
                      flex : 1
                    }, {
                      xtype : 'checkbox',
                      name : 'rebuildrateplan',
                      fieldLabel : '重新制作付息计划',
                      boxLabel : '<span style="color:red;">(提款还款日期之前的付息计划将会不动，日期之后的计划会全部删除重新制作。)</span>',
                      value : true
                    }, {
                      xtype : 'container',
                      html : '<h3>注意事项：</h3>' + //
                          '<ol>1.提前还款操作只能在该还款计划未还款时才能操作，已还款的不能用此功能进行操作。</ol>' + //
                          '<ol>2.提前还款后，只有当前还款计划的提款明细是自动计息的才需要把“重新制作付息计划”打勾。</ol>' + //
                          '<ol>3.如果不确定利息息款计划的制作方式，需要在此操作完成后，去手工维护利息计划。</ol>' //
                    }]
              }]
        }];
    me.callParent();
  }
})
