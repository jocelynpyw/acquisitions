import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationErrors } from '#utils/fotmat.js';
import { jwttocken } from '#utils/jwt.js';
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

    logger.info(
      `Signing up user with email: ${email} , name: ${name}  password:${password} , role: ${role} `
    );

    // AUTH SERVICE

    const user = await createUser({ name, email, password, role });

    const token = jwttocken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User signed up successfully: ${email} `);
    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.is,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
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
