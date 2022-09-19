module.exports = {
    type: 'postgres',
    // Docker, 本番利用時にはhostを変更すること
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    // EntityをTypeORMに自動ロード
    autoLoadEntities: true,
    // migration settings for entity
    // コンパイル済みのdistに存在するentityのjsファイルを指定する
    entities: ['dist/entities/*.entity.js'],
    // どのmigrationファイルを利用して実行するか定義
    migrations: ['dist/migrations/*.js'],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
    },
};