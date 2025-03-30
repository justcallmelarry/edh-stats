/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2243264021');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE INDEX `idx_5wNM70d5Jg` ON `game_rows` (`playgroup`)',
          'CREATE INDEX `idx_8KmJYXf2F2` ON `game_rows` (`pilot`)',
          'CREATE INDEX `idx_I8RmFWW8lN` ON `game_rows` (`deck`)',
          'CREATE INDEX `idx_r8mTKNbrDb` ON `game_rows` (`game`)'
        ]
      },
      collection
    );

    // add field
    collection.fields.addAt(
      2,
      new Field({
        cascadeDelete: false,
        collectionId: 'pbc_879072730',
        hidden: false,
        id: 'relation590033292',
        maxSelect: 1,
        minSelect: 0,
        name: 'game',
        presentable: false,
        required: true,
        system: false,
        type: 'relation'
      })
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2243264021');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE INDEX `idx_5wNM70d5Jg` ON `game_rows` (`playgroup`)',
          'CREATE INDEX `idx_8KmJYXf2F2` ON `game_rows` (`pilot`)',
          'CREATE INDEX `idx_I8RmFWW8lN` ON `game_rows` (`deck`)'
        ]
      },
      collection
    );

    // remove field
    collection.fields.removeById('relation590033292');

    return app.save(collection);
  }
);
