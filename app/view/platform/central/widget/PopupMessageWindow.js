Ext.define('app.view.platform.central.widget.PopupMessageWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.popupmessagewindow',
  iconCls : 'x-fa fa-clock-o',
  title : '系统提醒事项',
  closable : false,
  closeAction : 'hide',
  autoClose : true,
  width : 500,
  x : document.body.clientWidth - 500,
  y : 80,
  shadow : 'frame',
  shadowOffset : 30,
  tools : [{
        iconCls : 'x-fa fa-gear',
        tooltip : '提醒事项设置',
        hidden : true
      }, {
        iconCls : 'x-fa fa-gear',
        tooltip : '设置',
        handler : function(target, tool) {
          var me = this;
          var disabled = local.getItem('disableAutoPopupMessage', 'false', "autoPopupMessage") == 'true';
          var disabledDay = local.getItem('disableDay', '', "autoPopupMessage");
          var menu = Ext.widget('menu', {
            items : [{
                  text : '今天不再提示',
                  handler : function() {
                    local.setItem('disableDay', Ext.Date.format(new Date(), 'Y-m-d'), "autoPopupMessage");
                    me.up('window').close();
                  }
                }, '-', !disabled ? {
                  text : '禁用自动提示',
                  handler : function() {
                    local.setItem('disableAutoPopupMessage', 'true', "autoPopupMessage");
                  }
                } : null, disabled ? {
                  text : '启用自动提示',
                  handler : function() {
                    local.setItem('disableAutoPopupMessage', 'false', "autoPopupMessage");
                  }
                } : null]
          })
          menu.showBy(tool);
        }
      }, {
        iconCls : 'x-fa fa-close',
        tooltip : '关闭窗口',
        handler : function(target, tool) {
          this.up('window').close();
        }
      }],
  layout : {
    type : 'vbox',
    pack : 'start',
    align : 'stretch'
  },
  items : [],
  initComponent : function() {
    var me = this,
      messages = me.popupMessages;
    me.updateMessage(messages);
    Ext.Function.defer(function() {
      if (!me.isHidden() && me.autoClose) me.close();
    }, 30 * 1000);
    me.callParent();
  },
  updateMessage : function(messages) {
    var me = this;
    if (me.rendered) {
      me.removeAll();
    }
    for (var i in messages) {
      var html = '<h3>' + messages[i].header + '</h3>' + messages[i].message;
      if (messages[i].moduleName && !messages[i].disableOpenModule) {
        var operator = messages[i].filterFieldOperator;
        if (!operator) operator = '=';
        html += '<a class="popupwindowclicktoview" moduleName="' + messages[i].moduleName + '"' + ' filterText="'
            + messages[i].filterText + '"' + ' filterFieldName="' + messages[i].filterFieldName + '"'
            + ' filterFieldOperator="' + operator + '"' + ' filterFieldValue="' + messages[i].filterFieldValue + '"'
            + ' href="#">' + '点击查看' + '</a>';
      }
      var container = {
        xtype : 'popupmessagecontainer',
        message : html,
        hintlevel : messages[i].hintlevel
      };
      if (me.rendered) {
        me.add(container)
      } else {
        me.items.push(container)
      }
    }
  }
})
Ext.define('app.view.platform.central.widget.PopupMessageContainer', {
  extend : 'Ext.container.Container',
  alias : 'widget.popupmessagecontainer',
  cls : 'popupMessageContainer',
  layout : {
    type : 'hbox',
    pack : 'start',
    align : 'stretch'
  },
  listeners : {
    render : function(container) {
      container.getEl().on('click', container.clicked, container);
    }
  },
  initComponent : function() {
    var me = this;
    if (!me.hintlevel) me.hintlevel = 'info';
    me.items = [{
          xtype : 'container',
          layout : {
            type : 'vbox',
            pack : 'start',
            align : 'stretch'
          },
          style : {
            padding : "0px 0px 0px 5px"
          },
          width : 60,
          items : [{
                xtype : 'container',
                height : 10
              }, {
                xtype : 'container',
                cls : 'x-message-box-icon x-message-box-' + me.hintlevel,
                flex : 1
              }]
        }, {
          xtype : 'container',
          flex : 1,
          html : me.message
        }]
    me.callParent();
  },
  clicked : function(e) {
    var me = this;
    me.up('window').autoClose = false;
    if (e.target) {
      if (e.target.className == 'popupwindowclicktoview') {
        var moduleName = e.target.getAttribute('moduleName');
        if (moduleName) {
          //app.viewport.down('maincenter').fireEvent('addmodule', moduleName);
          // 使用 parentfilter模块的功能，只不过将条件改为 独立处理
          app.viewport.down('maincenter').fireEvent('addparentfiltermodule', {
            childModuleName : moduleName,
            parentModuleName : 'filter',
            pid : e.target.getAttribute('filterFieldValue'),
            ptitle : e.target.getAttribute('filterText'),
            fieldahead : e.target.getAttribute('filterFieldName'),
            operator : e.target.getAttribute('filterFieldOperator')
          });
        }
      }
    }
  }
})
