import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { UserRepository } from './user.repository';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  async signIn(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    // credentialsDtoの展開
    const { username, password } = credentialsDto;
    // usernameを条件にuserをrepositoryから検索
    const user = await this.userRepository.findOne({ username });

    // ユーザーが存在かつ平文パスワードとハッシュ化したパスワードの比較
    if (user && (await bcrypt.compare(password, user.password))) {
      // 認証情報に問題ない場合JWT生成
      // ペイロード部分の作成
      const payload = { id: user.id, username: user.username };
      // 署名されたトークンの作成
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }
    // 一致しない場合は例外
    throw new UnauthorizedException('ユーザー名またはパスワードが一致しません');
  }
}
