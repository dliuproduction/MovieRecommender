$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page



  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  // varible used for the app
  var lastQuestion;
  var serverUrl = "https://codejam.localtunnel.me/name"
  var finishQuestionnaire = false;
  var socket = io();

  function addParticipantsMessage (data) {
    console.log("addParticipantsMessage");
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    console.log("username",username);
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
      socket.emit("ack",function(data){
        console.log("after add user ",data);
      });
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
    console.log("sendMessage")
  }

  function callAjax(lastAnswer,cb){
     console.log("sending",lastAnswer);
     $.ajax({
          type: "POST",
          url: serverUrl,
          data: lastAnswer,
          success: function (data) {
            console.log(data);
            cb(data);
          },
          error:function(){
            alert("Error");
          },
      });
  }
  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    // var $typingMessages = getTypingMessages(data);
    options = options || {};
    // if ($typingMessages.length !== 0) {
    //   options.fade = false;
    //   $typingMessages.remove();
    // }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
    console.log("addChatMessage")
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
    console.log("addChatTyping")
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    // getTypingMessages(data).fadeOut(function () {
    //   $(this).remove();
    // });
    console.log("removeChatTyping")
  }


  function addRecommendation(data){
    var typingClass = data.typing ? 'typing' : '';
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data);
    var $messageDiv = $('<li class="message"/>')
      .addClass(typingClass)
      .append($messageBodyDiv);

    addMessageElement($messageDiv, {});
    console.log("addRecommendation");
  }
  function addRecommendationUrl(e){
    // var typingClass = data.typing ? 'typing' : '';
    var imageClass = "imageClass"

    var $img = e;
    var $imageDiv = $("<img />")
      .attr("src",e)
      .addClass(imageClass)
      
    var $messageBodyDiv = $('<span class="messageBody">')
      // .text("something")
      .append($imageDiv)
    var $messageDiv = $('<li class="message"/>')
      // .addClass(typingClass)
      
      .css("display","inline")
      .append($messageBodyDiv);


    addMessageElement($messageDiv, {});
    console.log("addRecommendation");
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return input;
    // return $('<div/>').text(input).text();
    console.log("cleanInput");
  }


  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (finishQuestionnaire){
        $inputMessage.val('');
        return;
      }
      if (username) {
        sendMessage();
        // socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  // $inputMessage.on('input', function() {
  //   updateTyping();
  // });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to TV show recommandation System – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  socket.on("finish Questionnaire",function(data){
    finishQuestionnaire = true;
    var lastAnswer = data.lastAnswer; 
    console.log("finish ... Questionnaire");
    // addChatMessage(lastAnswer);
    console.log(lastAnswer);
    callAjax(lastAnswer,function(data){
      addChatMessage(data);
    });
    
  })
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // log the question out 
  socket.on('question', function (data) {
    // log(data.question + ' joined');
    addChatMessage(data);
  });


  // output recommandation
  socket.on("recommandation",function(data){
    data.map(function(e){
      console.log("element",e);
      // addRecommendation(e);
      addRecommendationUrl(e);
    });
  })
  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    // removeChatTyping(data);
  });

});
