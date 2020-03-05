// 按需导入extend函数
// 1.导入localize函数
import { extend, localize } from 'vee-validate'

// 2.导入需要的语言包
import zhCN from 'vee-validate/dist/locale/zh_CN.json'
// 导入全部规则
import * as rules from 'vee-validate/dist/rules'

// 3.注册语言包
localize({ zhCN })
// 4.激活当前语言
localize('zhCN')

// Object.keys(rules) -- 返回rules该对象全部成员名称，以数组形式返回
// 返回的全部对象进行遍历
Object.keys(rules).forEach(rule => {
  // extend(规则名称，规则内容) -- 注册规则
  // rule：代表各个规则名称
  // rules[rule]：代表规则内容
  extend(rule, rules[rule])
})
// 自定义校验规则
// phone：规则名称
// value：被校验的数据
// message：错误提示信息
extend('phone', {
  validate: value => {
    // 校验成功返回true，否则返回false
    // 定义手机正则，匹配
    const reg = /^1[35789]\d{9}$/
    return reg.test(value)
  },
  // {_filed_}代表ValidationProvider的name属性值
  message: '{_field_}格式不正确'
})
