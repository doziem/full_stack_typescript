import { Post } from '../entities/Post';
import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Int } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { emFork }: MyContext): Promise<Post[]> {
    return emFork.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) _id: number,
    @Ctx() { emFork }: MyContext
  ): Promise<Post | null> {
    return emFork.findOne(Post, { _id });
  }
}
