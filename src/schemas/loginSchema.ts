import * as Yup from 'yup'

export const loginSchema = Yup.object({
  userID: Yup.string()
    .trim()
    .required('User ID is required')
    .min(3, 'User ID must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})
