#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.

echo $($PSQL "TRUNCATE TABLE games, teams;")

tail -n +2 games.csv | while IFS="," read -r YEAR ROUND WINNER OPPONENT WINNER_GOALS OPPONENT_GOALS
do
  WINNER_ID=$($PSQL "
    INSERT INTO teams(name)
    VALUES('$WINNER')
    ON CONFLICT(name) DO UPDATE
    SET name = EXCLUDED.name
    RETURNING team_id;
  " | grep -E '^[0-9]+$')

  OPPONENT_ID=$($PSQL "
    INSERT INTO teams(name)
    VALUES('$OPPONENT')
    ON CONFLICT(name) DO UPDATE
    SET name = EXCLUDED.name
    RETURNING team_id;
  " | grep -E '^[0-9]+$')

  echo $($PSQL "
    INSERT INTO games(year, round, winner_id, opponent_id, winner_goals, opponent_goals)
    VALUES($YEAR, '$ROUND', $WINNER_ID, $OPPONENT_ID, $WINNER_GOALS, $OPPONENT_GOALS);
  ")
done