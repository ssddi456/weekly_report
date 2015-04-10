module.exports = {
  name : '测试项目',
  desc : '测试项目',
  stages  : {
    type : 'list',
    scheme : { 
      name : [
        '开发',
        '联调',
        '提测',
        '上线'
      ],
      time : {
        type  : 'date',
        value : '1月6日',
        format: 'mm月dd日'
      }
    },
    default_value : [
      {
        name : '开发',
        time : '1月6日'
      },
      {
        name : '联调',
        time : '1月6日'
      },
      {
        name : '提测',
        time : '1月6日'
      },
      {
        name : '上线',
        time : '1月6日'
      }
    ]
  },
  managers: {
    type : 'list',
    default_value : ['李海波'],
    scheme : '李海波'
  },
  status : [
    '未开始',
    '开发中',
    '联调中',
    '测试中',
    '已上线'
  ],
  current_week_work : '开发',
  next_week_work    : '提测'
}