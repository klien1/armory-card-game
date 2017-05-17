# armory-card-game

Available Accounts
-----
username: bryan (superuser)

password: bobbobbob

-----
username: bill

password: scienceguy

-----
username: star

password: starcraft

-----
*** Only a few cards have been implemented ***

*** Only cards that change stats have been implemented ***

*** Attack feature has not been implemented ***

*** Boss has not been implemented ***


# Cards Implemented
- Archer cards
  - Take Aim (Archer Ability Card)
  - Snipe (Archer Ultimate Card)
  - Shortbow (Archer Equipment Card)
  - Longbow (Archer Equpment Card)
  - Loadup (Archer Augment Card)

# How to interact with the game
- How to start the game
  - Create a game room and there needs to be at least two players ready in the room before the game starts.
  - You will be asked to choose a class. 
  - When the room is full and all players are ready, the game will begin.
- On the left side, you will see player stats.
  - The player with the green background is the current turn player.
  - The turn player's end turn button should be green.
  - If it is not your turn the end turn button should be blue.
- Starting cards
  - Cards can only be played on your turn, with the exception of reaction cards.
  - Reaction cards can be played whenever you want.
  - Players always start with an ability card and an ultimate card.
  - Ability cards can be played once per turn.
  - Ultimate cards can only be played once per game. Once you use the ultimate card the card disappears.
- Moving your character
  - You can only move one space up, down, left, or right per turn. 
  - You cannot move diagonally.

# Issues
- overall
  - Problems displaying the game with smaller devices.
  - Currently designed to be play on desktops or laptops.
  - On smaller devices the navbar blocks some of the data.
  - Players logged into the same account with multiple browsers causes problems.
- lobby
  - Users that send an invite to the game cannot cancel the invite.
  - A second invite to the same person will delete the invite from the first sender and the first sender cannot invite another player unless he or she refreshes the page.
  - Users can send multiple invites by refreshing the page which will break the invite system.
- game room
  - Refreshing the page in the middle of the game or during character selection causes problems.
  - Resizing the game browser causes problems with the game.
  - Need to recreate the game room if you resize the brower.
  - The game board should be a 7x5 grid. If not you will have to zoom out the browser until it is a 7x5 grid and recreate the game.
