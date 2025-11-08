const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Channel = require("@models/channel.model");
const { createUniqueHandle } = require("@libs/utils");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let channel = await Channel.findOne({ email: profile.emails[0].value });

        if (!channel) {
          const handle = await createUniqueHandle(
            profile.emails[0].value.split("@")[0]
          );
          channel = await Channel.create({
              name: `${profile.name.givenName} ${profile.name.familyName}`,
            handle: handle,
            email: profile.emails[0].value,
            logoURL: profile.photos[0].value.split("=")[0],
          });
        }

        cb(null, channel);
      } catch (error) {
        cb(error);
      }
    }
  )
);

passport.serializeUser((channel, done) => {
  done(null, channel?.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const channel = await Channel.findById(id);
    done(null, channel);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
