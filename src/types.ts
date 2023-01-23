import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export type MyContext = {
  emFork: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
