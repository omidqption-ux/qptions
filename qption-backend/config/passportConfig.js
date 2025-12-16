import passport from 'passport'
import strategy from 'passport-google-oauth20'
const GoogleStrategy = strategy.Strategy
import User from '../models/User.js'
// Configure Google strategy
passport.use(
     new GoogleStrategy(
          {
               clientID:
                    '23687726117-q79kjj3caf4ts9ejfko65mkcf1e18dbu.apps.googleusercontent.com',
               clientSecret: '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',
               callbackURL:
                    process.env.NODE_ENV !== 'development'
                         ? 'https://api.qption.com/auth/google/callback'
                         : 'http://localhost:5000/auth/google/callback',
               proxy: process.env.NODE_ENV !== 'development',
          },
          (accessToken, refreshToken, profile, done) => {
               if (accessToken) handleUSerLogin(profile, done)
          }
     )
     // Facebook Strategy
)
const handleUSerLogin = async (profile, done) => {
     try {
          const user = await User.findOne({
               email: profile.emails[0].value,
          })
          if (!user) {
               const newUser = new User({
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleId: profile.id,
                    isEmailVerified: true,
                    profileImage: profile.photos[0].value,
               })
               await newUser.save()
               return done(null, newUser)
          } else {
               user.isEmailVerified = true
               user.googleId = profile.id
               user.firstName = profile.name.givenName
               user.lastName = profile.name.familyName
               user.profileImage = profile.photos[0].value
               await user.save()
               return done(null, user)
          }
     } catch (err) {
          return done(err)
     }
}
passport.serializeUser((user, done) => {
     done(null, user)
})

// Deserialize user from the session
passport.deserializeUser((user, done) => {
     done(null, user)
})
export default passport