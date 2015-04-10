var nodemailer = require('nodemailer');
var nodemailerSmtpTransport = require('nodemailer-smtp-transport');
var conf = require('../conf');

var transport = nodemailer
                .createTransport(
                  nodemailerSmtpTransport({
                    host  : conf.mail_server,
                    auth: {
                      user: conf.username,
                      pass: conf.password,
                    },
                    tls : {
                      rejectUnauthorized: false
                    }
                  }));

var jade = require('jade');
var store = require('./store');
var projects = store.get('projects');
console.log( projects );
var now = new Date();
var mailOptions = {
  // sender address
  from: conf.sender, 
  to: conf.sender,   
  // Subject line
  subject:'[周报] ' + conf.name +
          'getFullYear年getMonth月getDate日'
            .replace(/[a-zA-Z]+/g,function( $ ) {
              var ret =  now[$]();
              if( $ == 'getMonth'){
                ret += 1;
              }
              return ret;
            }),
  html: jade.renderFile('../views/mail/mail.jade',
          { projects : projects, sender : sender }) // html body
};

transport.sendMail(mailOptions,function() {
  console.log( arguments );
});