import { useRouter } from 'next/router'
import Link from 'next/link'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification link has expired or has already been used.',
  Default: 'An error occurred during authentication.',
}

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  const errorMessage = error && typeof error === 'string' 
    ? errorMessages[error as keyof typeof errorMessages] || errorMessages.Default
    : errorMessages.Default

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Authentication Error
          </h2>
        </div>
        <div className='mt-8 space-y-6'>
          <div className='rounded-md bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>
                  {errorMessage}
                </h3>
              </div>
            </div>
          </div>
          
          <div className='flex justify-center space-x-4'>
            <Link
              href='/auth/signin'
              className='text-sm font-medium text-blue-600 hover:text-blue-500'
            >
              Try signing in again
            </Link>
            <Link
              href='/'
              className='text-sm font-medium text-gray-600 hover:text-gray-500'
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}