window.onload = function() {
    
    var model = {
        init: function() {
            this.question = "";
            this.answer = "";
            this.category = "";
            this.available_letters = "";
            this.selected_letters = "";
            this.id = 0;
            this.correct_answers = 0;
            this.total_questions = 1;
            this.state = "";
        },

        parse(question_object) {
            this.question = question_object.question;
            this.answer = question_object.answer.toUpperCase();
            this.category = question_object.category.title;
            this.available_letters = shuffle(this.answer.toUpperCase());
            this.selected_letters = "";
            this.id = question_object.id;
            // TODO: add the rest of properties
        },
    }

    var view = {
        init: function() {
            var skip_button = document.getElementById("skip-button");
            skip_button.addEventListener('click', controller.skip_question);
        },

        update: function() {
            console.log("Updating the view");
            // updating the text
            var correct_answers_span = document.getElementById('correct-answers-text');
            correct_answers_span.innerHTML = model.correct_answers;

            var total_questions_span = document.getElementById('total-questions-text');
            total_questions_span.innerHTML = model.total_questions;

            var number_span = document.getElementById('number-text');
            number_span.innerHTML = model.id;

            var category_span = document.getElementById('category-text');
            category_span.innerHTML = model.category;

            var question_span = document.getElementById('question-text');
            question_span.innerHTML = model.question;

            // updating the skip/next button text
            var skip_button = document.getElementById('skip-button');
            if (model.state == "correct")
                skip_button.innerHTML = "NEXT";
            else
                skip_button.innerHTML = "SKIP";

            // updating the correct/wrong message
            var status_span = document.getElementById('status');
            var message = "";
            switch (model.state) {
                case "correct":
                    message = "&#10003;Correct!";
                    status_span.style.color = "#80ff00";
                    break;
                case "wrong":
                    message = "&#10007;Wrong";
                    status_span.style.color = "#df2020";
                    break;
            }
            status_span.innerHTML = message;
            
            // updating the buttons
            var available_letters_div = document.getElementById('available-letters');
            available_letters_div.innerHTML = "";
            for (var i in model.available_letters) {
                var button = document.createElement('button');
                var span = document.createElement('span');
                button.appendChild(span);
                var letter = model.available_letters[i];
                if (letter === " ") {
                    letter = "_";
                    span.style.opacity = '0';
                }
                span.innerHTML = letter;
                button.addEventListener('click', controller.select_letter.bind(null, i));
                available_letters_div.appendChild(button);
            }

            var selected_letters_div = document.getElementById('selected-letters');
            selected_letters_div.innerHTML = "";
            for (var i in model.selected_letters) {
                var button = document.createElement('button');
                button.innerHTML = model.selected_letters[i];
                button.addEventListener('click', controller.deselect_letter.bind(null, i));
                selected_letters_div.appendChild(button);
            }
        },
    }

    var controller = {
        init: function() {
            model.init();
            view.init();
            controller.load_new_question();
            view.update();
        },

        load_new_question: function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var question_object = JSON.parse(this.responseText)[0];
                    model.parse(question_object);
                    view.update();
                }
            }
            xhttp.open("GET", "http://jservice.io/api/random", true);
            xhttp.send();
        },

        skip_question: function() {
            console.log("Skipping a question");
            controller.load_new_question();
            model.total_questions++;
            view.update();
        },

        select_letter(id) {
            var pressed_letter = model.available_letters[id];
            var letters_array = model.available_letters.split('');
            letters_array.splice(id, 1);
            model.available_letters = letters_array.join('');
            model.selected_letters += pressed_letter;

            // check if user have selected all letters
            if (model.selected_letters.length == model.answer.length) {
                if (model.selected_letters == model.answer)
                    model.state = "correct";
                else
                    model.state = "wrong";
            } 

            view.update();
        },

        deselect_letter(id) {
            var pressed_letter = model.selected_letters[id];
            var letters_array = model.selected_letters.split('');
            letters_array.splice(id, 1);
            model.selected_letters = letters_array.join('');
            model.available_letters += pressed_letter;

            model.state = "";

            view.update();
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
