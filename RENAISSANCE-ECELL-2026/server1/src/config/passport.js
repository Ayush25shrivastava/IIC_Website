
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js'; 

export default function(passport, config = process.env) {
  // Google sign-in is optional; CA/admin authentication does not use it.
  const clientID = config.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = config.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientID || !clientSecret) return false;

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: 'https://iic.mnnit.ac.in/api/v1/auth/google/callback' 
        //server callback URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          } else {
           
            const newUser = {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              isProfileComplete: false
            };
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
  return true;
}
