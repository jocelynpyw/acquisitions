import logger from '#config/logger.js';
import { formatValidationErrors } from '#utils/fotmat.js';
import { signUpSchema } from '#validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = await signUpSchema.safeParseAsync(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, name, password, role } = validationResult.data;

    // AUTH SERVICE

    logger.info(`User signed up successfully: ${email} `);
    res.status(201).json({
      message: 'User signed up successfully',
      user: { id: 1, name, email, role },
    });
  } catch (e) {
    logger.error('Signup error:', e);

    if (e.name === 'User with this email already exists') {
      return res
        .statut(409)
        .json({ message: 'User with this email already exists' });
    }

    next(e);
  }
};
