const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User context not found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Role ${req.user.role} is unauthorized.` });
    }

    next();
  };
};

const restrictToInstitution = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User context not found' });
  }

  // System Admin and Directorate levels have global access
  if (['SYSTEM_ADMIN', 'DIRECTORATE_ADMIN', 'DIRECTORATE_OFFICER'].includes(req.user.role)) {
    return next();
  }

  // For other roles, compare their institution with the requested institution
  const userInstitution = req.user.institution;
  const targetInstitution = req.body.institution || req.query.institution || req.params.institution;

  if (!userInstitution) {
    return res.status(403).json({ message: 'User is not assigned to any institution.' });
  }

  if (targetInstitution && targetInstitution !== userInstitution) {
    return res.status(403).json({ message: 'Access Denied: You cannot access or modify another institution\'s data.' });
  }

  next();
};

module.exports = { checkRole, restrictToInstitution };
