import { Post } from '../entities/Post';
import { MyContext } from 'src/types';
import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql';

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

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { emFork }: MyContext
  ): Promise<Post> {
    const post = emFork.create(Post, {
      title,
      createdAt: '',
      updatedAt: '',
    });
    emFork.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int, { nullable: true }) _id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { emFork }: MyContext
  ): Promise<Post | null> {
    const post = emFork.findOne(Post, { _id });
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      // post.title = title;
      await emFork.persistAndFlush(post);
    }
    // emFork.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int, { nullable: true }) _id: number,
    @Ctx() { emFork }: MyContext
  ): Promise<boolean> {
    emFork.nativeDelete(Post, { _id });
    return true;
  }
}
