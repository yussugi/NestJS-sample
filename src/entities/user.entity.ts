import { Exclude } from 'class-transformer';
import { UserStatus } from '../auth/user-status.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

/**
 * TypeORM利用時に生成するクラス
 * RDBのテーブルと対応するオブジェクトとなる
 * @Entity デコレーターを付与したクラスとして定義
 * @PrimaryGeneratedColumn @Column デコレーター等が付与されたプロパティが
 * RDBのColoumnとしてマッピングされる
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  status: UserStatus;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];
}
