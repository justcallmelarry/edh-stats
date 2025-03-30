/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_1966736064');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE INDEX `idx_rk98SBJ3hU` ON `playgroups` (`owner`)',
          'CREATE INDEX `idx_a3tQNMD3zC` ON `playgroups` (`members`)',
          'CREATE INDEX `idx_ZV4j260yDC` ON `playgroups` (`invite_key`)'
        ]
      },
      collection
    );

    // add field
    collection.fields.addAt(
      4,
      new Field({
        autogeneratePattern: '',
        hidden: false,
        id: 'text152458878',
        max: 0,
        min: 0,
        name: 'invite_key',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: 'text'
      })
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_1966736064');

    // update collection data
    unmarshal(
      {
        indexes: [
          'CREATE INDEX `idx_rk98SBJ3hU` ON `playgroups` (`owner`)',
          'CREATE INDEX `idx_a3tQNMD3zC` ON `playgroups` (`members`)'
        ]
      },
      collection
    );

    // remove field
    collection.fields.removeById('text152458878');

    return app.save(collection);
  }
);
