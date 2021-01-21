
/**
 * 
 * 导出债务合同，按年月的 计划、已付、付息计划、实际付息表。可以选择年度
 * 
 */
Ext.define('app.business.finance.exportLiabilityInfoDetail', {
  extend : 'Ext.window.Window',
  modal : true,
  title : '下载所有正在还款合同的本金利息计划及还款年度月份明细表',
  layout : 'fit',
  width : 500,
  bodyPadding : '5px 5px',
  shadow : 'frame',
  shadowOffset : 30,
  initComponent : function() {
    var me = this,
      date = new Date(),
      thisYear = date.getFullYear();
    me.items = [{
          xtype : 'form',
          buttons : [{
                text : '下 载',
                iconCls : 'x-fa fa-download',
                handler : function(button) {
                  var window = button.up('window'),
                    form = window.down('form'),
                    startyear = window.down('[name=startyear]').getValue(),
                    startmonth = window.down('[name=startmonth]').getValue(),
                    endyear = window.down('[name=endyear]').getValue(),
                    endmonth = window.down('[name=endmonth]').getValue();
                  if (!form.isValid()) {
                    EU.toastWarn('选择的年度月份有误，请重新选择!');
                    return;
                  }
                  if (endyear < startyear) endyear = startyear;
                  if (startyear == endyear && endmonth < startmonth) endmonth = startmonth;
                  PU.download({
                    url : 'liability/downloadliabilityinfodetail.do',
                    params : {
                      startyear : startyear,
                      startmonth : startmonth,
                      endyear : endyear,
                      endmonth : endmonth
                    }
                  });
                  window.close();
                }
              }],
          items : [{
                xtype : 'fieldset',
                layout : 'auto',
                title : '选择年度',
                items : [{
                      xtype : 'fieldcontainer',
                      layout : {
                        type : 'hbox',
                        pack : 'start',
                        align : 'stretch'
                      },
                      items : [{
                            xtype : 'numberfield',
                            fieldLabel : '起始年度',
                            width : 150,
                            labelWidth : 60,
                            name : 'startyear',
                            value : thisYear,
                            minValue : 2010,
                            maxValue : 2100
                          }, {
                            margin : '0 80',
                            xtype : 'numberfield',
                            fieldLabel : '起始月份',
                            name : 'startmonth',
                            width : 150,
                            labelWidth : 60,
                            value : 1,
                            minValue : 1,
                            maxValue : 12
                          }]
                    }, {
                      xtype : 'fieldcontainer',
                      layout : {
                        type : 'hbox',
                        pack : 'start',
                        align : 'stretch'
                      },
                      items : [{
                            xtype : 'numberfield',
                            fieldLabel : '终止年度',
                            name : 'endyear',
                            width : 150,
                            labelWidth : 60,
                            value : thisYear + 9,
                            minValue : 2010,
                            maxValue : 2100
                          }, {
                            margin : '0 80',
                            xtype : 'numberfield',
                            fieldLabel : '终止月份',
                            name : 'endmonth',
                            width : 150,
                            labelWidth : 60,
                            value : 12,
                            minValue : 1,
                            maxValue : 12
                          }]
                    }]
              }]
        }];
    me.callParent();
  }
})
