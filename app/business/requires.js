Ext.define('app.business.requires', {
  requires : [
      //xxc
      'app.business.xxc.EnterStateColumn',
      'app.business.xxc.ImportSalary',
      //mudupm
      'app.business.mudupm.AgreementPayment',
      'app.business.mudupm.Payout',
      'app.business.mudupm.Zjbf',
      //finance
      'app.business.finance.liabilityStatusColumn', 'app.business.finance.planReturnStatusColumn',
      'app.business.finance.rateReturnStatusColumn', 'app.business.finance.dbStatusColumn',
      'app.business.finance.exportLiabilityInfoDetail', 'app.business.finance.aheadPlanReturnWindow',
      'app.business.finance.financeFunction', 'app.business.finance.downPlanReturnWindow',
      'app.business.finance.liabilityCanDoColumn'
  //
  ]
})