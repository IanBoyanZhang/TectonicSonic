 'use strict';

angular.module('app.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'ViewCtrl'
  });
}])

.controller('ViewCtrl', ['$scope', 'Cards', 'wsComm', 'httpRequest', 'gameStateEmu',
  function($scope, Cards, wsComm, httpRequest, gameStateEmu) {
  // wsComm.wsSend(JSON.stringify("Check"));  
  var init = function() {
    $scope.deckCard = Cards.imageCardBack();
    $scope.publicCardsImg = [];
    $scope.users = [];
    $scope.myStake = null;
    $scope.mySelf = {
      myName: "",
      uid: undefined,
      // uid: undefined || 27694
      inGame: false
    };
    $scope.gameState;

    wsComm.wsInit();

    $scope.inputUsername = function() {
      var myName = $scope.mySelf.myName;
      // console.log("myUsername:", myName);
      // httpRequest.identity(myName).then(function(dataResponse, status, headers, config) {
      //    $scope.mySelf.uid = dataResponse.data;  
      // });
      
      // received assign uid from identity request resp
      // sim only
      if (myName === "27694") {
        $scope.mySelf.uid = 27694;  
        // console.log("mySelf", $scope.mySelf);
      } else {
        $scope.mySelf.uid = 27695;
      }
    };

    $scope.sitBtn = function() {
      var myUid = $scope.mySelf.uid;
      var seatId = checkSeats($scope.gameState.table);
      // httpRequest.sit(myUid, seatId).then(function(dataResponse, status, headers, config) {
        
      // };

      // sim only
      if (myUid === 27695) {
        $scope.mySelf.uid = 27694;
      };
    };

    $scope.standBtn = function() {
      var myUid = $scope.mySelf.uid;
      // httpRequest.stand(myUid).then(function(dataResponse, status, headers, config) {
        
      // };
    };

    $scope.checkBtn = function() {
      var myUid = $scope.mySelf.uid;
      // httpRequest.check(myUid).then(function(dataResponse, status, headers, config) {
        
      // };
    };

    $scope.foldBtn = function() {
      var myUid = $scope.mySelf.uid;
      // httpRequest.fold(myUid).then(function(dataResponse, status, headers, config) {
        
      // };
    };

    // input how much
    $scope.betBtn = function() {
      var myUid = $scope.mySelf.uid;
      var myStake = $scope.myStake;
      if (myStake < $scope.gameState.minstake) {
        myStake = $scope.myStake = $scope.gameState.minstake;
      } 

      if (myStake > $scope.mySelf.money) {
        // exception: I don't have enough money left!
        myStake = $scope.myStake = null;
        console.error("No money!");
      }
      // console.log("myStake ", myStake);
      // httpRequest.bet(myUid, myStake).then(function(dataResponse, status, headers, config) {
        
      // };
    };

    $scope.callBtn = function() {
      var myUid = $scope.mySelf.uid;
      // httpRequest.call(myUid).then(function(dataResponse, status, headers, config) {
        
      // };
    };

  }

  // Determine which seat(s) is/are empty, then place the user to first avaiable seat
  var checkSeats = function(table) {
    for (var seat = 0, l = table.length; seat < l; seat++) {
      if (table[seat] === null) {
        return seat;
      };
    };
    return null;
  };

  // expect input array of users
  var renderUsers = function(userGroup, mySelf) {
    var users = [];
    for (var i = 0, l = userGroup.length; i < l; i++) {
      if (userGroup[i].uid === mySelf.uid) {
          $scope.mySelf = userGroup[i];
          // render mySelf
          $scope.mySelf.inGame = true;
          $scope.mySelf.cardsView = Cards.renderCards($scope.mySelf.hand);
          continue;
      };

// -----------------------------------------------------------------------------------

//       // hide other players' cards in rounds 0-4
//       if(gameState.round > 0 && gameState.round < 5) {
//         user.hand = cardBacks;
//       }

//       // only show other players' cards in round 5
//       if(gameState.round === 5) {
//         user.hand = Cards.renderCards(gameState.user[i].cardsImg.push());
//       }

      
      // render other users
      users[i] = userGroup[i];  
      users[i].cardsImg = [];
      // if (userGroup[i].uid !== null) {
      //   users[i].cardsImg.push(Cards.imageCardBack());
      // }

      // hide other players cards intil the end of the hand
      if (userGroup[i].uid !== null && gameState.round > 0 && gameState.round < 5) {
        users[i].cardsImg.push(Cards.imageCardBack());
      }

      // show other players cards at the end of the hand
      if (userGroup[i].uid !== null && gameState.round === 5) {
        users[i].cardsImg.push(Cards.renderCards(users[i].hand));
    };
    $scope.users = users;
  };

  //if(gameState.user[i].active)

  // show only the deck during round 0
  if(gameState.round === 0) {
    document.getElementById("publicDeck").style.visibility = "hidden";  
    document.getElementById("mySelfDeck").style.visibility = "hidden"; 
    document.getElementById("playerList").style.visibility = "hidden";
  }

  // display community cards based on round
  var endSlice = 0;
  if(gameState.round === 2) {
    endSlice = 3;
  }
  else if(gameState.round === 3) {
    endSlice = 4;
  }
  else if(gameState.round === 4 || gameState.round === 5) {
    endSlice = 5;
  }

  var publicCards = gameState.cards.slice(0,endSlice);

  $scope.players = players;
  $scope.publicCardsImg = Cards.renderCards(publicCards);

  mySelf.cards = Cards.renderCards(mySelf.cards);
  $scope.mySelf = mySelf; 

  var renderPublicDeck = function(publicCards) {
    $scope.publicCardsImg = Cards.renderCards(publicCards);
  };

  // check updated gameState received from WebSocket
  // Game flow chart
  var gameStateProc = function (gameState) {
    // required for dynamically changed scope
    $scope.$apply(function() {
      $scope.gameState = JSON.parse(gameStateEmu.gameStateJSON[0]);         // Test only
    });
    renderUsers($scope.gameState.user, $scope.mySelf);
    // check game status before putting cards on table?
    renderPublicDeck($scope.gameState.cards)
  };

  init();
  wsComm.wsUpdate(gameStateProc);
}])





 **********************************************************************************
  if(deckCards.length) {
    $scope.cardBack = Cards.imageCardBack();
  };

  var gameState = JSON.parse(gameStateEmu.gameStateJSON[0]);

  var users = [];
  var cardBacks = [$scope.cardBack, $scope.cardBack];
 
  for(var i = 0; i < 5; i++) {
    if(gameState.user[i].active) {
      var user = {"name":[gameState.user[i].name], "money":gameState.user[i].money, "stake":gameState.user[i].stake};
      
      // hide other players' cards in rounds 0-4
      if(gameState.round > 0 && gameState.round < 5) {
        user.hand = cardBacks;
      }

      // only show other players' cards in round 5
      if(gameState.round === 5) {
        user.hand = Cards.renderCards(gameState.user[i].hand);
      }

      players.push(user);
    }
  }

  // show only the deck during round 0
  if(gameState.round === 0) {
    document.getElementById("publicDeck").style.visibility = "hidden";  
    document.getElementById("mySelfDeck").style.visibility = "hidden"; 
    document.getElementById("playerList").style.visibility = "hidden";
  }

  //mySelf.cards = gameState.user[5].hand

  // display community cards based on round
  var endSlice = 0;
  if(gameState.round === 2) {
    endSlice = 3;
  }
  else if(gameState.round === 3) {
    endSlice = 4;
  }
  else if(gameState.round === 4 || gameState.round === 5) {
    endSlice = 5;
  }

  var publicCards = gameState.cards.slice(0,endSlice);

  $scope.players = players;
  $scope.publicCardsImg = Cards.renderCards(publicCards);

  mySelf.cards = Cards.renderCards(mySelf.cards);
  $scope.mySelf = mySelf; 