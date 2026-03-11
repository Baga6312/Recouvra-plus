const { verifyToken } = require('../config/jwtConfig');
const User = require('../models/User');
const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé, token manquant',
      });
    }

    // Vérifier le token
    const decoded = verifyToken(token);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable ou désactivé',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide',
    });
  }
};
module.exports =  protect ;