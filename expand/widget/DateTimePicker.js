/**
 * A date picker. This class is used by the Ext.form.field.Date field to allow
 * browsing and selection of valid dates in a popup next to the field, but may
 * also be used with other components.
 * 
 * Typically you will need to implement a handler function to be notified when
 * the user chooses a date from the picker; you can register the handler using
 * the {@link #select} event, or by implementing the {@link #handler} method.
 * 
 * By default the user will be allowed to pick any date; this can be changed by
 * using the {@link #minDate}, {@link #maxDate}, {@link #disabledDays},
 * {@link #disabledDatesRE}, and/or {@link #disabledDates} configs.
 * 
 * All the string values documented below may be overridden by including an Ext
 * locale file in your page.
 * 
 * @example
 * Ext.create('Ext.panel.Panel', {
 *         title: 'Choose a future date:',
 *         width: 200,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items: [{
 *             xtype: 'datepicker',
 *             minDate: new Date(),
 *             handler: function(picker, date) {
 *                 // do something with the selected date
 *             }
 *         }]
 *     });
 *          由jfok 于 2016年07月14日制作完成。
 * 
 * 一个包含了 时间 的日期控件，在原来的日期选择控件的基础上增加了时分秒的选择。
 * 
 * showSecond : false  , 不包含秒
 * 
 * jfok1972@qq.com
 * 
 */
