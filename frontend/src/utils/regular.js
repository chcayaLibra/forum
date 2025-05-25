export function isValidateAccount(account) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/
  return regex.test(account)
}

export function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return regex.test(email)
}

export function isValidPassword(password) {
  const regex = /^[^\s]{6,16}$/
  return regex.test(password)
}

export function lineBreakReplace(content) {
  return content.replace(/\n/g, '<br />')
}
