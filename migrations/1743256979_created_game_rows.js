/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    console.log('Migration: creating new game_rows collection');
    const collection = new Collection({
      createRule: null,
      deleteRule: null,
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_1966736064',
          hidden: false,
          id: 'relation1004587535',
          maxSelect: 1,
          minSelect: 0,
          name: 'playgroup',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_2851445954',
          hidden: false,
          id: 'relation2367577938',
          maxSelect: 1,
          minSelect: 0,
          name: 'pilot',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_1757051097',
          hidden: false,
          id: 'relation1336686135',
          maxSelect: 1,
          minSelect: 0,
          name: 'deck',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          id: 'autodate3332085495',
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      id: 'pbc_2243264021',
      indexes: [
        'CREATE INDEX `idx_5wNM70d5Jg` ON `game_rows` (`playgroup`)',
        'CREATE INDEX `idx_8KmJYXf2F2` ON `game_rows` (`pilot`)',
        'CREATE INDEX `idx_I8RmFWW8lN` ON `game_rows` (`deck`)'
      ],
      listRule: null,
      name: 'game_rows',
      system: false,
      type: 'base',
      updateRule: null,
      viewRule: null
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2243264021');

    return app.delete(collection);
  }
);
