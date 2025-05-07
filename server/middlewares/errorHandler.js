const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Valor duplicado en la base de datos' });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: messages });
    }
    
    res.status(500).json({ error: err.message || 'Error del servidor' });
  };

  module.exports = errorHandler;