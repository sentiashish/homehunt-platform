export const PASSWORD_RULE_TEXT =
  'Use 8-20 characters with at least 1 uppercase letter, 1 lowercase letter, and 1 number. Only letters and numbers are allowed.'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/

export function isStrongPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