Ext.define('expand.widget.DateTimePicker', {
	extend : 'Ext.Component',
	requires : ['Ext.XTemplate', 'Ext.button.Button', 'Ext.button.Split',
			'Ext.util.ClickRepeater', 'Ext.util.KeyNav', 'Ext.fx.Manager',
			'Ext.picker.Month'],
	alias : 'widget.datetimepicker',
	alternateClassName : 'Ext.DateTimePicker',

	/**
	 * 不要秒的控制，时间精度精确到分钟，大多时候是不用精确到秒。秒的值全用00表示。
	 */
	disableSecond : false,

	okText : '确定',

	// <locale>
	/**
	 * @cfg {String} todayText The text to display on the button that selects
	 *      the current date
	 */
	todayText: "今天",
	// </locale>

	// <locale>
	/**
	 * @cfg {String} ariaTitle The text to display for the aria title
	 */
	ariaTitle : 'Date Picker: {0}',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} ariaTitleDateFormat The date format to display for the
	 *      current value in the {@link #ariaTitle}
	 */
	ariaTitleDateFormat: 'Y\u5e74m\u6708d\u65e5',
	// </locale>

	/**
	 * @cfg {Function} handler Optional. A function that will handle the select
	 *      event of this picker. The handler is passed the following
	 *      parameters: - `picker` : Ext.picker.Date
	 * 
	 * This Date picker. - `date` : Date
	 * 
	 * The selected date.
	 */

	/**
	 * @cfg {Object} scope The scope (`this` reference) in which the `{@link #handler}`
	 *      function will be called.
	 * 
	 * Defaults to this DatePicker instance.
	 */

	// <locale>
	/**
	 * @cfg {String} todayTip A string used to format the message for displaying
	 *      in a tooltip over the button that selects the current date. The
	 *      `{0}` token in string is replaced by today's date.
	 */
	todayTip : '{0} (空格键选择)',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} minText The error text to display if the minDate validation
	 *      fails.
	 */
    minText: "日期必须大于最小允许日期",
	// </locale>

	// <locale>
	/**
	 * @cfg {String} ariaMinText The text that will be announced by Assistive
	 *      Technologies such as screen readers when user is navigating to the
	 *      cell which date is less than {@link #minDate}.
	 */
	ariaMinText : "This date is before the minimum date",
	// </locale>

	// <locale>
	/**
	 * @cfg {String} maxText The error text to display if the maxDate validation
	 *      fails.
	 */
	maxText : '日期必须小于最大允许日期',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} ariaMaxText The text that will be announced by Assistive
	 *      Technologies such as screen readers when user is navigating to the
	 *      cell which date is later than {@link #maxDate}.
	 */
	ariaMaxText : "This date is after the maximum date",
	// </locale>

	/**
	 * @cfg {String} format The default date format string which can be
	 *      overriden for localization support. The format must be valid
	 *      according to {@link Ext.Date#parse} (defaults to
	 *      {@link Ext.Date#defaultFormat}).
	 */

	// <locale>
	/**
	 * @cfg {String} disabledDaysText The tooltip to display when the date falls
	 *      on a disabled day.
	 */
	disabledDaysText : 'Disabled',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} ariaDisabledDaysText The text that Assistive Technologies
	 *      such as screen readers will announce when the date falls on a
	 *      disabled day of week.
	 */
	ariaDisabledDaysText : "This day of week is disabled",
	// </locale>

	// <locale>
	/**
	 * @cfg {String} disabledDatesText The tooltip text to display when the date
	 *      falls on a disabled date.
	 */
	disabledDatesText : 'Disabled',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} ariaDisabledDatesText The text that Assistive Technologies
	 *      such as screen readers will announce when the date falls on a
	 *      disabled date.
	 */
	ariaDisabledDatesText : "This date is disabled",

	// </locale>
	/**
	 * @cfg {String[]} monthNames An array of textual month names which can be
	 *      overriden for localization support (defaults to Ext.Date.monthNames)
	 * @deprecated This config is deprecated. In future the month names will be
	 *             retrieved from {@link Ext.Date}
	 */

	/**
	 * @cfg {String[]} dayNames An array of textual day names which can be
	 *      overriden for localization support (defaults to Ext.Date.dayNames)
	 * @deprecated This config is deprecated. In future the day names will be
	 *             retrieved from {@link Ext.Date}
	 */

	// <locale>
	/**
	 * @cfg {String} nextText The next month navigation button tooltip
	 */
	nextText : '下个月 (Ctrl+Right)',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} prevText The previous month navigation button tooltip
	 */
	prevText : '上个月 (Ctrl+Left)',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} monthYearText The header month selector tooltip
	 */
	monthYearText : '选择一个月 (Control+Up/Down 来改变年份)',
	// </locale>

	// <locale>
	/**
	 * @cfg {String} monthYearFormat The date format for the header month
	 */
	monthYearFormat: 'Y\u5e74m\u6708',
	// </locale>

	// <locale>
	/**
	 * @cfg {Number} [startDay=undefined] Day index at which the week should
	 *      begin, 0-based.
	 * 
	 * Defaults to `0` (Sunday).
	 */
	startDay : 0,
	// </locale>

	// <locale>
	/**
	 * @cfg {Boolean} showToday False to hide the footer area containing the
	 *      Today button and disable the keyboard handler for spacebar that
	 *      selects the current date.
	 */
	showToday : true,
	// </locale>

	/**
	 * @cfg {Date} [minDate=null] Minimum allowable date (JavaScript date
	 *      object)
	 */

	/**
	 * @cfg {Date} [maxDate=null] Maximum allowable date (JavaScript date
	 *      object)
	 */

	/**
	 * @cfg {Number[]} [disabledDays=null] An array of days to disable, 0-based.
	 *      For example, [0, 6] disables Sunday and Saturday.
	 */

	/**
	 * @cfg {RegExp} [disabledDatesRE=null] JavaScript regular expression used
	 *      to disable a pattern of dates. The {@link #disabledDates} config
	 *      will generate this regex internally, but if you specify
	 *      disabledDatesRE it will take precedence over the disabledDates
	 *      value.
	 */

	/**
	 * @cfg {String[]} disabledDates An array of 'dates' to disable, as strings.
	 *      These strings will be used to build a dynamic regular expression so
	 *      they are very powerful. Some examples: - ['03/08/2003',
	 *      '09/16/2003'] would disable those exact dates - ['03/08', '09/16']
	 *      would disable those days for every year - ['^03/08'] would only
	 *      match the beginning (useful if you are using short years) -
	 *      ['03/../2006'] would disable every day in March 2006 - ['^03'] would
	 *      disable every day in every March
	 * 
	 * Note that the format of the dates included in the array should exactly
	 * match the {@link #format} config. In order to support regular
	 * expressions, if you are using a date format that has '.' in it, you will
	 * have to escape the dot when restricting dates. For example:
	 * ['03\\.08\\.03'].
	 */

	/**
	 * @cfg {Boolean} disableAnim True to disable animations when showing the
	 *      month picker.
	 */
	disableAnim : false,

	/**
	 * @cfg {String} [baseCls='x-datepicker'] The base CSS class to apply to
	 *      this components element.
	 */
	baseCls : Ext.baseCSSPrefix + 'datepicker',

	/**
	 * @cfg {String} [selectedCls='x-datepicker-selected'] The class to apply to
	 *      the selected cell.
	 */

	/**
	 * @cfg {String} [disabledCellCls='x-datepicker-disabled'] The class to
	 *      apply to disabled cells.
	 */

	// <locale>
	/**
	 * @cfg {String} longDayFormat The format for displaying a date in a longer
	 *      format.
	 */
	longDayFormat: 'Y\u5e74m\u6708d\u65e5',
	// </locale>

	/**
	 * @cfg {Object} keyNavConfig Specifies optional custom key event handlers
	 *      for the {@link Ext.util.KeyNav} attached to this date picker. Must
	 *      conform to the config format recognized by the
	 *      {@link Ext.util.KeyNav} constructor. Handlers specified in this
	 *      object will replace default handlers of the same name.
	 */

	/**
	 * @cfg {String} The {@link Ext.button.Button#ui} to use for the date
	 *      picker's footer buttons.
	 */
	footerButtonUI : 'default',

	isDatePicker : true,
	alignOnScroll : false,

	ariaRole : 'region',
	focusable : true,

	childEls : ['innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl',
			'footerEl'],

	border : true,

	/**
	 * @cfg
	 * @inheritdoc
	 */
	renderTpl : [
			'<div id="{id}-innerEl" data-ref="innerEl" role="presentation">',
			'<div class="{baseCls}-header">',
			'<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="presentation" title="{prevText}"></div>',
			'<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
			'<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="presentation" title="{nextText}"></div>',
			'</div>',
			'<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" tabindex="0" aria-readonly="true">',
			'<thead>',
			'<tr role="row">',
			'<tpl for="dayNames">',
			'<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
			'<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
			'</th>',
			'</tpl>',
			'</tr>',
			'</thead>',
			'<tbody>',
			'<tr role="row">',
			'<tpl for="days">',
			'{#:this.isEndOfWeek}',
			'<td role="gridcell">',
			'<div hidefocus="on" class="{parent.baseCls}-date"></div>',
			'</td>',
			'</tpl>',
			'</tr>',
			'</tbody>',
			'</table>',

			// 指定时分秒渲染框架
			'<table id="{id}-timeEl" style="table-layout:auto;margin:0 auto;width:',
			'<tpl if="showSecond">',
			'90%',
			'<tpl else>',
			'60%',
			'</tpl>',
			';text-align:center;" class="x-datepicker-inner" cellspacing="0">',
			'<tbody><tr>',
			'<td width="30%">{%this.renderHourField(values,out)%}</td>',
			'<td width="35%">{%this.renderMinuteField(values,out)%}</td>',
			'<tpl if="showSecond">',
			'<td width="35%">{%this.renderSecondField(values,out)%}</td>',
			'</tpl>',
			'</tr></tbody>',
			'</table>',
			// 上面是新增的

			'<tpl if="showToday">',
			'<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">',
			// 增加了确认按钮
			'{%this.renderOkBtn(values, out)%}',
			// 上面是新增的
			'{%this.renderTodayBtn(values, out)%}</div>',
			'</tpl>',
			// These elements are used with Assistive Technologies such as
			// screen readers
			'<div id="{id}-todayText" class="' + Ext.baseCSSPrefix
					+ 'hidden-clip">{todayText}.</div>',
			'<div id="{id}-ariaMinText" class="' + Ext.baseCSSPrefix
					+ 'hidden-clip">{ariaMinText}.</div>',
			'<div id="{id}-ariaMaxText" class="' + Ext.baseCSSPrefix
					+ 'hidden-clip">{ariaMaxText}.</div>',
			'<div id="{id}-ariaDisabledDaysText" class="' + Ext.baseCSSPrefix
					+ 'hidden-clip">{ariaDisabledDaysText}.</div>',
			'<div id="{id}-ariaDisabledDatesText" class="' + Ext.baseCSSPrefix
					+ 'hidden-clip">{ariaDisabledDatesText}.</div>', '</div>',
			{
				firstInitial : function(value) {
					return Ext.picker.Date.prototype.getDayInitial(value);
				},
				isEndOfWeek : function(value) {
					// convert from 1 based index to 0 based
					// by decrementing value once.
					value--;
					var end = value % 7 === 0 && value !== 0;
					return end ? '</tr><tr role="row">' : '';
				},
				renderTodayBtn : function(values, out) {
					Ext.DomHelper.generateMarkup(values.$comp.todayBtn
									.getRenderTree(), out);
				},
				renderMonthBtn : function(values, out) {
					Ext.DomHelper.generateMarkup(values.$comp.monthBtn
									.getRenderTree(), out);
				},
				// 指定渲染方法调用
				renderHourField : function(values, out) {
					Ext.DomHelper.generateMarkup(values.$comp.hourField
									.getRenderTree(), out);
				},
				renderMinuteField : function(values, out) {
					Ext.DomHelper.generateMarkup(values.$comp.minuteField
									.getRenderTree(), out);
				},
				renderSecondField : function(values, out) {
					Ext.DomHelper.generateMarkup(values.$comp.secondField
									.getRenderTree(), out);
				},
				renderOkBtn : function(values, out) {
					Ext.DomHelper.generateMarkup(values.$comp.okBtn
									.getRenderTree(), out);
				}
				// 以上四个函数是新增的
			}],

	// Default value used to initialise each date in the DatePicker.
	// __Note:__ 12 noon was chosen because it steers well clear of all DST
	// timezone changes.
	initHour : 12, // 24-hour format

	numDays : 42,

	/**
	 * @event select Fires when a date is selected
	 * @param {Ext.picker.Date}
	 *            this DatePicker
	 * @param {Date}
	 *            date The selected date
	 */

	initComponent : function() {
		var me = this, clearTime = Ext.Date.clearTime;

		me.selectedCls = me.baseCls + '-selected';
		me.disabledCellCls = me.baseCls + '-disabled';
		me.prevCls = me.baseCls + '-prevday';
		me.activeCls = me.baseCls + '-active';
		me.cellCls = me.baseCls + '-cell';
		me.nextCls = me.baseCls + '-prevday';
		me.todayCls = me.baseCls + '-today';

		if (!me.format) {
			me.format = Ext.Date.defaultFormat;
		}
		if (!me.dayNames) {
			me.dayNames = Ext.Date.dayNames;
		}
		me.dayNames = me.dayNames.slice(me.startDay).concat(me.dayNames.slice(
				0, me.startDay));

		me.callParent();

		me.value = me.value ? (me.value) : (new Date());

		me.initDisabledDays();
	},

	// Keep the tree structure correct for Ext.form.field.Picker input fields
	// which poke a 'pickerField' reference down into their pop-up pickers.
	getRefOwner : function() {
		return this.pickerField || this.callParent();
	},

	getRefItems : function() {
		var results = [], monthBtn = this.monthBtn, todayBtn = this.todayBtn;

		if (monthBtn) {
			results.push(monthBtn);
		}

		if (todayBtn) {
			results.push(todayBtn);
		}
		return results;
	},

	beforeRender : function() {
		/*
		 * days array for looping through 6 full weeks (6 weeks * 7 days) Note
		 * that we explicitly force the size here so the template creates all
		 * the appropriate cells.
		 */
		var me = this, encode = Ext.String.htmlEncode, days = new Array(me.numDays), today = Ext.Date
				.format(new Date(), me.format);

		if (me.padding && !me.width) {
			me.cacheWidth();
		}
		// 自己加的
		me.hourField = new Ext.form.field.Number({
					ownerCt : me,
					ownerLayout : me.getComponentLayout(),
					minValue : 0,
                    labelAlign : 'left',
					maxValue : 23,
					step : 1,
					selectOnFocus : true,
					width : '100%',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == e.ENTER) {
								e.stopEvent();
								me.minuteField.focus(true);
							}
						}
					}
				});
		me.minuteField = new Ext.form.field.Number({
					ownerCt : me,
					ownerLayout : me.getComponentLayout(),
					minValue : 0,
					maxValue : 59,
					selectOnFocus : true,
					step : 1,
					width : '100%',
					labelWidth : 10,
					fieldLabel : '&nbsp;',
					enableKeyEvents : true,
					listeners : {
						specialkey : function(field, e) {
							if (e.getKey() == e.ENTER) {
								e.stopEvent();
								if (!me.disableSecond)
									me.secondField.focus(true);
								else
									me.okBtn.focus(true);
							}
						}
					}
				});
		if (!me.disableSecond)
			me.secondField = new Ext.form.field.Number({
						ownerCt : me,
						ownerLayout : me.getComponentLayout(),
						minValue : 0,
						maxValue : 59,
						step : 1,
						width : '100%',
						labelWidth : 10,
						selectOnFocus : true,
						fieldLabel : '&nbsp;',
						enableKeyEvents : true,
						listeners : {
							specialkey : function(field, e) {
								if (e.getKey() == e.ENTER) {
									e.stopEvent();
									me.okBtn.focus(true);
								}
							}
						}
					});
		// 自己加的

		me.monthBtn = new Ext.button.Split({
					ownerCt : me,
					ownerLayout : me.getComponentLayout(),
					text : '',
					tooltip : me.monthYearText,
					tabIndex : -1,
					ariaRole : 'presentation',
					listeners : {
						click : me.doShowMonthPicker,
						arrowclick : me.doShowMonthPicker,
						scope : me
					}
				});

		if (me.showToday) {

			// 自己加的
			me.okBtn = new Ext.button.Button({
						ui : me.footerButtonUI,
						ownerCt : me,
						ownerLayout : me.getComponentLayout(),
						text : me.okText,
						ariaRole : 'presentation',
						handler : me.okHandler, // 确认按钮的事件委托
						scope : me
					});
			// 自己加的

			me.todayBtn = new Ext.button.Button({
						ui : me.footerButtonUI,
						ownerCt : me,
						ownerLayout : me.getComponentLayout(),
						text : Ext.String.format(me.todayText, today),
						tooltip : Ext.String.format(me.todayTip, today),
						tooltipType : 'title',
						tabIndex : -1,
						ariaRole : 'presentation',
						handler : me.selectToday,
						scope : me
					});
		}

		me.callParent();

		Ext.applyIf(me, {
					renderData : {}
				});

		Ext.apply(me.renderData, {
					showSecond : !me.disableSecond, // 加入的
					dayNames : me.dayNames,
					showToday : me.showToday,
					prevText : encode(me.prevText),
					nextText : encode(me.nextText),
					todayText : encode(me.todayText),
					ariaMinText : encode(me.ariaMinText),
					ariaMaxText : encode(me.ariaMaxText),
					ariaDisabledDaysText : encode(me.ariaDisabledDaysText),
					ariaDisabledDatesText : encode(me.ariaDisabledDatesText),
					days : days
				});

		me.protoEl.unselectable();
	},

	/**
	 * 确认 按钮触发的调用
	 */
	okHandler : function() {
		var me = this, btn = me.okBtn;
		if (btn && !btn.disabled) {
			me.setValue(this.getValue());
			me.fireEvent('select', me, me.value);
			me.onSelect();
		}
	},

	cacheWidth : function() {
		var me = this, padding = me.parseBox(me.padding), widthEl = Ext
				.getBody().createChild({
							cls : me.baseCls + ' ' + me.borderBoxCls,
							style : 'position:absolute;top:-1000px;left:-1000px;'
						});

		me.self.prototype.width = widthEl.getWidth() + padding.left
				+ padding.right;
		widthEl.destroy();
	},

	/**
	 * @inheritdoc
	 * @private
	 */
	onRender : function(container, position) {
		var me = this, dateCellSelector = 'div.' + me.baseCls + '-date';

		me.callParent(arguments);

		me.cells = me.eventEl.select('tbody td');
		me.textNodes = me.eventEl.query(dateCellSelector);

		me.eventEl.set({
					'aria-labelledby' : me.monthBtn.id
				});

		me.mon(me.eventEl, {
					scope : me,
					mousewheel : me.handleMouseWheel,
					click : {
						fn : me.handleDateClick,
						delegate : dateCellSelector
					}
				});

	},

	/**
	 * @inheritdoc
	 * @private
	 */
	initEvents : function() {
		var me = this;

		me.callParent();

		// If we're part of a date field, don't allow us to focus on mousedown,
		// the field will handle that. If we are standalone, then allow the
		// default
		// behaviour to occur to receive focus
		if (me.pickerField) {
			me.el.on('mousedown', me.onMouseDown, me);
		}

		// Month button is pointer interactive only, it should not be allowed to
		// focus.
		me.monthBtn.el.on('mousedown', me.onMouseDown, me);

		me.prevRepeater = new Ext.util.ClickRepeater(me.prevEl, {
					handler : me.showPrevMonth,
					scope : me,
					mousedownStopEvent : true
				});

		me.nextRepeater = new Ext.util.ClickRepeater(me.nextEl, {
					handler : me.showNextMonth,
					scope : me,
					mousedownStopEvent : true
				});

		me.keyNav = new Ext.util.KeyNav(me.eventEl, Ext.apply({
			scope : me,

			left : function(e) {
				if (e.ctrlKey) {
					this.showPrevMonth();
				} else {
					this
							.update(Ext.Date.add(this.activeDate, Ext.Date.DAY,
									-1));
				}

				// We need to prevent default to avoid scrolling the nearest
				// container
				// which in case of a floating Date picker will be the document
				// body.
				// This applies to all navigation keys.
				e.preventDefault();
			},

			right : function(e) {
				if (e.ctrlKey) {
					this.showNextMonth();
				} else {
					this.update(Ext.Date.add(this.activeDate, Ext.Date.DAY, 1));
				}

				e.preventDefault();
			},

			up : function(e) {
				// This is non-standard behavior kept for backward
				// compatibility.
				// Ctrl-PageUp is reverse to this and it should be used instead.
				if (e.ctrlKey) {
					this.showNextYear();
				} else {
					this
							.update(Ext.Date.add(this.activeDate, Ext.Date.DAY,
									-7));
				}

				e.preventDefault();
			},

			down : function(e) {
				// This is non-standard behavior kept for backward
				// compatibility.
				// Ctrl-PageDown is reverse to this and it should be used
				// instead.
				if (e.ctrlKey) {
					this.showPrevYear();
				} else {
					this.update(Ext.Date.add(this.activeDate, Ext.Date.DAY, 7));
				}

				e.preventDefault();
			},

			pageUp : function(e) {
				if (e.ctrlKey) {
					this.showPrevYear();
				} else {
					this.showPrevMonth();
				}

				e.preventDefault();
			},

			pageDown : function(e) {
				if (e.ctrlKey) {
					this.showNextYear();
				} else {
					this.showNextMonth();
				}

				e.preventDefault();
			},

			home : function(e) {
				this.update(Ext.Date.getFirstDateOfMonth(this.activeDate));

				e.preventDefault();
			},

			end : function(e) {
				this.update(Ext.Date.getLastDateOfMonth(this.activeDate));

				e.preventDefault();
			},

			tab : function(e) {
				// When the picker is floating and attached to an input field,
				// its
				// 'select' handler will focus the inputEl so when navigation
				// happens
				// it does so as if the input field was focused all the time.
				// This is the desired behavior and we try not to interfere with
				// it
				// in the picker itself, see below.
				this.handleTabKey(e);

				// Allow default behaviour of TAB - it MUST be allowed to
				// navigate.
				return true;
			},

			enter : function(e) {
				this.handleDateClick(e, this.activeCell.firstChild);
			},

			space : function(e) {
				var me = this, pickerField = me.pickerField, startValue, value, pickerValue;

				me.setValue(new Date(me.activeCell.firstChild.dateValue));

				if (pickerField) {
					startValue = me.startValue;
					value = me.value;
					pickerValue = pickerField.getValue();

					if (pickerValue && startValue
							&& pickerValue.getTime() === value.getTime()) {
						pickerField.setValue(startValue);
					} else {
						pickerField.setValue(value);
					}
				}

				// Space key causes scrolling, too :(
				e.preventDefault();
			}
		}, me.keyNavConfig));

		if (me.disabled) {
			me.syncDisabled(true, true);
		}

		me.update(me.value);
	},

	onMouseDown : function(e) {
		e.preventDefault();
	},

	handleTabKey : function(e) {
		var me = this, t = me.getSelectedDate(me.activeDate), handler = me.handler;

		// The following code is like handleDateClick without the e.stopEvent()
		if (!me.disabled && t.dateValue
				&& !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
			me.setValue(new Date(t.dateValue));
			me.fireEvent('select', me, me.value);
			if (handler) {
				Ext.callback(handler, me.scope, [me, me.value], null, me, me);
			}
			me.onSelect();
		}
		// Even if the above condition is not met we have to let the field know
		// that we're tabbing out - that's user action we can do nothing about
		else {
			me.fireEventArgs('tabout', [me]);
		}
	},

	getSelectedDate : function(date) {
		var me = this, t = date.getTime(), cells = me.cells, cls = me.selectedCls, cellItems = cells.elements, cLen = cellItems.length, cell, c;

		cells.removeCls(cls);

		for (c = 0; c < cLen; c++) {
			cell = cellItems[c].firstChild;
			if (cell.dateValue === t) {
				return cell;
			}
		}
		return null;
	},

	/**
	 * Setup the disabled dates regex based on config options
	 * 
	 * @private
	 */
	initDisabledDays : function() {
		var me = this, dd = me.disabledDates, re = '(?:', len, d, dLen, dI;

		if (!me.disabledDatesRE && dd) {
			len = dd.length - 1;

			dLen = dd.length;

			for (d = 0; d < dLen; d++) {
				dI = dd[d];

				re += Ext.isDate(dI) ? '^'
						+ Ext.String.escapeRegex(Ext.Date.dateFormat(dI,
								me.format)) + '$' : dI;
				if (d !== len) {
					re += '|';
				}
			}

			me.disabledDatesRE = new RegExp(re + ')');
		}
	},

	/**
	 * Replaces any existing disabled dates with new values and refreshes the
	 * DatePicker.
	 * 
	 * @param {String[]/RegExp}
	 *            disabledDates An array of date strings (see the
	 *            {@link #disabledDates} config for details on supported
	 *            values), or a JavaScript regular expression used to disable a
	 *            pattern of dates.
	 * @return {Ext.picker.Date} this
	 */
	setDisabledDates : function(dd) {
		var me = this;

		if (Ext.isArray(dd)) {
			me.disabledDates = dd;
			me.disabledDatesRE = null;
		} else {
			me.disabledDatesRE = dd;
		}
		me.initDisabledDays();
		me.update(me.value, true);
		return me;
	},

	/**
	 * Replaces any existing disabled days (by index, 0-6) with new values and
	 * refreshes the DatePicker.
	 * 
	 * @param {Number[]}
	 *            disabledDays An array of disabled day indexes. See the
	 *            {@link #disabledDays} config for details on supported values.
	 * @return {Ext.picker.Date} this
	 */
	setDisabledDays : function(dd) {
		this.disabledDays = dd;
		return this.update(this.value, true);
	},

	/**
	 * Replaces any existing {@link #minDate} with the new value and refreshes
	 * the DatePicker.
	 * 
	 * @param {Date}
	 *            value The minimum date that can be selected
	 * @return {Ext.picker.Date} this
	 */
	setMinDate : function(dt) {
		this.minDate = dt;
		return this.update(this.value, true);
	},

	/**
	 * Replaces any existing {@link #maxDate} with the new value and refreshes
	 * the DatePicker.
	 * 
	 * @param {Date}
	 *            value The maximum date that can be selected
	 * @return {Ext.picker.Date} this
	 */
	setMaxDate : function(dt) {
		this.maxDate = dt;
		return this.update(this.value, true);
	},

	/**
	 * Sets the value of the date field
	 * 
	 * @param {Date}
	 *            value The date to set
	 * @return {Ext.picker.Date} this
	 */
	setValue : function(value, isfixed) {
		// If passed a null value just pass in a new date object.

		var me = this;
		// 这里一定要用 Ext.Date.clone ，不然不会触发 isDirty事件
		this.value = Ext.Date.clone(value || new Date());

		if (isfixed !== true) {
			this.value.setHours(me.hourField.getValue());
			this.value.setMinutes(me.minuteField.getValue());
			if (!me.disableSecond)
				this.value.setSeconds(me.secondField.getValue());
			else
				this.value.setSeconds(0);
		}
		return this.update(this.value);
	},

	/**
	 * Gets the current selected value of the date field
	 * 
	 * @return {Date} The selected date
	 */
	getValue : function() {
		return this.value;
	},

	// <locale type="function">
	/**
	 * Gets a single character to represent the day of the week
	 * 
	 * @return {String} The character
	 */
	getDayInitial : function(value) {
		 return value.substr(value.length - 1);
	},
	// </locale>

	/**
	 * @inheritdoc
	 * @private
	 */
	onEnable : function() {
		var me = this;

		me.callParent();
		me.syncDisabled(false, true);
		me.update(me.activeDate);

	},

	/**
	 * @inheritdoc
	 * @private
	 */
	onShow : function() {
		var me = this;

		me.callParent();
		me.syncDisabled(false);
		if (me.pickerField) {
			me.startValue = me.pickerField.getValue();
		}
	},

	/**
	 * @inheritdoc
	 * @private
	 */
	onHide : function() {
		this.callParent();
		this.syncDisabled(true);
	},

	/**
	 * @inheritdoc
	 * @private
	 */
	onDisable : function() {
		this.callParent();
		this.syncDisabled(true, true);
	},

	/**
	 * Get the current active date.
	 * 
	 * @private
	 * @return {Date} The active date
	 */
	getActive : function() {
		return this.activeDate || this.value;
	},

	/**
	 * Run any animation required to hide/show the month picker.
	 * 
	 * @private
	 * @param {Boolean}
	 *            isHide True if it's a hide operation
	 */
	runAnimation : function(isHide) {
		var picker = this.monthPicker, options = {
			duration : 200,
			callback : function() {
				picker.setVisible(!isHide);
			}
		};

		if (isHide) {
			picker.el.slideOut('t', options);
		} else {
			picker.el.slideIn('t', options);
		}
	},

	/**
	 * Hides the month picker, if it's visible.
	 * 
	 * @param {Boolean}
	 *            [animate] Indicates whether to animate this action. If the
	 *            animate parameter is not specified, the behavior will use
	 *            {@link #disableAnim} to determine whether to animate or not.
	 * @return {Ext.picker.Date} this
	 */
	hideMonthPicker : function(animate) {
		var me = this, picker = me.monthPicker;

		if (picker && picker.isVisible()) {
			if (me.shouldAnimate(animate)) {
				me.runAnimation(true);
			} else {
				picker.hide();
			}
		}
		return me;
	},

	doShowMonthPicker : function() {
		// Wrap in an extra call so we can prevent the button
		// being passed as an animation parameter.
		this.showMonthPicker();
	},

	doHideMonthPicker : function() {
		// Wrap in an extra call so we can prevent this
		// being passed as an animation parameter
		this.hideMonthPicker();
	},

	/**
	 * Show the month picker
	 * 
	 * @param {Boolean}
	 *            [animate] Indicates whether to animate this action. If the
	 *            animate parameter is not specified, the behavior will use
	 *            {@link #disableAnim} to determine whether to animate or not.
	 * @return {Ext.picker.Date} this
	 */
	showMonthPicker : function(animate) {
		var me = this, el = me.el, picker;

		if (me.rendered && !me.disabled) {
			picker = me.createMonthPicker();
			if (!picker.isVisible()) {
				picker.setValue(me.getActive());
				picker.setSize(el.getSize());

				// Null out floatParent so that the [-1, -1] position is not
				// made relative to this
				picker.floatParent = null;
				picker.setPosition(-el.getBorderWidth('l'), -el
								.getBorderWidth('t'));
				if (me.shouldAnimate(animate)) {
					me.runAnimation(false);
				} else {
					picker.show();
				}
			}
		}
		return me;
	},

	/**
	 * Checks whether a hide/show action should animate
	 * 
	 * @private
	 * @param {Boolean}
	 *            [animate] A possible animation value
	 * @return {Boolean} Whether to animate the action
	 */
	shouldAnimate : function(animate) {
		return Ext.isDefined(animate) ? animate : !this.disableAnim;
	},

	/**
	 * Create the month picker instance
	 * 
	 * @private
	 * @return {Ext.picker.Month} picker
	 */
	createMonthPicker : function() {
		var me = this, picker = me.monthPicker;

		if (!picker) {
			me.monthPicker = picker = new Ext.picker.Month({
						renderTo : me.el,
						// We need to set the ownerCmp so that owns() can
						// correctly
						// match up the component hierarchy so that focus does
						// not leave
						// an owning picker field if/when this gets focus.
						ownerCmp : me,
						floating : true,
						padding : me.padding,
						shadow : false,
						small : me.showToday === false,
						footerButtonUI : me.footerButtonUI,
						listeners : {
							scope : me,
							cancelclick : me.onCancelClick,
							okclick : me.onOkClick,
							yeardblclick : me.onOkClick,
							monthdblclick : me.onOkClick
						}
					});
			if (!me.disableAnim) {
				// hide the element if we're animating to prevent an initial
				// flicker
				picker.el.setStyle('display', 'none');
			}
			picker.hide();
			me.on('beforehide', me.doHideMonthPicker, me);
		}
		return picker;
	},

	/**
	 * Respond to an ok click on the month picker
	 * 
	 * @private
	 */
	onOkClick : function(picker, value) {
		var me = this, month = value[0], year = value[1], date = new Date(year,
				month, me.getActive().getDate());

		if (date.getMonth() !== month) {
			// 'fix' the JS rolling date conversion if needed
			date = Ext.Date.getLastDateOfMonth(new Date(year, month, 1));
		}
		me.setValue(date);
		me.hideMonthPicker();
	},

	/**
	 * Respond to a cancel click on the month picker
	 * 
	 * @private
	 */
	onCancelClick : function() {
		this.selectedUpdate(this.activeDate);
		this.hideMonthPicker();
	},

	/**
	 * Show the previous month.
	 * 
	 * @param {Object}
	 *            e
	 * @return {Ext.picker.Date} this
	 */
	showPrevMonth : function(e) {
		return this.setValue(Ext.Date.add(this.activeDate, Ext.Date.MONTH, -1));
	},

	/**
	 * Show the next month.
	 * 
	 * @param {Object}
	 *            e
	 * @return {Ext.picker.Date} this
	 */
	showNextMonth : function(e) {
		return this.setValue(Ext.Date.add(this.activeDate, Ext.Date.MONTH, 1));
	},

	/**
	 * Show the previous year.
	 * 
	 * @return {Ext.picker.Date} this
	 */
	showPrevYear : function() {
		return this.setValue(Ext.Date.add(this.activeDate, Ext.Date.YEAR, -1));
	},

	/**
	 * Show the next year.
	 * 
	 * @return {Ext.picker.Date} this
	 */
	showNextYear : function() {
		return this.setValue(Ext.Date.add(this.activeDate, Ext.Date.YEAR, 1));
	},

	/**
	 * Respond to the mouse wheel event
	 * 
	 * @private
	 * @param {Ext.event.Event}
	 *            e
	 */
	handleMouseWheel : function(e) {
		var delta;

		e.stopEvent();

		if (!this.disabled) {
			delta = e.getWheelDelta();

			if (delta > 0) {
				this.showPrevMonth();
			} else if (delta < 0) {
				this.showNextMonth();
			}
		}
	},

	/**
	 * Respond to a date being clicked in the picker
	 * 
	 * @private
	 * @param {Ext.event.Event}
	 *            e
	 * @param {HTMLElement}
	 *            t
	 */
	handleDateClick : function(e, t) {
		var me = this, handler = me.handler;

		e.stopEvent();

		if (!me.disabled && t.dateValue
				&& !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
			me.setValue(new Date(t.dateValue));
			me.fireEvent('select', me, me.value);

			if (handler) {
				Ext.callback(handler, me.scope, [me, me.value], null, me, me);
			}

			// event handling is turned off on hide
			// when we are using the picker in a field
			// therefore onSelect comes AFTER the select
			// event.
			me.onSelect();
		}
	},

	/**
	 * Perform any post-select actions
	 * 
	 * @private
	 */
	onSelect : function() {
		if (this.hideOnSelect) {
			this.hide();
		}
	},

	/**
	 * Sets the current value to today.
	 * 
	 * @return {Ext.picker.Date} this
	 */
	selectToday : function() {
		var me = this, btn = me.todayBtn, handler = me.handler;

		if (btn && !btn.disabled) {
			var date = new Date();
			me.hourField.setValue(date.getHours());
			me.minuteField.setValue(date.getMinutes());
			if (!me.disableSecond)
				me.secondField.setValue(date.getSeconds());
			else
				date.setSeconds(0);
			me.setValue(date);
			me.fireEvent('select', me, me.value);
			if (handler) {
				Ext.callback(handler, me.scope, [me, me.value], null, me, me);
			}
			me.onSelect();
		}
		return me;
	},

	/**
	 * Update the selected cell
	 * 
	 * @private
	 * @param {Date}
	 *            date The new date
	 */
	selectedUpdate : function(date) {
		var me = this, t = Ext.Date.clearTime(date, true).getTime(), cells = me.cells, cls = me.selectedCls, c, cLen = cells
				.getCount(), cell;

		me.eventEl.dom.setAttribute('aria-busy', 'true');

		cell = me.activeCell;

		if (cell) {
			Ext.fly(cell).removeCls(cls);
			cell.setAttribute('aria-selected', false);
		}

		for (c = 0; c < cLen; c++) {
			cell = cells.item(c);

			if (me.textNodes[c].dateValue === t) {
				me.activeCell = cell.dom;
				me.eventEl.dom.setAttribute('aria-activedescendant',
						cell.dom.id);
				cell.dom.setAttribute('aria-selected', true);
				cell.addCls(cls);
				me.fireEvent('highlightitem', me, cell);
				break;
			}
		}

		me.eventEl.dom.removeAttribute('aria-busy');
	},

	/**
	 * Update the contents of the picker for a new month
	 * 
	 * @private
	 * @param {Date}
	 *            date The new date
	 */
	fullUpdate : function(date) {
		var me = this, cells = me.cells.elements, textNodes = me.textNodes, disabledCls = me.disabledCellCls, eDate = Ext.Date, i = 0, extraDays = 0, newDate = +eDate
				.clearTime(date, true), today = +eDate.clearTime(new Date()), min = me.minDate
				? eDate.clearTime(me.minDate, true)
				: Number.NEGATIVE_INFINITY, max = me.maxDate ? eDate.clearTime(
				me.maxDate, true) : Number.POSITIVE_INFINITY, ddMatch = me.disabledDatesRE, ddText = me.disabledDatesText, ddays = me.disabledDays
				? me.disabledDays.join('')
				: false, ddaysText = me.disabledDaysText, format = me.format, days = eDate
				.getDaysInMonth(date), firstOfMonth = eDate
				.getFirstDateOfMonth(date), startingPos = firstOfMonth.getDay()
				- me.startDay, previousMonth = eDate.add(date, eDate.MONTH, -1), ariaTitleDateFormat = me.ariaTitleDateFormat, prevStart, current, disableToday, tempDate, setCellClass, html, cls, formatValue, value;

		if (startingPos < 0) {
			startingPos += 7;
		}

		days += startingPos;
		prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;
		current = new Date(previousMonth.getFullYear(), previousMonth
						.getMonth(), prevStart, me.initHour);

		if (me.showToday) {
			tempDate = eDate.clearTime(new Date());
			disableToday = (tempDate < min
					|| tempDate > max
					|| (ddMatch && format && ddMatch.test(eDate.dateFormat(
							tempDate, format))) || (ddays && ddays
					.indexOf(tempDate.getDay()) !== -1));

			me.todayDisabled = disableToday;
			if (!me.disabled) {
				me.todayBtn.setDisabled(disableToday);
			}
		}

		setCellClass = function(cellIndex, cls) {
			var cell = cells[cellIndex], describedBy = [];

			// Cells are not rendered with ids
			if (!cell.hasAttribute('id')) {
				cell.setAttribute('id', me.id + '-cell-' + cellIndex);
			}

			// store dateValue number as an expando
			value = +eDate.clearTime(current, true);
			cell.firstChild.dateValue = value;

			cell.setAttribute('aria-label', eDate.format(current,
							ariaTitleDateFormat));

			// Here and below we can't use title attribute instead of data-qtip
			// because JAWS will announce title value before cell content
			// which is not what we need. Also we are using aria-describedby
			// attribute
			// and not placing the text in aria-label because some cells may
			// have
			// compound descriptions (like Today and Disabled day).
			cell.removeAttribute('aria-describedby');
			cell.removeAttribute('data-qtip');

			if (value === today) {
				cls += ' ' + me.todayCls;
				describedBy.push(me.id + '-todayText');
			}

			if (value === newDate) {
				me.activeCell = cell;
				me.eventEl.dom.setAttribute('aria-activedescendant', cell.id);
				cell.setAttribute('aria-selected', true);
				cls += ' ' + me.selectedCls;
				me.fireEvent('highlightitem', me, cell);
			} else {
				cell.setAttribute('aria-selected', false);
			}

			if (value < min) {
				cls += ' ' + disabledCls;
				describedBy.push(me.id + '-ariaMinText');
				cell.setAttribute('data-qtip', me.minText);
			} else if (value > max) {
				cls += ' ' + disabledCls;
				describedBy.push(me.id + '-ariaMaxText');
				cell.setAttribute('data-qtip', me.maxText);
			} else if (ddays && ddays.indexOf(current.getDay()) !== -1) {
				cell.setAttribute('data-qtip', ddaysText);
				describedBy.push(me.id + '-ariaDisabledDaysText');
				cls += ' ' + disabledCls;
			} else if (ddMatch && format) {
				formatValue = eDate.dateFormat(current, format);
				if (ddMatch.test(formatValue)) {
					cell.setAttribute('data-qtip', ddText.replace('%0',
									formatValue));
					describedBy.push(me.id + '-ariaDisabledDatesText');
					cls += ' ' + disabledCls;
				}
			}

			if (describedBy.length) {
				cell.setAttribute('aria-describedby', describedBy.join(' '));
			}

			cell.className = cls + ' ' + me.cellCls;
		};

		me.eventEl.dom.setAttribute('aria-busy', 'true');

		for (; i < me.numDays; ++i) {
			if (i < startingPos) {
				html = (++prevStart);
				cls = me.prevCls;
			} else if (i >= days) {
				html = (++extraDays);
				cls = me.nextCls;
			} else {
				html = i - startingPos + 1;
				cls = me.activeCls;
			}
			textNodes[i].innerHTML = html;
			current.setDate(current.getDate() + 1);
			setCellClass(i, cls);
		}

		me.eventEl.dom.removeAttribute('aria-busy');

		me.monthBtn.setText(Ext.Date.format(date, me.monthYearFormat));
		// 加入的
		me.hourField.setValue(date.getHours());
		me.minuteField.setValue(date.getMinutes());
		if (!me.disableSecond)
			me.secondField.setValue(date.getSeconds());

	},

	/**
	 * Update the contents of the picker
	 * 
	 * @private
	 * @param {Date}
	 *            date The new date
	 * @param {Boolean}
	 *            forceRefresh True to force a full refresh
	 */
	update : function(date, forceRefresh) {
		var me = this, active = me.activeDate;
		me.hourField.setValue(date.getHours());
		me.minuteField.setValue(date.getMinutes());
		if (!me.disableSecond)
			me.secondField.setValue(date.getSeconds());
		if (me.rendered) {
			me.activeDate = date;
			if (!forceRefresh && active && me.el
					&& active.getMonth() === date.getMonth()
					&& active.getFullYear() === date.getFullYear()) {
				me.selectedUpdate(date, active);
			} else {
				me.fullUpdate(date, active);
			}
		}
		return me;
	},

	doDestroy : function() {
		var me = this;

		if (me.rendered) {
			Ext.destroy(me.keyNav, me.monthPicker, me.monthBtn,
					me.nextRepeater, me.prevRepeater, me.todayBtn,
					me.todayElSpan, me.hourField, me.minuteField,
					me.secondField, me.okBtn);
		}

		me.callParent();
	},

	privates : {
		// Do the job of a container layout at this point even though we are not
		// a Container.
		// TODO: Refactor as a Container.
		finishRenderChildren : function() {
			var me = this;

			me.callParent();
			me.monthBtn.finishRender();
			// 加入的
			me.hourField.finishRender();
			me.minuteField.finishRender();
			if (!me.disableSecond)
				me.secondField.finishRender();

			if (me.showToday) {
				me.okBtn.finishRender();
				me.todayBtn.finishRender();
			}
		},

		getFocusEl : function() {
			return this.eventEl;
		},

		/**
		 * Set the disabled state of various internal components
		 * 
		 * @param {Boolean}
		 *            disabled
		 * @private
		 */
		syncDisabled : function(disabled, doButton) {
			var me = this, keyNav = me.keyNav, todayBtn = me.todayBtn;

			// If we have one, we have all
			if (keyNav) {
				keyNav.setDisabled(disabled);
				me.prevRepeater.setDisabled(disabled);
				me.nextRepeater.setDisabled(disabled);
			}
			if (doButton && todayBtn) {
				todayBtn.setDisabled(me.todayDisabled || disabled);
			}
		}
	}
});