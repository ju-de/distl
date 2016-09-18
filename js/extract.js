
/*
 * Takes HTML as input, preserve text enclosed by <p> or <h1>, <h2> etc. tags,
 * and remove HTML tags within the preserved passages
 */


function extract(responseText) {
  var ST_NONE = 0;

  var ST_LT = 1;          // <
  var ST_LT_P = 2;        // <p

  var ST_LT_H = 3;        // <h
  var ST_LT_H_X = 4;      // <h1

  var ST_VALID = 10;      // <p> or <h1>

  var ST_VALID_LT = 11;   // <
  var ST_VALID_LT_S = 12; // </

  var ST_VALID_LT_S_P = 13;   // </p

  var ST_VALID_LT_S_H = 14;   // </h
  var ST_VALID_LT_S_H_X = 15; // </h1

  var ST_SKIP = 20;
  

  var state = ST_NONE;
  var processedText = "";
  var textLen = responseText.length;
  var isExtracting = false;

  for (var i = 0; i < textLen; i++) {
    var currChar = responseText.charAt(i);
    switch (state) {
      case ST_NONE:
        if (currChar === '<') {   // <
          state = ST_LT;
        }
        break;
      case ST_LT:
        if (currChar.toLowerCase() === 'p') {   // <p
          state = ST_LT_P;
        } else if (currChar.toLowerCase() === 'h') {    // <h
          state = ST_LT_H;
        } else state = ST_NONE;   // <..
        break;
      case ST_LT_P:
        if (currChar === '>') {   // <p>
          state = ST_VALID;
          isExtracting = true;
          continue;         // don't extract this char
        } else state = ST_NONE;   // <p..
        break;
      case ST_LT_H:
        if (currChar >= '0' && currChar <= '9') {   // <h1
          state = ST_LT_H_X;
        } else state = ST_NONE;   // <h..
        break;
      case ST_LT_H_X:
        if (currChar === '>') {   // <h1>
          state = ST_VALID;
          isExtracting = true;
          continue;         // don't extract this char
        } else state = ST_NONE;   // <h1..
        break;
      case ST_VALID:
        if (currChar === '<') {   // <
          state = ST_VALID_LT;
        }
        break;
      case ST_VALID_LT:
        if (currChar === '/') {   // </
          state = ST_VALID_LT_S;
        } else {                  // <..
          state = ST_SKIP;
          isExtracting = false;
          processedText = processedText.slice(0, -1);   // discard last char ('<')
        }
        break;
      case ST_VALID_LT_S:
        if (currChar.toLowerCase() === 'p') {   // </p
          state = ST_VALID_LT_S_P;
        } else if (currChar.toLowerCase() === 'h') {    // </h
          state = ST_VALID_LT_S_H;
        } else {                  // </..
          state = ST_SKIP;
          isExtracting = false;
          processedText = processedText.slice(0, -2);   // discard last 2 chars ('</')
        }
        break;
      case ST_VALID_LT_S_P:
        if (currChar === '>') {   // </p>
          state = ST_NONE;
          isExtracting = false;
          processedText = processedText.slice(0, -3);   // discard last 3 chars ('</p')
          processedText += "\n\n\n\n";
        } else {                  // </p..
          state = ST_SKIP;
          isExtracting = false;
          processedText = processedText.slice(0, -3);   // discard last 3 chars ('</p')
        }
        break;
      case ST_VALID_LT_S_H:
        if (currChar >= '0' && currChar <= '9') {   // </h1
          state = ST_VALID_LT_S_H_X;
        } else {                  // </h..
          state = ST_SKIP;
          isExtracting = false;
          processedText = processedText.slice(0, -3);   // discard last 3 chars ('</h')
        }
        break;
      case ST_VALID_LT_S_H_X:
        if (currChar === '>') {   // </h1>
          state = ST_NONE;
          isExtracting = false;
          processedText = processedText.slice(0, -4);   // discard last 4 chars ('</h1')
          processedText += "\n\n\n\n";
        } else {                  // </h1..
          state = ST_SKIP;
          isExtracting = false;
          processedText = processedText.slice(0, -4);   // discard last 4 chars ('</h1')
        }
        break;
      case ST_SKIP:
        if (currChar === '>') {   // < ... >
          state = ST_VALID;
          isExtracting = true;
          continue;     // don't extract this char
        }
        break;
    }

    if (isExtracting) {
      processedText += currChar;
    }
    
  }

  return processedText;
}