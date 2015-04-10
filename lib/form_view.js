// form
//   scheme : string : string regex funtion
//            number : number 
//            enum   : array
//            
//            with_valide_type : select constructor
//            
//            other  : try form
//   items : []
//   can_submit
//   
// string_item
//   get_value
//   set_value
//   validater
//
// number_item
// enum_item
//   enums
// ref_item
//   just another form
//   items : []
// list_item
//   scheme: see form.scheme
//   items : []
//   

function form ( name ) {
  this.items = [];
  this.name = name;
  this.name === undefined && (this.name = '');
}
var fp = form.prototype;
fp.get_value = function() {
  var ret = {};
  this.items.forEach(function( item ) {
    ret[item.name] = item.get_value 
                      ? item.get_value() 
                      : item.value;
  })
  return ret;
}
fp.can_submit = function() {
  if( !this.items.length ){
    return true;
  }
  var item;
  for(var i = 0; item = this.items[i]; i ++ ){
    if( item.can_submit ){
      if (  !item.can_submit()  ){
        return false;
        
      }
    }
    else if( !item.validater( 
          item.get_value
            ? item.get_value() 
            : item.value) 
    ){
      return false;
    }
  }
  return true;
}
fp.load_scheme = function( scheme ) {
  var self = this;
  Object.keys(scheme).forEach(function( name ) {
    var sub  = scheme[name];
    var item = form.create_item(name, sub);
    self.items.push( item );
  });
}
fp.set_value = function( data ) {
  this.items.forEach(function( item ) {
    if( data[item.name] ){
      if( item.set_value ){
        item.set_value( data[item.name]);
      } else {
        item.value = data[item.name];
      }
    }
  })
}
form.create_item = function( name, sub ) {
  var item;
  if( sub.type && typeof sub.type == 'string' ){
    console.assert( form_view[sub.type + '_item'], sub.type + ' not found');
    item = new form_view[sub.type+'_item'](name, sub);
    if( sub.value ){
      item.value = sub.value;
    }
  } 
  else if( typeof sub == 'string' ){
    item = new string_item(name,{ default_value : sub });
  }
  else if( sub instanceof RegExp || typeof sub == 'function'){
    item = new string_item(name,{ validater : sub });
  } 
  else if( typeof sub == 'number' ){
    item = new number_item(name,{ default_value : sub });
  }
  else if( Array.isArray(sub)){
    item = new enum_item(name,{ enums : sub });
  }
  else {
    item = new form( name );
    item.load_scheme(sub);
  }
  return item;
}
var pass = function(){ return true };
function build_validater ( validater ) {
  switch( 
    Object.prototype.toString
      .call(validater)
      .match(/\s([^\]]+)\]/)[1]
   ){
    case 'Function':
    // custom
      return validater;
    case 'RegExp':
      return function( val ) {
        return validater.test(val);
      };
    case 'Array':
    // min length and max length
    // min and max
    // earliest and latest
      return function( val ) {
        if( val.length ){
          val = val.length;
        }
        return val >= validater[0] && val <= validater[1];
      };
    case 'Number':
    // max
      return function( val ) {
        if(val.length){
          val = val.length;
        }
        return val < validater;
      };
  }
  return pass;
}
var default_infos = { 1 : 'illegal data'};
function string_item ( name, opts ) {
  opts = opts || {};
  this.name = name;
  this.default_value = 
  this.value = opts.default_value || '';
  this.type  = 'string';
  this.infos = opts.infos || default_infos;
  this.validater = build_validater( opts.validater );
  
  opts.get_value && (this.get_value = opts.get_value);
  opts.set_value && (this.set_value = opts.set_value);
};

function date_item ( name, opts ) {
  opts = opts || {};
  string_item.apply(this, arguments);
  this.format = opts.format || 'yy/dd';
  this.type = 'date';
};

function number_item() {
  string_item.apply(this, arguments);
  this.type = 'number';
};
var np = number_item.prototype;
np.get_value = function() {
  return Number(this.value);
};

function enum_item ( name, opts) {
  string_item.apply(this, arguments);
  this.type  = 'enum';
  // force string to match the form val;
  this.enums = opts.enums.map(String);
  if( !this.enums.length ){
    throw new Error('no enum item given');
  }
  this.value = this.enums[0];
};
var ep = enum_item.prototype;
ep.set_value = function( val ) {
  this.value = ~this.enums.indexOf(val) ? val : this.enums[0];
}

function ref_item () {
  string_item.apply(this,arguments);
  this.type = 'ref';
};

function list_item ( name, opts) {
  string_item.apply(this,arguments);
  this.type = 'list';
  this.items = [];
  this.scheme = opts.scheme || 'string';
  this.set_value(this.default_value || []);
};
var lp = list_item.prototype;

lp.set_value = function( values ) {
  var self = this;
  this.items.length = 0;
  var val;
  for(var idx in values ){
    val = values[idx];
    var item = form.create_item( idx, self.scheme);
    item.set_value 
      ? item.set_value( val )
      : (item.value = val);
    self.items.push(item);
  }
};
lp.create_tpl_item = function() {
  return {
    items : [form.create_item( '<%item_idx%>', 
              this.scheme)]
  };
};
lp.get_value= function() {
  return this.items.map(function( item ) {
    return item.get_value 
            ? item.get_value()
            : item.value;
  })
};
lp.can_submit= fp.can_submit;

var form_view = {
  form  : form,
  string_item : string_item,
  date_item   : date_item,
  number_item : number_item,
  enum_item : enum_item,
  ref_item : ref_item,
  list_item : list_item
}

if( "object" == typeof exports ){
  module.exports = form_view;
}