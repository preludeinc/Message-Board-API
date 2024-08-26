import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
const userModel = mongoose.model('user');
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

// Login Handler
const logInUser = (req, res) => {
  // generates a JWT Token
  jwt.sign(
    {
      sub: req.user._id,
      username: req.user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '20m' },
    (error, token) => {
      if (error) {
        res.status(400).send('Bad Request. Couldn\'t generate token');
      } else {
        res.status(200).json({ token });
      }
    }
  );
};

// POST Request Handler
const registerNewUser = async (req, res) => {
  try {
    const userExists = await alreadyExists(req.body.email, req.body.username);
    // if the user isn't in the database, they are added
    if (!userExists) {
      let user = await userModel.create(req.body);
      res.status(201).json(user);
    } else if (userExists) {
      res.status(403).send('Username or email already exists');
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send('Bad Request.');
  }
};

// helper function to determine if email / username
// already exists in the DB. Returns T or F
const alreadyExists = async (email, username) => {
  try {
    const userCheck = await userModel.exists({
      '$or': [
        { email: email },
        { username: username }
      ]
    });
    return userCheck;
  } catch (error) {
    console.log(error);
  }
}

passport.use(new LocalStrategy(
  async (userIdent, password, done) => {
    try {
      const user = await userModel.findOne({
        '$or': [
          { email: userIdent },
          { username: userIdent }
        ]
      }).exec();
      // user wasn't found
      if (!user) return done(null, false);
      // user was found, see if it's a valid password
      if (!await user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      // error searching for user
      return done(error)
    }
  }
));

// Configure JWT Token Auth
passport.use(new JwtStrategy(
  jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.sub).exec();
      if (!user) {
        // user wasn't found
        return done(null, false);
      } else {
        // user found!
        return done(null, user);
      }
    } catch (error) {
      // error in searching for user
      return done(error);
    }
  }
));


export { registerNewUser, logInUser };