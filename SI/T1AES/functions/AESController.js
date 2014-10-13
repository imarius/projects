(function (controller) {
    'use strict';
    
    AES.controller = AES.controller || {};
    
    AES.controller.decrypt = function (cipher, password, nBits) {
      var blockSize = 16;
      
      if (!(nBits === 128 || nBits === 192 || nBits === 256)) return '';
      
      ciphertext = String(cipher).base64Decode();
      password = String(password).utf8Encode();
      
      var nBytes = nBits/8,
          pwBytes = new Array(nBytes);
          
      for (var i = 0; i < nBytes; i++) {
        pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
      }
      
      var key = AES.helpers.cipher(pwBytes, AES.functions.keyExpansion(pwBytes));
      key = key.concat(key.slice(0, nBytes-16));

      var counterBlock = new Array(8),
          ctrTxt = ciphertext.slice(0, 8);
          
      for (var i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);
      
      var keySchedule = AES.functions.keyExpansion(key);
      
      var nBlocks = Math.ceil((ciphertext.length-8) / blockSize),
          ct = new Array(nBlocks);
          
      for (var b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
      
      ciphertext = ct;

      var plaintxt = new Array(ciphertext.length);
      
      //MITODO : Continue
    };
}(window.AES))