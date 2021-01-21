/**
 * 
 * 我的提醒事项，会弹出当前所有我的提醒事项，1分钟后关闭
 * 
 */
Ext.define('app.view.platform.central.widget.PopupMessageButton', {
  extend : 'expand.ux.ButtonTransparent',
  requires : ['app.view.platform.central.widget.PopupMessageWindow'],
  alias : 'widget.popupmessagebutton',
  iconCls : 'x-fa fa-clock-o',
  tooltip : '所有提醒事项',
  reference : 'popupmessagebutton',
  handler : function(button) {
    button.refreshPopupMessage(button);
    if (button.fToolTip) {
      button.fToolTip.hide();
    }
  },
  listeners : {
    afterrender : function(button) {
      document.getElementById(button.getId() + '-btnIconEl').style = 'color:#4169E1;';
      if (local.getItem('disableAutoPopupMessage', 'false', 'autoPopupMessage') == 'false'
          && local.getItem('disableDay', '', 'autoPopupMessage') != Ext.Date.format(new Date(), 'Y-m-d')) {
        Ext.Function.defer(function() {
          button.refreshPopupMessage();
        }, 3000);
      }
    }
  },
  refreshPopupMessage : function(button) {
    var me = this, text;
    me.setIconCls('x-fa fa-refresh fa-spin');
    EU.RS({
      url : 'platform/systemframe/getpopupmessage.do',
      param : {},
      disableMask : true,
      callback : function(result) {
        if (result.tag == -1) {
          //当前系统没有需要展示的popupMessage信息
          me.hide();
          return;
        }
        if (result.success) {
          if (!me.popupWindow) {
            me.popupWindow = Ext.widget('popupmessagewindow', {
              animateTarget : me,
              popupMessages : result.msg
            });
          } else {
            me.popupWindow.updateMessage(result.msg);
          }
          if (button) me.popupWindow.autoClose = false;
          if (result.msg.length > 0) me.popupWindow.show();
          else {
            if (button) EU.toastInfo('系统中无提醒事项！');
            me.popupWindow.close();
          }
        }
        Ext.Function.defer(function() {
          me.setIconCls('x-fa fa-clock-o');
        }, 200);
      }
    })
  }
})