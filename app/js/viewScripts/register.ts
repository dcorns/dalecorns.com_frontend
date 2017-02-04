/**
 * register.ts
 * Created by dcorns on 3/13/16
 * Copyright © 2016 Dale Corns
 */
'use strict';
var doAjax = require('do-ajax');

module.exports = function register(app){
  var emailIn = document.getElementById('emailIn');
  var passwordIn = document.getElementById('passwordIn');
  var confirmPassword = document.getElementById('confirmPassword');
  var btnSaveAccount = document.getElementById('saveAccount');
  emailIn.value = sessionStorage.getItem('email');

  btnSaveAccount.addEventListener('click', function(){
    if(passwordIn.value !== confirmPassword.value){
      alert('Passwords do not match');
    }
    else{
      doAjax.ajaxPostJson('/newAccount', {email: emailIn.value, password: passwordIn.value}, function(err, data){
        if(err) alert('Account Creation Failed: ' + err);
        else{
          app.help.toggleClass(app.sharedObjects.toggleElements, 'hide');
          sessionStorage.removeItem('email');
          localStorage.setItem('DRCToken', data.token);
          window.location = '#/posts';
        }
      });
    }
  });
};