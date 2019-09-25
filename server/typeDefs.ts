import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Query {
    currentUser: User
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): AuthPayload
    logout: Boolean
  }
`;

export default typeDefs;
