import { User } from '../database/sequelize.js';

export const getUsers = async (req, res, next) => {
  try {
    let admin = await User.findOne({ where: { id: req.user.id, roleId: req.user.roleId } });
    if (!admin) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}


export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Update user fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'password') { // Prevent password updates here
        user[key] = req.body[key];
      }
    })
    await user.save();

    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
}