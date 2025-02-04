import {Identity} from '@dfinity/agent';

import {UserSocial as UserSocialIc, User as UserIc} from '../../../canisters/users/users.did';

import store from '../../../stores/user.store';

import {CanisterUtils} from '../../../utils/editor/canister.utils';

import {User} from '../../../models/data/user';

import {UserProvider} from './user.provider';

import {AuthFactoryProvider} from '../../auth/auth.factory.provider';
import {AuthIcProvider} from '../../auth/auth.ic.provider';

import {initSlidesActor} from '../../../utils/core/ic.slide.utils';

export class UserIcProvider implements UserProvider {
  private static instance: UserIcProvider;

  private constructor() {
    // Private constructor, singleton
  }

  static getInstance() {
    if (!UserIcProvider.instance) {
      UserIcProvider.instance = new UserIcProvider();
    }
    return UserIcProvider.instance;
  }

  // @Override
  async update(user: User): Promise<void> {
    const identity: Identity | undefined = (AuthFactoryProvider.getInstance() as AuthIcProvider).getIdentity();

    if (!identity) {
      return;
    }

    const {userActor, ownerId} = await initSlidesActor({identity});

    const {data} = user;

    const {name, email, photo_url, newsletter, bio, social, created_at, username} = data;

    const now: Date = new Date();

    const updateUser: UserIc = {
      userId: ownerId,
      data: {
        name: CanisterUtils.toNullable<string>(name),
        username: CanisterUtils.toNullable<string>(username),
        bio: CanisterUtils.toNullable<string>(bio),
        photo_url: CanisterUtils.toNullable<string>(photo_url),
        email: CanisterUtils.toNullable<string>(email),
        newsletter: CanisterUtils.toNullable<boolean>(newsletter),
        social: CanisterUtils.toUserSocial<UserSocialIc>(social),
        created_at: CanisterUtils.toTimestamp(created_at as Date),
        updated_at: CanisterUtils.toTimestamp(now)
      }
    };

    console.log('User IC about to SET', updateUser);
    const t0 = performance.now();

    await userActor.set(updateUser);

    const t1 = performance.now();
    console.log('User IC SET done', t1 - t0);

    store.state.user = {
      id: user.id,
      data: {
        ...data,
        updated_at: now
      }
    };
  }

  // @Override
  async delete(_userId: string): Promise<void> {
    const identity: Identity | undefined = (AuthFactoryProvider.getInstance() as AuthIcProvider).getIdentity();

    if (!identity) {
      return;
    }

    const {userActor, ownerId} = await initSlidesActor({identity});

    console.log('User IC about to DEL');
    const t0 = performance.now();

    await userActor.del(ownerId);

    const t1 = performance.now();
    console.log('User IC DEL done', t1 - t0);
  }
}
