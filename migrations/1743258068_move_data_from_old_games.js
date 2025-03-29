/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  console.log("Migration: moving data from old_games to the new setup")

  const oldGamesColellection = app.findCollectionByNameOrId("old_games")
  const gameRows = app.findRecordsByFilter(oldGamesColellection, "")

  let games = {}

  gameRows.forEach((row) => {
    let gameID = row.get("game_id")
    if (!games.hasOwnProperty(gameID)) {
      games[gameID] = {
        id: gameID,
        rows: [],
        playgroup: row.get("playgroup"),
        date: row.get("date"),
        winner: null
      };
    }
    if (row.get("winner")) {
      games[gameID].winner = row.get("pilot")
    }
    games[gameID].rows.push(row);
  })

  const gamesCollection = app.findCollectionByNameOrId("games");
  const gameRowsCollection = app.findCollectionByNameOrId("game_rows");

  Object.values(games).forEach((game) => {
    // Store the game in the games collection
    let record = new Record(gamesCollection)

    record.set("playgroup", game.playgroup)
    record.set("date", game.date)
    record.set("winner", game.winner)

    app.save(record)

    let newGameID = record.get("id")

    // Store each row in the game_rows collection
    game.rows.forEach((row) => {
      let gameRow = new Record(gameRowsCollection)

      gameRow.set("playgroup", game.playgroup)
      gameRow.set("game", newGameID)
      gameRow.set("pilot", row.get("pilot"))
      gameRow.set("deck", row.get("deck"))

      app.save(gameRow)
    });
  });
}, (app) => {
  // add down queries...
})
