Ext.define('app.view.platform.module.sqlparam.Form', {
  extend : 'Ext.form.Panel',
  alias : 'widget.modulesqlform',
  requires : ['app.view.platform.module.sqlparam.StartEndDateSelectButton'],
  weight : 8,
  config : {
    moduleInfo : null
  },
  bodyPadding : '2 2 2 2',
  dockedItems1 : [{
        dock : 'left',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        items : [{
              iconCls : 'x-fa fa-search',
              text : '查询',
              itemId : 'searchbutton',
              weight : 10,
              // hidden : !me.filterscheme,
              // disabled : true,
              handler : function(button) {
                this.up('modulegrid').getStore().loadPage(1);
              }
            }]
      }, {
        dock : 'left',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        weight : 5,
        items : [{
              iconCls : 'x-fa fa-unlink',
              text : '清除',
              itemId : 'clearbutton',
              // disabled : true,
              // hidden : !me.filterscheme,
              handler : function() {
                this.up('form').reset();
              }
            }]
      }],
  layout : {
    type : 'hbox',
    pack : 'start',
    align : 'stretch'
  },
  initComponent : function() {
    var me = this,
      items = [];
    var sqlparam = me.moduleInfo.fDataobject.fDataobjectsqlparams;
    
    var hasStartDate = false , hasEndDate = false;
    Ext.each(sqlparam, function(p) {
    	hasStartDate = hasStartDate || p.paramname == 'startDate';
    	hasEndDate = hasEndDate || p.paramname == 'endDate';
    });
    if (hasStartDate && hasEndDate)
      items.push({
    	xtype : 'startenddateselectbutton',
    	text : '日期区间选择',
    	form : me,
      })
    
    Ext.each(sqlparam, function(p) {
      var field = {
        labelAlign : 'right',
        fieldLabel : p.title,
        xtype : 'textfield',
        name : p.paramname,
        value : me.initSqlparam ? me.initSqlparam[p.paramname] : null,
      }
      if (p.paramtype.toLowerCase() == 'date') {
        field.xtype = 'datefield';
        field.format = 'Y-m-d';
        field.submitFormat = 'Y-m-d';
        field.enableKeyEvents = true
      }
      if (p.width) field.width = p.width;
      if (p.flex) field.flex = p.flex;
      if (p.paramvalues && p.paramvalues.length > 1) {
        var vs = p.paramvalues.split(',');
        var data = [];
        Ext.each(vs, function(v) {
          data.push({
            name : v
          })
        })
        var store = Ext.create('Ext.data.Store', {
          fields : ['name'],
          data : data
        });
        Ext.apply(field, {
          editable : false,
          xtype : 'combobox',
          store : store,
          queryMode : 'local',
          displayField : 'name',
          valueField : 'name'
        })
      }
      CU.applyOtherSetting(field, p.remark);
      items.push(field);
    })
    items.push({
      margin : '0 6 0 6',
      iconCls : 'x-fa fa-search',
      text : '查询',
      itemId : 'searchbutton',
      handler : function(button) {
    	if (button.up('modulegrid')){
          button.up('modulegrid').getStore().loadPage(1);
          var navigate = button.up('modulepanel').getModuleNavigate();
          if (navigate) 
        	navigate.refreshNavigateTree();
        } else if (me.dataminingmain) {		//datamining
        	me.dataminingmain.fireEvent('sqlparamchanged', me.getSqlParam());
        }
    	}
    })
    items.push({
      iconCls : 'x-fa fa-unlink',
      text : '清除',
      itemId : 'clearbutton',
      handler : function(button) {
        button.up('form').reset();
        if (button.up('modulegrid')){
          button.up('modulegrid').getStore().loadPage(1);
          var navigate = button.up('modulepanel').getModuleNavigate();
          if (navigate) 
        	navigate.refreshNavigateTree();    
        } else if (me.dataminingmain) {		//datamining
        	me.dataminingmain.fireEvent('sqlparamchanged', me.getSqlParam());
        }
      }
    })
    me.items = [];
    me.items.push({
      xtype : 'toolbar',
      style : 'border: solid 0px',
      items : items
    })
    me.callParent();
  },
  setSqlParam : function(sqlparam) {
	  if (sqlparam)
		  me.getForm.setValues(sqlparam);
  },
  getSqlParam : function() {
    var me = this,
      values = me.getForm().getValues(false, false, false, false);
    //console.log(values);
    return values;
  }
})