/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2243264021');

    // update collection data
    unmarshal(
      {
        deleteRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id ?= @collection.playgroups.members.id || @request.auth.id = @collection.playgroups.owner)'
      },
      collection
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pbc_2243264021');

    // update collection data
    unmarshal(
      {
        deleteRule:
          '@request.auth.id != "" && \n@collection.games.playgroup != null &&\n(@request.auth.id = @collection.playgroups.owner)'
      },
      collection
    );

    return app.save(collection);
  }
);
