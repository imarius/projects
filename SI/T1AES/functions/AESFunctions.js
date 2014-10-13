(function (functions) {
    'use strict';
    
    AES.functions = AES.functions || {};

    AES.functions.keyExpansions = function (key) {
      var Nb = 4,            
          Nk = key.length/4,
          Nr = Nk + 6;       

      var w = new Array(Nb * ( Nr + 1 )),
          temp = new Array(4);

      for (var i = 0; i < Nk; i++) {
          var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
          w[i] = r;
      }

      for (var i = Nk; i < ( Nb * ( Nr + 1 ) ); i++) {
        w[i] = new Array(4);
        for (var t = 0; t < 4; t++) temp[t] = w[i - 1][t];

        if (i % Nk == 0) {
          temp = AES.functions.subWord(Aes.rotWord(temp));
          for (var t = 0; t < 4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
        }

        else if (Nk > 6 && i%Nk == 4) {
          temp = AES.functions.subWord(temp);
        }

        for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
      }
      
      return w;
    };

    AES.functions.subBytes = function (s, Nb) {
      for (var r=0; r<4; r++) {
        for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
      }
      
      return s;
    }
    
    AES.functions.subWord = function (w) {
      for (var i = 0; i < 4; i++) w[i] = Aes.sBox[w[i]];
    
      return w;
    };
    
    AES.functions.shiftRows = function (s, Nb) {
      var t = new Array(4);
      
      for (var r=1; r<4; r++) {
        for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];
        for (var c=0; c<4; c++) s[r][c] = t[c];
      }    

      return s;
    };
    
    AES.functions.mixColumns = function(s, Nb) {
      for (var c = 0; c < 4; c++) {
        var a = new Array(4),
            b = new Array(4);
        
        for (var i = 0; i < 4; i++) {
          a[i] = s[i][c];
          b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
        }

        s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
        s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
        s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
        s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
      }
      return s;
    };
    
    AES.functions.addRoundKey = function(state, w, rnd, Nb) {
      for (var r=0; r<4; r++) {
        for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
      }
      
      return state;
    };
    
    AES.functions.rotWord = function(w) {
      var tmp = w[0];
      
      for (var i=0; i<3; i++) w[i] = w[i+1];
      
      w[3] = tmp;
      
      return w;
    };
    
    
}(window.AES))