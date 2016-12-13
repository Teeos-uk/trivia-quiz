function randrange(floor, ceil) {
  return Math.floor(Math.random()*(ceil - floor) + floor);
}

function shuffle(str) {
  var array = str.split('');
  var buffer = 0;
  var random_index = 0;
  for (var i = 0; i < array.length; i++) {
    random_index = randrange(i, array.length);
    buffer = array[i];
    array[i] = array[random_index];
    array[random_index] = buffer;
  }
  return array.join('');
}

function selected_pressed(id) {
  var pressed_char = selected_chars[id];
  
  // cut the pressed character out from available_chars
  var selected_chars_array = selected_chars.split('');
  selected_chars_array.splice(id, 1);
  selected_chars = selected_chars_array.join('');
  
  // add pressed character in available_chars
  available_chars = available_chars + pressed_char;
  
  status = '';
  update_view();
}

function available_pressed(id) {
  var pressed_char = available_chars[id];
  
  // cut the pressed character out from available_chars
  var available_chars_array = available_chars.split('');
  available_chars_array.splice(id, 1);
  available_chars = available_chars_array.join('');
  
  // add pressed character in selected_chars
  selected_chars = selected_chars + pressed_char;
  
  // checking whether user has selected all letters
  if (available_chars.length === 0)
    if (selected_chars == answer.toUpperCase())
      status = "Correct";
    else
      status = "Wrong";
  
  update_view();
}

function update_view() {
  // update available characters
  var available_chars_div = document.getElementById('available_chars');
  available_chars_div.innerHTML = '';
  for (var i in available_chars) {
    var button = document.createElement('button');
    button.innerHTML = available_chars[i];
    button.style.width = '40px';
    button.style.height = '40px';
    button.addEventListener('click', available_pressed.bind(null, i));
    available_chars_div.appendChild(button);
  }
  // update selected characters
  var selected_chars_div = document.getElementById('selected_chars');
  selected_chars_div.innerHTML = '';
  for (var i in selected_chars) {
    var button = document.createElement('button');
    button.innerHTML = selected_chars[i];
    button.style.width = '40px';
    button.style.height = '40px';
    button.addEventListener('click', selected_pressed.bind(null, i));
    selected_chars_div.appendChild(button);
  }
  // update status message
  var status_header = document.getElementById('status');
  status_header.innerHTML = status;
  // update 'next' button
  var next_button = document.getElementById('next');
  if (status == 'Correct')
    next_button.innerHTML = 'Next question';
  else
    next_button.innerHTML = 'Skip question';
  // update question text
}

function new_question() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", 'http://jservice.io/api/random', false);
  xhttp.send();
  return JSON.parse(xhttp.responseText)[0];
}

var question_obj = new_question();

var status = '';
var question = question_obj['question'];
document.getElementById('question').innerHTML = question;
var answer = question_obj['answer'];
var available_chars = shuffle(answer.toUpperCase());
// shuffle available_chars
var selected_chars = '';
update_view();