import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * TypeOMR利用時にEntityを管理するためのオブジェクトとして定義
 * @EntityRepository()デコレーターを付与してTypeORMのRepositoryを継承する
 * デコレーターの引数に扱いたいEntityを渡す
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, status } = createUserDto;
    // bcryptにてsalt作成
    const salt = await bcrypt.genSalt();
    // passwordをhash化
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashPassword, status });

    await this.save(user);
    return user;
  }
}
