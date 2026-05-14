// src/app/middleware/logger.js
const loggerMiddleware = storeAPI => next => action => {
  if (process.env.NODE_ENV !== 'development') return next(action);
  console.group(`Action: ${action.type}`);
  console.log('prev:', storeAPI.getState());
  console.log('action:', action);
  const result = next(action);
  console.log('next:', storeAPI.getState());
  console.groupEnd();
  return result;
};

export default loggerMiddleware;
