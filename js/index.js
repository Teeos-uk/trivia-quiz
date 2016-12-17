window.onload = function() {
    
    var model = {
        init: function() {
            localStorage.question = "";
            localStorage.answer = "";
            localStorage.available_letters = "";
            localStorage.selected_letters = "";
            localStorage.category = "";
            localStorage.question_number = "";
            localStorage.correct_answers = 0;
            localStorage.total_questions = 0;
        },

        load_new_question: function() {
            var question_object = {};
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", 'http://jservice.io/api/random', false);
            xhttp.send();
                    
            question_object = JSON.parse(xhttp.responseText)[0];
                                        
            localStorage.question = question_object.question;
            localStorage.answer = question_object.answer;

            localStorage.available_letters = localStorage.answer.toUpperCase();
            //localStorage.available_letters = shuffle(localStorage.available_letters);

            localStorage.selected_letters = "";
            localStorage.category = question_object.category.title;
            localStorage.question_number = question_object.id;
            //console.log(question_object);
 
        },

        is_valid: function(question) {
            if (question.length == 0)
                return false;
            var forbidden_chars = "<>()[] ";
            for (var i in question) {
                if (question.indexOf(forbidden_chars[i]) != -1)
                    return false;
            }
            return true;
        },
    }

    var view = {
        init: function() {
            var skip_button = document.getElementById("skip-button");
            skip_button.addEventListener('click', controller.skip_question);
        },

        update: function() {
            // updating spans
            var question_text_span = document.getElementById('question-text');
            question_text_span.innerHTML = localStorage.question;

            var category_text_span = document.getElementById('category-text');
            category_text_span.innerHTML = localStorage.category;

            var number_text_span = document.getElementById('number-text');
            number_text_span.innerHTML = localStorage.question_number;

            var total_questions_span = document.getElementById('total-questions-text');
            total_questions_span.innerHTML = localStorage.total_questions;

            // updating buttons
            var available_letters_div = document.getElementById('available-letters');
            available_letters_div.innerHTML = "";
            for (var i in localStorage.available_letters) {
                var button = document.createElement('button');
                button.innerHTML = localStorage.available_letters[i];
                button.id = 'available_' + i;
                button.addEventListener('click', controller.select_letter.bind(null, i));
                available_letters_div.appendChild(button);
            }
        },
    }

    var controller = {
        init: function() {
            model.init();
            view.init();
            model.load_new_question();
            view.update();
        },

        skip_question: function() {
            console.log("Skipping a question");
            model.load_new_question();
            localStorage.total_questions++;
            view.update();
        },

        select_letter: function(id) {
            var pressed_letter = localStorage.available_letters[id];
            console.log(pressed_letter);
        },

        deselect_letter: function() {
            
        }
    }

    controller.init();

}

function shuffle(str) {
    var array = str.split('');
    var buffer = 0;
    var random_index = 0;
    for (var i in array) {
        random_index = randrange(i, array.length);
        buffer = array[i];
        array[i] = array[random_index];
        array[random_index] = buffer;
    }
    return array.join('');
}

function randrange(floor, ceil) {
    return Math.floor(Math.random()*(ceil - floor) + floor);
}
