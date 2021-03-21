import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} from 'graphql';

import Room from './types/room'

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        room:{
            type: Room,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            // resolve: async (source, args, { loaders }) => {
            //     return loaders.rooms.load(args.id);
            // },
            resolve: () =>{
                return 
            }
        }
    }
})
export default QueryType;