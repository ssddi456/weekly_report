
      (function(){
        var form_view_tpl_func = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (JSON, parent_type, prefix, settings) {
jade_mixins["setting_tree_item"] = function( val, item_name, parent_type ){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"form-group\">");
if ( parent_type != 'list')
{
buf.push("<label class=\"form-label\">" + (jade.escape(null == (jade_interp = val.name) ? "" : jade_interp)) + "</label>");
}
if ( val.type == 'enum')
{
buf.push("<select" + (jade.attr("name", "" + (item_name) + "", true, false)) + " class=\"form-control\">");
// iterate val.enums
;(function(){
  var $$obj = val.enums;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var en = $$obj[$index];

if ( val.value == en)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade_interp = en) ? "" : jade_interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade_interp = en) ? "" : jade_interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var en = $$obj[$index];

if ( val.value == en)
{
buf.push("<option selected=\"selected\">" + (jade.escape(null == (jade_interp = en) ? "" : jade_interp)) + "</option>");
}
else
{
buf.push("<option>" + (jade.escape(null == (jade_interp = en) ? "" : jade_interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select>");
}
else
{
buf.push("<input type=\"text\"" + (jade.attr("value", "" + (val.value) + "", true, false)) + (jade.attr("name", "" + (item_name) + "", true, false)) + " class=\"form-control\"/>");
}
buf.push("</div>");
};
jade_mixins["setting_tree_list_item"] = function( parent_type ){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if ( parent_type == 'list')
{
buf.push("<div class=\"row\"><div class=\"col-md-11\">");
block && block();
buf.push("</div><div class=\"col-md-1\"><a class=\"btn btn-default list-remove\"> <i class=\"fa fa-remove\"></i></a></div></div>");
}
else
{
block && block();
}
};
jade_mixins["typed_edit_setting_tree"] = function( settings, prefix, parent_type ){
var block = (this && this.block), attributes = (this && this.attributes) || {};
// iterate settings.items
;(function(){
  var $$obj = settings.items;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];

var item_name = prefix ? prefix + '[' + val.name + ']' : val.name;
if ( !val.items)
{
jade_mixins["setting_tree_list_item"].call({
block: function(){
jade_mixins["setting_tree_item"](val, item_name, parent_type);
}
}, parent_type);
}
else
{
jade_mixins["setting_tree_list_item"].call({
block: function(){
buf.push("<fieldset class=\"form\"><legend>" + (jade.escape(null == (jade_interp = item_name) ? "" : jade_interp)) + "</legend>");
if ( val.type == 'list')
{
buf.push("<div" + (jade.attr("data-list-prefix", "" + (item_name) + "", true, false)) + " class=\"list-body\">");
jade_mixins["typed_edit_setting_tree"](val, item_name, val.type );
buf.push("</div><div class=\"list-footer\"><a href=\"###\" class=\"btn btn-default list-add\">add</a><script type=\"text/json\">" + (((jade_interp = JSON.stringify(val.create_tpl_item())) == null ? '' : jade_interp)) + "</script></div>");
}
else
{
jade_mixins["typed_edit_setting_tree"](val, item_name, val.type );
}
buf.push("</fieldset>");
}
}, parent_type);
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];

var item_name = prefix ? prefix + '[' + val.name + ']' : val.name;
if ( !val.items)
{
jade_mixins["setting_tree_list_item"].call({
block: function(){
jade_mixins["setting_tree_item"](val, item_name, parent_type);
}
}, parent_type);
}
else
{
jade_mixins["setting_tree_list_item"].call({
block: function(){
buf.push("<fieldset class=\"form\"><legend>" + (jade.escape(null == (jade_interp = item_name) ? "" : jade_interp)) + "</legend>");
if ( val.type == 'list')
{
buf.push("<div" + (jade.attr("data-list-prefix", "" + (item_name) + "", true, false)) + " class=\"list-body\">");
jade_mixins["typed_edit_setting_tree"](val, item_name, val.type );
buf.push("</div><div class=\"list-footer\"><a href=\"###\" class=\"btn btn-default list-add\">add</a><script type=\"text/json\">" + (((jade_interp = JSON.stringify(val.create_tpl_item())) == null ? '' : jade_interp)) + "</script></div>");
}
else
{
jade_mixins["typed_edit_setting_tree"](val, item_name, val.type );
}
buf.push("</fieldset>");
}
}, parent_type);
}
    }

  }
}).call(this);

buf.push("<script></script>");
};




jade_mixins["typed_edit_setting_tree"]( settings, prefix, parent_type );}.call(this,"JSON" in locals_for_with?locals_for_with.JSON:typeof JSON!=="undefined"?JSON:undefined,"parent_type" in locals_for_with?locals_for_with.parent_type:typeof parent_type!=="undefined"?parent_type:undefined,"prefix" in locals_for_with?locals_for_with.prefix:typeof prefix!=="undefined"?prefix:undefined,"settings" in locals_for_with?locals_for_with.settings:typeof settings!=="undefined"?settings:undefined));;return buf.join("");
};
      $(document)
        .on('click','.list-remove',function(){
          $(this).parents('.row').first().remove();
        })
        .on('click','.list-add',function(){
          var footer = 
            $(this).parents('.list-footer').first();
          var body = footer.siblings('.list-body');
          var prefix = body.attr('data-list-prefix');
          var last_input = body.find('[name^="'+prefix+'"]').last();
          var last_idx  = last_input.attr('name');
          last_idx = (last_idx || '').replace(prefix,'');
          last_idx = last_idx.length 
                       ? Number(last_idx.match(/^\[(\d+)/)[1])
                       : 0;
      
          var item = footer.find('script[type="text/json"]')
                      .text()
          item = JSON.parse(item);
          item = form_view_tpl_func({ settings : item });
          body.append(item);
        });
      }())
