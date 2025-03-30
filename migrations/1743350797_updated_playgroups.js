/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_1966736064');

    // update field
    collection.fields.addAt(
      4,
      new Field({
        autogeneratePattern: '[a-z0-9]{32}',
        hidden: false,
        id: 'text152458878',
        max: 0,
        min: 0,
        name: 'invite_key',
        pattern: '',
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: 'text'
      })
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_1966736064');

    // update field
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
  }
);
