$(document).ready(function() {
  $("#encrypt").on("click", function() {
    try {
      $("#error").hide();
      var message = $("#plaintext").val();
      var password = $("#password").val();
      var encryption = $("#encryption").val(); 
     
      var returnData = AES.controller.encrypt(message, password, parseInt(encryption));

      if ( returnData.output === ' ' || typeof returnData.executionTime === 'undefined') {
        $("#error").fadeIn();
        return false;
      }
      
      $("#encrypt-results").fadeIn();
      $("#enc-res").html(returnData.output);
      $("#enc-res").append("<br /><br />Execution time : " + returnData.executionTime + " ms");
      
      return false;
    } catch (err) {
      alert(err);
    }
  });
  
  $("#decrypt").on("click", function() {
    try {
      $("#error").hide();
      var cipher = $("#decrypt-key").val();
      var password = $("#decrypt-password").val();
      var encryption = $("#decrypt-bytes").val(); 
     
      var returnData = AES.controller.decrypt(cipher, password, parseInt(encryption));
      
      if ( returnData.output === '' || typeof returnData.executionTime === 'undefined') {
        $("#error").fadeIn();
        return false;
      } 
      
      $("#dec-res").html(returnData.output);
      $("#dec-res").append("<br /><br />Execution time : " + returnData.executionTime + " ms");
      
      $("#dec-res").fadeIn();
      
      return false;
    } catch (err) {
      alert(err);
    }
  });
  
  $("#clear-encrypt").on("click", function() {
    $("#plaintext").val("");
    $("#password").val("");
    $("#encryption").val("");
    
    $("#encrypt-results").fadeOut();
    $("#enc-res").html('');
    
    return false;
  });
});