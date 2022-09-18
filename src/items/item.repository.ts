import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';

/**
 * TypeOMR利用時にEntityを管理するためのオブジェクトとして定義
 * @EntityRepository()デコレーターを付与してTypeORMのRepositoryを継承する
 * デコレーターの引数に扱いたいEntityを渡す
 */
@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  // DB処理は非同期のためasync/awaitで記述
  async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const { name, price, description } = createItemDto;
    // typeormのrepositoryクラスにあるcreateメソッドを呼び出して登録用データ作成
    const item = this.create({
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user,
    });
    // typeormのrepositoryクラスにあるsaveメソッドを呼び出してデータを登録
    await this.save(item);

    return item;
  }
}
