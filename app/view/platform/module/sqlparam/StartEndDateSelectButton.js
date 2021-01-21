Ext.define('app.view.platform.module.sqlparam.StartEndDateSelectButton', {
	extend : 'Ext.button.Button',
	alias : 'widget.startenddateselectbutton',
	requires : [ 'app.view.platform.module.sqlparam.StartEndDateSelectMenu',
			'app.utils.CommonUtils' ],
	config : {
		form : null
	},
	listeners : {
		'dateSectionChanged' : function(button, result) {
			var me = this;
			var now = new Date(), start = null, end = null;
			var value = result.value;
			console.log(result);

			switch (result.sectiontype) {
			case 'all':
				break;
			case 'thisday':
				start = new Date();
				end = new Date();
				break;
			case 'thisyear':
			case 'year':
				start = value + '-01-01';
				end = value + '-12-31';
				break;
			case "yearsection":
				var ys = value.split('--');
				start = ys[0] ? ys[0] + '-01-01' : null;
				end = ys[1] ? ys[1] + '-12-31' : null;
				break;

			case 'thismonth':
			case 'yearmonth':
				var ms = value.split('-');
				var y = parseInt(ms[0]);
				var m = parseInt(ms[1]);
				start = new Date(y, m-1, 1);
				end = new Date(y, m-1, CU.getDaysInMonth(y, m));
				break;
				
			case 'monthsection' :
				var ys = value.split('--');
				if (ys[0]){
					var ms = ys[0].split('-');
					var y = parseInt(ms[0]);
					var m = parseInt(ms[1]);
					start = new Date(y, m-1, 1);
				}
				if (ys[1]){
					var ms = ys[1].split('-');
					var y = parseInt(ms[0]);
					var m = parseInt(ms[1]);
					end = new Date(y, m-1, CU.getDaysInMonth(y, m));
				}
				break;
			case 'thisquarter':
			case 'yearquarter':
				var ms = value.split('-');
				var y = parseInt(ms[0]);
				var m = parseInt(ms[1]);
				start = new Date(y, (m-1)*3, 1);
				end = new Date(y, (m-1)*3+2, CU.getDaysInMonth(y, (m)*3));
				break;
				
			case 'quartersection' :
				var ys = value.split('--');
				if (ys[0]){
					var ms = ys[0].split('-');
					var y = parseInt(ms[0]);
					var m = parseInt(ms[1]);
					start = new Date(y, (m-1)*3, 1);
				}
				if (ys[1]){
					var ms = ys[1].split('-');
					var y = parseInt(ms[0]);
					var m = parseInt(ms[1]);
					end = new Date(y, (m-1)*3+2, CU.getDaysInMonth(y, (m)*3));
				}
				break;
			default:
				;
			}
			console.log(start, end)
			me.form.findField('startDate').setValue(start);
			me.form.findField('endDate').setValue(end);
			me.down('startenddateselectmenu').hide();
		}
	},

	initComponent : function() {
		var me = this;
		me.menu = {
			xtype : 'startenddateselectmenu',
			target : me
		}
		me.callParent(arguments);
	}
})