var cubby = require('cubby');
var path = require('path');

var store = module.exports = new cubby({ file : path.join(__dirname,'projects.db.json')});

store.push = function( key, item ) {
  var tar = store._db[key] || (store._db[key] = []); 
  tar.push( item );

  console.log( key, item );
  console.log( store._db );

  store._save();
  console.log( 'pushed');
}