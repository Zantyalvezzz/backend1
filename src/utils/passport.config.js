import passport from "passport";
import jwt from "passport-jwt";
import User from "../models/user.model.js";

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["token"];
    }
    return token;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

export default initializePassport;
