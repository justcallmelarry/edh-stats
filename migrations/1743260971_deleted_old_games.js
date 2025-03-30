/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('i4mw5v1sixq73ze');

    return app.delete(collection);
  },
  (app) => {
    const collection = new Collection({
      createRule:
        '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
      deleteRule:
        '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
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
          autogeneratePattern: '',
          hidden: false,
          id: 'whmugyaz',
          max: 0,
          min: 0,
          name: 'date',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          cascadeDelete: false,
          collectionId: 'pbc_1966736064',
          hidden: false,
          id: 'relation4228013962',
          maxSelect: 1,
          minSelect: 0,
          name: 'playgroup',
          presentable: false,
          required: true,
          system: false,
          type: 'relation'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'nt7ppiiu',
          max: 0,
          min: 0,
          name: 'game_id',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
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
          id: 'ty6niy85',
          name: 'winner',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
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
      id: 'i4mw5v1sixq73ze',
      indexes: [
        'CREATE INDEX `idx_lmjPKJf` ON `old_games` (`game_id`)',
        'CREATE INDEX `idx_OVSjNHF` ON `old_games` (`date`)',
        'CREATE INDEX `idx_WEhBUPHBOh` ON `old_games` (`playgroup`)',
        'CREATE INDEX `idx_DXDBfiSJb2` ON `old_games` (`pilot`)'
      ],
      listRule:
        '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
      name: 'old_games',
      system: false,
      type: 'base',
      updateRule:
        '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
      viewRule:
        '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)'
    });

    return app.save(collection);
  }
);
