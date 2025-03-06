const responseMessage = {
  EMAIL_ALREADY_EXISTS: 'The provided email address is already in use.',
  INVALID_CREDENTIALS: 'The email or password you entered is incorrect.',
  INVALID_USER: 'User not found. Please check your details.',
  NOT_FOUND: (entity: string) => `${entity} was not found. Please verify and try again.`,
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  SIGNIN_SUCCESS: 'You have successfully signed in.',
  SIGNOUT_SUCCESS: 'You have successfully signed out.',
  SUCCESS: 'User registration was successful.',
  TOO_MANY_REQUEST: 'Too many requests detected. Please try again after some time.',
  USER_ALREADY_EXISTS: 'A user with this email address already exists.'
};

export default responseMessage;
