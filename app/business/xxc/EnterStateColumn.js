
/**
 * 生效状态
 */
Ext.define('app.business.xxc.EnterStateColumn', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.xxcenterstatecolumn',
  width : 36,
  text : '生效',
  align : 'center',
  tooltip : '生效状态',
  menuText : '生效状态',
  resizable : false,
  menuDisabled : true,
  stopSelection : false,
  items : [{
        getClass : function(v, meta, rec) {
          if (v == '未生效') {
            return 'actionyellow x-fa fa-exclamation-triangle fa-fw';
          } else {
            return 'actionblue x-fa fa-check fa-fw';
          }
        },
        getTip : function(v, meta, rec) {
          var template = new Ext.Template("{0:date('Y-m-d H:i')}"),
            pdate = rec.get('planEnterDate'),
            edate = rec.get('enterDate'),
            planText = "计划生效时间:" + template.apply([pdate]);
          if (v == '未生效') {
            return !pdate ? "计划生效时间未确定" : planText;
          } else {
            return planText + "<br/>" + (edate ? "实际生效时间:" + template.apply([edate]) : '错误：无实际生效时间');
          }
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            button = grid.down('button#activeEnterGroup');
          grid.getSelectionModel().select(rec);
          if (button) {
            button.fireEvent('click', button);
          }
        }
      }],
  statics : {
    activeEnterGroup : function(param) {
      var grid = param.grid,
        record = param.record,
        auditState = record.get('auditState'),
        enterState = record.get('enterState');
      if (auditState != '已审核') {
        EU.toastWarn('此记录尚未完成审核流程，不能进行激活生效的操作！');
        return;
      }
      if (enterState === '已生效') {
        EU.toastWarn('此记录已经激活生效，不能再进行激活生效的操作！');
        return;
      }
      Ext.MessageBox.confirm('确定激活生效', '确定要将『' + record.getTitleTpl() + '』薪资立即生效吗?', function(btn) {
        if (btn == 'yes') {
          EU.RS({
            url : 'xxc/salarygroup/activeentergroup.do',
            params : {
              groupId : record.getIdValue()
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('『' + record.getTitleTpl() + '』薪资已激活生效！')
                grid.refreshRecord(record);
              } else {
                Ext.Msg.show({
                  title : '薪资激活生效失败',
                  message : result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.INFO,
                  fn : function() {
                    window.close();
                  }
                });
              }
            }
          })
        }
      })
    }
  }
})
