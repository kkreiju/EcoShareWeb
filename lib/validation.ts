// Validation utilities for user data

export function validateEmail(email: any) {
  if (!email || typeof email !== 'string') {
    return false
  }
  
  // More comprehensive email regex that handles common email formats
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email.trim().toLowerCase())
}

export function validatePassword(password: any) {
  // At least 8 characters, contains at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  return passwordRegex.test(password)
}

export function validatePhone(phone: any) {
  // Basic phone validation - accepts various formats
  if (!phone) return true // Phone is optional
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export function validateUserData(userData: any) {
  const errors = []
  
  if (!userData.email) {
    errors.push("Email is required")
  } else if (!validateEmail(userData.email)) {
    console.log('Email validation failed for:', userData.email)
    errors.push("Invalid email format")
  }
  
  if (!userData.password) {
    errors.push("Password is required")
  } else if (!validatePassword(userData.password)) {
    errors.push("Password must be at least 8 characters and contain at least one letter and one number")
  }
  
  if (!userData.firstName) {
    errors.push("First name is required")
  }
  
  // Middle name is optional, but if provided, should not be empty string
  if (userData.middleName !== undefined && userData.middleName !== null && userData.middleName.trim() === '') {
    errors.push("Middle name cannot be empty if provided")
  }

  if (!userData.lastName) {
    errors.push("Last name is required")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}