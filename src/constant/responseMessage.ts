const responseMessage = {
  SUCCESS: 'User registered successfully.',
  USER_ALREADY_EXISTS: 'A user with this email already exists.',
  EMAIL_ALREADY_EXISTS: 'Email is already in use.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  NOT_FOUND: (entity: string) => `${entity} not found`,
  TOO_MANY_REQUEST: 'Too many request, please try again after sometime.',
  SIGNIN_SUCCESS: 'Signin successful.',
  INVALID_USER: 'User not found.',
  INVALID_CREDENTIALS: 'Incorrect email or password.',
  SIGNOUT_SUCCESS: 'Signout successful.'
};

export default responseMessage;
