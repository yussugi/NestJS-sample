import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserStatus } from '../auth/user-status.enum';
import { ItemStatus } from './item-status.enum';
import { ItemRepository } from './item.repository';
import { ItemsService } from './items.service';

// mock生成
const mockItemRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser1 = {
  id: '1',
  username: 'test1',
  password: '1234',
  status: UserStatus.PREMIUM,
};

const mockUser2 = {
  id: '2',
  username: 'test2',
  password: '1234',
  status: UserStatus.FREE,
};

// ItemsService のテスト実施
describe('ItemsServiceTest', () => {
  let itemsService;
  let itemRepository;

  // 前提条件
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemRepository,
          useFactory: mockItemRepository,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  // findAll メソッドのテスト実施
  describe('findAll', () => {
    it('正常系', async () => {
      const expected = [];
      itemRepository.find.mockResolvedValue(expected);
      const result = await itemsService.findAll();

      expect(result).toEqual(expected);
    });
  });

  // findById メソッドのテスト実施
  describe('findById', () => {
    it('正常系', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.findOne.mockResolvedValue(expected);
      const result = await itemsService.findById('test-id');
      expect(result).toEqual(expected);
    });

    it('異常系:商品が存在しません', async () => {
      // 戻り値 null
      itemRepository.findOne.mockResolvedValue(null);
      await expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // create メソッドのテスト実施
  describe('create', () => {
    it('正常系', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.createItem.mockResolvedValue(expected);
      const result = await itemsService.create(
        { name: 'PC', price: 50000, description: '' },
        mockUser1,
      );
      expect(result).toEqual(expected);
    });
  });

  // updateStatus メソッドのテスト実施
  describe('updateStatus', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 50000,
      description: '',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('正常系', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.updateStatus('test-id', mockUser2);
      // itemRepository のsave メソッド呼び出しをテスト(更新のため期待値比較は行わない)
      expect(itemRepository.save).toHaveBeenCalled();
    });

    it('異常系：自身の商品を購入', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(
        itemsService.updateStatus('test-id', mockUser1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // delete メソッドのテスト実施
  describe('delete', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 50000,
      description: '',
      status: ItemStatus.ON_SALE,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('正常系', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.delete('test-id', mockUser1);
      // itemRepository のdelete メソッド呼び出しをテスト(更新のため期待値比較は行わない)
      expect(itemRepository.delete).toHaveBeenCalled();
    });

    it('異常系：他人の商品を削除', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
