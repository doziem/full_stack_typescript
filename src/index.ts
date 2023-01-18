import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import mikroConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  const emFork = orm.em.fork();

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ emFork }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('Server Started on localhost:4000');
  });
  // const post = emFork.create(Post, {
  //   title: 'my fist name',
  //   createdAt: '',
  //   updatedAt: '',
  // });
  // await emFork.persistAndFlush(post);
  // const post = await emFork.find(Post, {});
  // console.log('Post::::', post);
};

main().catch((err) => console.log(err));

// PGUSER=postgres
// PGHOST=localhost
// PGPASSWORD=agbo158975
// PGDATABASE=e-commerce
// PGPORT=5432
