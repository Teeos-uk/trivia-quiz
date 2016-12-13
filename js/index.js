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
  
  update_view();
}

function update_view() {
  // update available characters
  var available_chars_div = document.getElementById('available_chars');
  available_chars_div.innerHTML = '';
  for (var i in available_chars) {
    var button = document.createElement('button');
    button.innerHTML = available_chars[i];
    //button.id = "available_char-" + i;
    // add click event
    button.addEventListener('click', available_pressed.bind(null, i));
    available_chars_div.appendChild(button);
  }
  
  // update selected characters
  var selected_chars_div = document.getElementById('selected_chars');
  selected_chars_div.innerHTML = '';
  for (var i in selected_chars) {
    var button = document.createElement('button');
    button.innerHTML = selected_chars[i];
    
    button.addEventListener('click', selected_pressed.bind(null, i));
    selected_chars_div.appendChild(button);
  }
  
}

var answer = "Bingo"
var available_chars = shuffle(answer.toUpperCase());
// shuffle available_chars
var selected_chars = [];

update_view();