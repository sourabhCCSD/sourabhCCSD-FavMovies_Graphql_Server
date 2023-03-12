const graphql = require("graphql");
/* const _ = require('lodash'); */
const Movie = require("../Models/MoviesSchema");
const Director = require("../Models/DirectorSchema");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// creating schemas

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    // we bind the fields in arrow function so that book can get to know what AuthorType is.
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    movieImage: {type: GraphQLString},
    worldWideCollection: {type: GraphQLString},
    release: {type: GraphQLString},

    director: {
      type: DirectorType,
      resolve(parent, args) {
        //            return  _.find(authors, {id: parent.authorId})
        return Director.findById(parent.directorId); // one movie can have only one director.
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLString },
    directorImage: {type: GraphQLString},
    nationality: {type: GraphQLString},

    movie: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return _.filter(books, {authorId: parent.id})
        return Movie.find({ directorId: parent.id });
      },
    },
  }),
});

// creating entrypoints or the root queries

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // will add mongo query here
        // return _.find(books, {id: args.id}) // first argument is the array.
        return Movie.findById(args.id);
      }, // second argument is the particular book where the id matches.
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, {id: args.id})
        return Director.findById(args.id);
      },
    },

    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        //  return books
        return Movie.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Director.find({});
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLString) },
        directorImage: {type: new GraphQLNonNull(GraphQLString)},
        nationality: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args) {
        let director = new Director({
          name: args.name,
          age: args.age,
          nationality: args.nationality,
          directorImage: args.directorImage
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre: { type: new GraphQLNonNull(GraphQLString)},
        directorId: { type: new GraphQLNonNull(GraphQLID)},
       movieImage: { type: new GraphQLNonNull(GraphQLString)}, 
        worldWideCollection: { type: new GraphQLNonNull(GraphQLString)},
        release: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args) {
        let movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
         movieImage: args.movieImage, 
          worldWideCollection: args.worldWideCollection,
          release: args.release
        });
        return movie.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
