import express from "express";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import uuid from "uuid/v4";
import passport from "passport";
// initialize GraphqlLocalStrategy
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";

import User from "./database/userDummy";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

require("dotenv").config();

/**
 * Entry point for the server
 */

/**
 * Initialize Passport
 */
passport.use(
  new GraphQLLocalStrategy((email, password, done) => {
    const users = User.getUsers();
    const matchingUser = users.find(
      user => email === user.email && password === user.password
    );
    const error = matchingUser ? null : new Error("no matching user");
    done(error, matchingUser);
  })
);

/**
  * Sessions
       In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request.
       If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
       Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
       In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // const matchUser = User.findById(id);
  // console.log("AAAA", matchUser);
  // done(null, matchUser);
  const users = User.getUsers();
  const matchingUser = users.find(user => user.id === id);
  done(null, matchingUser);
});

const PORT = 4000;

const app = express();

/**
 * express-session - manages user sessions for you. Save session data in storage you choose
 * See - https://github.com/expressjs/session
 */

const expressSession = {
  genid: req => uuid(),
  secret: process.env.SESSION_SECRET,
  // see - https://github.com/expressjs/session#resave
  resave: false,
  // see - https://github.com/expressjs/session#saveuninitialized
  saveUninitialized: false,
  /**
   * For using secure cookies in production, but allowing for testing in development,
   *  the following is an example of enabling this setup based on NODE_ENV in express:
   */
  cookie: { secure: false }
};
if (app.get("env") === "production") {
  expressSession.cookie.secure = true;
}

app.use(session(expressSession));

/**
 * Initialize Passport middleware
 */

app.use(passport.initialize());
app.use(passport.session());

/**
 * Iinitialize apollo server
 */

const server = new ApolloServer({
  typeDefs,
  resolvers,
  /**
   * we need to prepare the GraphQL context to make certain Passport functions accessible from the resolvers
   */
  context: ({ req, res }) => buildContext({ req, res, User })
});

server.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
