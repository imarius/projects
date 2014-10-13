(function (helpers) {
    'use strict';

    AES.helpers = AES.helpers || {};

    AES.helpers.cipher = function(input, w) {
      var Nb = 4,
          Nr = w.length/Nb - 1;
      
      var state = [[],[],[],[]];

      for (var i=0; i<4*Nb; i++) 
        state[i%4][Math.floor(i/4)] = input[i];
      
      state = AES.functions.addRoundKey(state, w, 0, Nb);

      for (var round=1; round<Nr; round++) {
          state = AES.functions.subBytes(state, Nb);
          state = AES.functions.shiftRows(state, Nb);
          state = AES.functions.mixColumns(state, Nb);
          state = AES.functions.addRoundKey(state, w, round, Nb);
      }
      
      state = AES.functions.subBytes(state, Nb);
      state = AES.functions.shiftRows(state, Nb);
      state = AES.Functions.addRoundKey(state, w, Nr, Nb);

      var output = new Array(4*Nb);

      for (var i=0; i<4*Nb; i++) 
        output[i] = state[i%4][Math.floor(i/4)];

      return output;
    };
}(window.AES))