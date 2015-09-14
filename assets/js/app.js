var firebaseLink = 'https://quizbomb.firebaseIO.com/quizzes/';
var firebaseRef = new Firebase("https://quizbomb.firebaseIO.com/");
var getFirebaseRef;
var currentTest;

var gifs = ['http://i.giphy.com/lVBUOl3PAlN7i.gif',
			'https://s-media-cache-ak0.pinimg.com/originals/b2/8a/3a/b28a3a52ee99399a5389e758f7de87b6.gif',
			'http://i.giphy.com/AbYxDs20DECQw.gif',
			'http://i.giphy.com/137Wm2535qPj8s.gif',
			'http://i.giphy.com/LD9Ia1m15fMLC.gif',
			'http://1.bp.blogspot.com/-0svJAnYIrOk/VYKQfljTOXI/AAAAAAAAL5A/H422LJCA5kE/s640/Shia-LaBeouf-just-do-it-explosion-animated.gif',
			'http://ak-hdl.buzzfed.com/static/2014-06/4/11/enhanced/webdr08/anigif_enhanced-buzz-16223-1401896698-17.gif'];

$(document).ready(function() {
	$('#headerimg').attr("src", gifs[Math.floor(Math.random() * gifs.length)]);
});

var loadedQuestions = function(quizObject) {

/*  Attempt at refactoring the nested for-loop. In progress.
	var htmlText = '';
	// rewriting for loop.
	var showQuestion = function(qNum) {
		var currentQuestion = 'question' + qNum;
		htmlText += '<div class="separateQuestion"><p>Question ' + qNum + ' of ' +
			quizObject.totalQuestions + '</p><h3>' + quizObject[currentQuestion].question + '</h3>';

		var totalChoices = quizObject[currentQuestion].choices.length;
		var choiceArray = quizObject[currentQuestion].choices.slice(0);
		var htmlChoices = '';
		
		var showChoice = function(n) {
			if (n > 0) {
				var randomIndex = Math.floor(Math.random() * totalChoices);
				var currentChoice = choiceArray.splice(randomIndex, 1);
				htmlChoices += '<input type="radio" name="' + currentQuestion + '" value="' +
					currentChoice + '"><label class="choices">' + currentChoice + '</label><br/>';
				showChoice(n - 1);
			} else {
				return htmlChoices;
			}
		};

		htmlText += htmlText + showChoice(totalChoices);
		return showQuestion(1)
	};

*/
	for (var i = 1; i < quizObject.totalQuestions + 1; i++) {
		var currentQuestion = 'question' + i;
		var htmlText = '<div class="separateQuestion"><p>Question ' + i + ' of ' +
			quizObject.totalQuestions + '</p><h3>' + quizObject[currentQuestion].question + '</h3>';

		var totalChoices = quizObject[currentQuestion].choices.length;

		for (var j = 0; j < totalChoices; j++) {
			var randomIndex = Math.floor(Math.random() * totalChoices);
			var currentChoice = quizObject[currentQuestion].choices.splice(randomIndex, 1);
			htmlText += '<input type="radio" name="' + currentQuestion + '" value="' +
				currentChoice + '"><label class="choices">' + currentChoice + '</label><br/>';
		}

		htmlText += '</div>';
		$('#questionArea').append(htmlText).hide().delay(2200).slideDown(600);
	}

	$('#questionArea').append('<label id="studentName">Your name:<input type="text" class="form-control" ' +
		'name="studentName" id="studentName"></label><br>' +
		'<input type="submit" class="btn btn-add" value="SUBMIT" id="submitAnswers"><br><br>');
};


$('#begin').click(function() {
	var testID = $('#requestTestID').val();
	getFirebaseRef = new Firebase(firebaseLink + testID);

	getFirebaseRef.on('value', function(data) {
		currentTest = data.val();
		$('#chooseDestiny').slideUp(1000);
		$('#testInfo').delay(1000).append('<div id="loadTestInfo" style="display: none"><p>"I\'m smarter than you." -<em>' + currentTest.instructor +
		'</em></p><h2>' + currentTest.testName + '</h2><div class="hline"></div></div>');
		$('#loadTestInfo').delay(2000).slideDown(800);
		loadedQuestions(currentTest);
	}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});
});

$('#instructorInput').on('submit', function() {
	var that = $(this);
	var obj = {};
	obj.totalQuestions = questionID;
	var uniqueID = that.find('[name="testID"]').val();
	var qKey;
	var qValue;

	that.find('[name]').each(function(index, item) {
		if (item.value != '') {
			var that = $(this);
			if (that.attr('data') === 'testInfo') {
				var key = that.attr('name');
				var value = that.val();
				obj[key] = value;
			} else if (that.attr('data') === 'question') {
				qKey = that.attr('name');
				obj[qKey] = { question: that.val(),
							  choices: []
							};
			} else if (that.attr('data') === 'answer') {
				obj[qKey].answer = that.val();
				obj[qKey].choices.push(that.val());
			} else if (that.attr('data') === 'choice') {
				obj[qKey].choices.push(that.val());
			} else if (that.attr('data') === 'imgURL') {
				obj[qKey].imgURL = that.val();
			}
		}
	});
  
	firebaseRef.child('quizzes').child(uniqueID).set(obj);
	alert('Your quiz has been saved!');
});

var testName1;

// Dynamically updates the h4 text above quiz questions with the Test Name input.
 $("#createTestName").keyup(function() {
 		if ($(this).val() == '') {
 			$('#h4TestName').text('your quiz');
 		} else {
        $('#h4TestName').text($(this).val());
    	}
 });

var questionID = 1;

$("#newQuestion").click(function() {
	questionID += 1;
	$('#quizMaker').append('<div class="quizQuestion" id="q' + questionID + '" style="display: none">' +
		'<hr><label for="question' + questionID + '">Question ' + questionID + ':</label>' +
		'<input type="text" class="title form-control" name="question' + questionID +
		'" id="createName" data="question" required><div class="answers">' +
		'<div class="answerWrap correct"><label for="answer">Correct:</label>' +
		'<input type="text" class="form-control" name="answer" id="correct" data="answer" required>' +
		'</div><div class="answerWrap incorrect"><label>Incorrect:</label>' +
		'<input type="text" class="form-control wrong" name="choice2" data="choice" required>' +
		'<input type="text" class="form-control wrong" name="choice3" data="choice">' +
		'<input type="text" class="form-control wrong" name="choice4" data="choice">' +
		'</div><div class="answerWrap imgURL"><input type="text" class="form-control imgURL" ' +
		'name="q1answer" placeholder="Add image link (optional)" data="imgURL">' +
		'</div></div></div>');
	$('#quizMaker').find(".quizQuestion:last").slideDown(800);
});

$("#removeQuestion").click(function() {
	if (questionID > 1) {
		$('#quizMaker').find(".quizQuestion:last").slideUp(800, function() {
			$(this).remove();
			questionID -= 1;
		});
	}
});