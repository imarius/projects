(function (controller) {
    'use strict';
    
    AES.controller = AES.controller || {};
    
    AES.controller.decrypt = function (cipher, password, nBits) {
      var start = new Date().getTime();
      var blockSize = 16;
      
      if (!(nBits === 128 || nBits === 192 || nBits === 256)) return '';
      
      var ciphertext = String(cipher).base64Decode(),
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
      
      var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize),
          ct = new Array(nBlocks);
          
      for (var b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8 + b * blockSize, 8 +b * blockSize + blockSize);
      
      ciphertext = ct;

      var plaintxt = new Array(ciphertext.length);
      
      for (var b = 0; b < nBlocks; b++) {
        for (var c=0; c<4; c++) counterBlock[15 - c] = ((b) >>> c*8) & 0xff;
        for (var c=0; c<4; c++) counterBlock[15 - c - 4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

        var cipherCntr = AES.helpers.cipher(counterBlock, keySchedule);

        var plaintxtByte = new Array(ciphertext[b].length);
		
        for (var i = 0; i < ciphertext[b].length; i++) {
            plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
            plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
        }
		
        plaintxt[b] = plaintxtByte.join('');
      }

      var plaintext = plaintxt.join('');
      plaintext = plaintext.utf8Decode();

      var end = new Date().getTime();
      
      var executionTime = end - start;
      
      var returnData = {
        output : plaintext,
        executionTime : executionTime
      };
      
      return returnData;
    };
    
    AES.controller.encrypt = function(plaintext, password, nBits) {
      var start = new Date().getTime();
      var blockSize = 16;
      
      if (!(nBits === 128 || nBits === 192 || nBits === 256)) return '';
      
      plaintext = String(plaintext).utf8Encode();
      password = String(password).utf8Encode();

      var nBytes = nBits / 8,
          pwBytes = new Array(nBytes);
          
      for (var i = 0; i < nBytes; i++) {
          pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
      }
      
      var key = AES.helpers.cipher(pwBytes, AES.functions.keyExpansion(pwBytes));
      key = key.concat(key.slice(0, nBytes-16));

      var counterBlock = new Array(blockSize);

      var nonce = (new Date()).getTime(),
          nonceMs = nonce % 1000,
          nonceSec = Math.floor(nonce / 1000),
          nonceRnd = Math.floor(Math.random() * 0xffff);

      for (var i = 0; i < 2; i++) counterBlock[i]   = (nonceMs  >>> i * 8) & 0xff;
      for (var i = 0; i < 2; i++) counterBlock[i+2] = (nonceRnd >>> i * 8) & 0xff;
      for (var i = 0; i < 4; i++) counterBlock[i+4] = (nonceSec >>> i * 8) & 0xff;

      var ctrTxt = '';
      for (var i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

      var keySchedule = AES.functions.keyExpansion(key);

      var blockCount = Math.ceil(plaintext.length / blockSize);
      var ciphertxt = new Array(blockCount);

      for (var b=0; b<blockCount; b++) {
          for (var c = 0; c < 4; c++) counterBlock[15-c] = (b >>> c * 8) & 0xff;
          for (var c = 0; c < 4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c * 8);

          var cipherCntr = AES.helpers.cipher(counterBlock, keySchedule);

          var blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
          var cipherChar = new Array(blockLength);

          for (var i = 0; i < blockLength; i++) {
              cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
              cipherChar[i] = String.fromCharCode(cipherChar[i]);
          }
          ciphertxt[b] = cipherChar.join('');
      }

      var ciphertext = ctrTxt + ciphertxt.join('');
      ciphertext = ciphertext.base64Encode();

      var end = new Date().getTime();
      
      var time = end - start;
      
      var returnData = {
        output : ciphertext,
        executionTime : time
      };
      
      return returnData;
    };
}(window.AES))