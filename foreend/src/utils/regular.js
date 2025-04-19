export const isValidateAccount = (account) => {
  // 正则表达式：允许汉字、数字、英文，长度1-16个字符
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/

  // 使用 test() 方法进行匹配
  return regex.test(account)
}

export const isValidEmail = (email) => {
  // 正则表达式：用于匹配电子邮件地址的通用格式
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

  // 使用 test() 方法进行匹配
  return regex.test(email)
}

export const isValidPassword = (password) => {
  // 正则表达式：6-16个字符，允许数字、字母、符号，禁止空格
  const regex = /^[^\s]{6,16}$/

  // 使用 test() 方法进行匹配
  return regex.test(password)
}

export const lineBreakReplace = (content) => {
  return content.replace(/\n/g, '<br />')
}
