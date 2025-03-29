/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  console.log("Migration: moving games to old_games")

  const collection = app.findCollectionByNameOrId("i4mw5v1sixq73ze")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_lmjPKJf` ON `old_games` (`game_id`)",
      "CREATE INDEX `idx_OVSjNHF` ON `old_games` (`date`)",
      "CREATE INDEX `idx_WEhBUPHBOh` ON `old_games` (`playgroup`)",
      "CREATE INDEX `idx_DXDBfiSJb2` ON `old_games` (`pilot`)"
    ],
    "name": "old_games"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("i4mw5v1sixq73ze")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_lmjPKJf` ON `games` (`game_id`)",
      "CREATE INDEX `idx_OVSjNHF` ON `games` (`date`)",
      "CREATE INDEX `idx_WEhBUPHBOh` ON `games` (`playgroup`)",
      "CREATE INDEX `idx_DXDBfiSJb2` ON `games` (`pilot`)"
    ],
    "name": "games"
  }, collection)

  return app.save(collection)
})
