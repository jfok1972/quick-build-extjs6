function planReturn_function(param) {
  var grid = param.grid,
    record = param.record;
  if (record.get('tfPayoutstatus') != '可支付') {
    EU.toastInfo('当前还款计划状态是『' + record.get('tfPayoutstatus') + '』尚不可还款或已经完成还款!');
    return;
  }
  var moduleinfo = modules.getModuleInfo('Liabilitydetailfact'),
    window = moduleinfo.getNewWindow(true);
  var pf = {
    moduleName : 'Liabilitydetailplan',
    fieldvalue : record.getIdValue(),
    text : record.getTitleTpl(),
    operator : '=',
    fieldahead : 'liabilitydetailplan',
    fieldName : 'tfPlanid'
  };
  window.down('form').closeOnSave = true;
  window.down('form').hideNextButton();
  window.show(null, null, null, pf);
  window.addListener('close', function() {
    record.refreshRecord();
  })
}
