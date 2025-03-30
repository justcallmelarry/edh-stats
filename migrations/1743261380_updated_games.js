/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_879072730');

    // update collection data
    unmarshal(
      {
        createRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
        deleteRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id = @collection.playgroups.owner)',
        listRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
        updateRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)',
        viewRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)'
      },
      collection
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_879072730');

    // update collection data
    unmarshal(
      {
        createRule: null,
        deleteRule: null,
        listRule: null,
        updateRule: null,
        viewRule: null
      },
      collection
    );

    return app.save(collection);
  }
);
