Ext.define('app.view.platform.module.toolbar.widget.Export', {
  extend : 'Ext.button.Split',
  alias : 'widget.modulegridexportbutton',
  requires : ['app.view.platform.module.toolbar.widget.ExportScheme'],
  config : {
    moduleInfo : undefined
  },
  icon : 'resources/images/button/excel.png',
  // iconCls : 'x-fa fa-file-excel-o',
  handler : 'onExportExeclButtonClick',
  initComponent : function() {
    var me = this;
    me.menu = [{
          text : '列表导出至Excel文档',
          icon : 'resources/images/button/excel.png',
          handler : 'onExportExeclButtonClick'
        }, {
          hidden : true,
          text : '当前页记录导出至Excel文档',
          icon : 'resources/images/button/excel.png',
          handler : 'onExportCurrentPageExeclButtonClick'
        }, {
          text : '列表导出至PDF文档',
          icon : 'resources/images/button/pdf.png',
          handler : 'onExportPdfButtonClick',
          // 由于字符数太大，无法get到服务器，先暂时不用这个
          menu_ : [{
                text : '下载PDF文件',
                iconCls : 'x-fa fa-download',
                handler : 'onExportPdfButtonClick'
              }, {
                text : '在本页中打开PDF文件',
                iconCls : 'x-fa fa-file-pdf-o'
              }, {
                text : '在新窗口中打开PDF文件',
                iconCls : 'x-fa fa-mail-forward'
              }]
        }, {
          hidden : true,
          text : '当前页记录导出至PDF文档',
          icon : 'resources/images/button/pdf.png',
          handler : 'onExportCurrentPagePdfButtonClick'
        }];
    // 找到有没有treemodeexcelexport样式的formscheme，这个可以用于下载树形的模块图
    var forms = me.moduleInfo.fDataobject.fovFormschemes;
    var treeforms = [];
    if (Ext.isArray(forms)) {
      for (var i in forms) {
        var f = forms[i];
        if (f.formtype == 'treemodeexcelexport' || f.formtype == 'gridmodeexcelexport') treeforms.push(f);
      }
    }
    if (treeforms.length > 0) {
      me.menu.push('-');
      Ext.each(treeforms, function(form) {
        me.menu.push({
          icon : 'resources/images/button/excelone.png',
          text : form.schemename,
          formschemeid : form.formschemeid,
          handler : 'onExportTreeExeclButtonClick'
        })
      })
    }
    //
    if (me.moduleInfo.fDataobject.excelschemes) {
      me.menu.push('-');
      Ext.each(me.moduleInfo.fDataobject.excelschemes, function(scheme) {
        me.menu.push({
          xtype : 'modulegridexportscheme',
          scheme : scheme
        })
      })
    }
    me.menu.push('-');
    me.menu.push({
      text : '导出及页面设置',
      iconCls : 'x-fa fa-file-text',
      menu : [{
            xtype : 'checkbox',
            boxLabel : '仅导出选中记录',
            reference : 'onlyselected'
          }, '-', {
            xtype : 'checkbox',
            boxLabel : '加入当前数值金额单位',
            reference : 'usemonetary'
          }, {
            xtype : 'checkbox',
            boxLabel : '无前景背景色',
            reference : 'colorless'
          }, {
            xtype : 'checkbox',
            boxLabel : '不加入总计',
            reference : 'sumless'
          }, {
            xtype : 'checkbox',
            boxLabel : '计量单位单独一行',
            reference : 'unitalone'
          }, '-', {
            text : '纸张自动适应',
            xtype : 'menucheckitem',
            tooltip : '根据总列宽自动设置纸张的大小和方向',
            group : me.getId() + 'pagesize',
            reference : 'pageautofit',
            hideOnClick : false,
            checked : true,
            handler : me.pageSizeChange
          }, '-', {
            text : 'A4纵向',
            xtype : 'menucheckitem',
            hideOnClick : false,
            group : me.getId() + 'pagesize',
            reference : 'pageA4',
            handler : me.pageSizeChange
          }, {
            text : 'A4横向',
            xtype : 'menucheckitem',
            hideOnClick : false,
            group : me.getId() + 'pagesize',
            reference : 'pageA4landscape',
            handler : me.pageSizeChange
          }, {
            text : 'A3纵向',
            xtype : 'menucheckitem',
            hideOnClick : false,
            group : me.getId() + 'pagesize',
            reference : 'pageA3',
            handler : me.pageSizeChange
          }, {
            text : 'A3横向',
            xtype : 'menucheckitem',
            hideOnClick : false,
            group : me.getId() + 'pagesize',
            reference : 'pageA3landscape',
            handler : me.pageSizeChange
          }, '-', {
            disabled : true,
            width : 120,
            labelWidth : 60,
            value : 100,
            fieldLabel : '缩放比例',
            xtype : 'numberfield',
            maxValue : 1000,
            minValue : 10,
            hideOnClick : false,
            reference : 'scale'
          }, {
            disabled : true,
            text : '自动适应列宽',
            xtype : 'menucheckitem',
            tooltip : '在打印或转成PDF文件时，列宽超出纸张，则自动适应页面宽度',
            hideOnClick : false,
            checked : true,
            reference : 'pageautofitwidth'
          }]
    });
    me.callParent(arguments);
  },
  pageSizeChange : function(menuitem) {
    var autoSize = menuitem.reference == 'pageautofit';
    if (autoSize) {
      menuitem.ownerCt.down('[reference=scale]').disable()
      menuitem.ownerCt.down('[reference=pageautofitwidth]').disable()
    } else {
      menuitem.ownerCt.down('[reference=scale]').enable()
      menuitem.ownerCt.down('[reference=pageautofitwidth]').enable()
    }
  }
})
