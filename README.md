# WordWars
Multiplayer word game for the browser. Uses Firebase, MySQL, Express, Handlebars, Node, Bootstrap, jQuery.

# Introduction
WordWars is a two-player web game playable in the browser. The object of the game is to type the words that appear as fast as you can before they reach the opposite side of the screen. As this is happening, users can enter in additional words to send an extra challenge to their enemy. Aside from the entertainment value of the game, WordWars helps programmers, bloggers, writers, and the like, to type faster, while having fun doing so.

# Authentication
WordWars uses Firebase Authentication for user authentication. Users register for an account, providing a username, email, and password. Throughout the application, there is a listener for whenever someone is logged in. This function (`firebase.auth().onAuthStateChanged()`) handles much of the logic for each page, depending on if a user is logged in or not.

# The Game
For a brief demonstration of the game at a high level, see [here](https://www.youtube.com/watch?v=dw0R03qUS3A).

# High Level Diagram
![alt tag](https://raw.githubusercontent.com/ltdelia/WordWars/master/mockups/readme_images/WordWars High Level Diagram.png)

The diagram above demonstrates the logic occurring throughout the game, both on the client side and the server side.

# Deployed App
The deployed application can be found [here](http://wordwarsapp.herokuapp.com).