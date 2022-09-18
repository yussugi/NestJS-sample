import { ItemStatus } from '../items/item-status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * TypeORM利用時に生成するクラス
 * RDBのテーブルと対応するオブジェクトとなる
 * @Entity デコレーターを付与したクラスとして定義
 * @PrimaryGeneratedColumn @Column デコレーター等が付与されたプロパティが
 * RDBのColoumnとしてマッピングされる
 */
@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  description: string;
  @Column()
  status: ItemStatus;
  @Column()
  createdAt: string;
  @Column()
  updatedAt: string;
  @ManyToOne(() => User, (user) => user.items)
  user: User;

  @Column()
  userId: string;
}
