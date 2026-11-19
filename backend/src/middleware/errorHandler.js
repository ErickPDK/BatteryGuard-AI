export function errorHandler(error, _request, response, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  const message = status === 500 ? "Error interno del servidor" : error.message;

  if (status === 500) {
    console.error(error);
  }

  response.status(status).json({
    error: {
      message,
      ...(error.details ? { details: error.details } : {})
    }
  });
}
