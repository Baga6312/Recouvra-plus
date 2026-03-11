const methodNotAllowed = (req, res) => {
  res.status(405).json({ message: `Méthode ${req.method} non autorisée sur cette route` });
};

module.exports = methodNotAllowed;
