#!/bin/bash

PSQL="psql -X -q --username=freecodecamp --dbname=number_guess --no-align --tuples-only -c"

random=$((1 + RANDOM % 1000))
echo "Enter your username:"
read username

is_user_id=$($PSQL "SELECT user_id FROM users WHERE username='$username';")

if [[ -z $is_user_id ]]
then
  echo "Welcome, $username! It looks like this is your first time here."
  INSERT_USER_RESULT=$($PSQL "INSERT INTO users(username) VALUES('$username');")
  is_user_id=$($PSQL "SELECT user_id FROM users WHERE username='$username';")
else
  numberOfGames=$($PSQL "SELECT COUNT(score_id) FROM scores WHERE user_id=$is_user_id;")
  bestScore=$($PSQL "SELECT MIN(guesses_number) FROM scores WHERE user_id=$is_user_id;")
  echo "Welcome back, $username! You have played $numberOfGames games, and your best game took $bestScore guesses."
fi

echo "Guess the secret number between 1 and 1000:"
guess_count=0

while true
do
  read user_input
  ((guess_count++))

  if [[ ! $user_input =~ ^[0-9]+$ ]]
  then
    echo "That is not an integer, guess again:"
  elif (( user_input == random ))
  then
    echo "You guessed it in $guess_count tries. The secret number was $random. Nice job!"
    $PSQL "INSERT INTO scores(guesses_number, user_id) VALUES($guess_count, $is_user_id);" > /dev/null
    exit
  elif (( user_input > random ))
  then
    echo "It's lower than that, guess again:"
  else
    echo "It's higher than that, guess again:"
  fi
done