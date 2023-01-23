import { User } from '../entities/User';
import { MyContext } from '../types';
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
} from 'type-graphql';
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { emFork }: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = emFork.create(User, {
      username: options.username,
      createdAt: '',
      updatedAt: '',
      password: hashedPassword,
    });
    await emFork.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { emFork }: MyContext
  ): Promise<UserResponse | null> {
    const user = await emFork.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: "Username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect Credencials',
          },
        ],
      };
    }

    return { user };
  }
}
