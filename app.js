process.env.DEBUG= 'sendmail';

var path = require('path');
var fs = require('fs');

var express = require('express');
var jade = require('jade');

var app = new express();

app.set('port', process.env.PORT || 8878);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var serveStatic = require('serve-static');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(errorhandler());
app.use(serveStatic(path.join(__dirname,'public')));
app.use('/share',serveStatic(path.join(__dirname,'lib')));

app.locals.side_menu = [{ 
  name : 'projects',
  href : '/projects'
}];

app.locals.form_view_tpl_func = jade.compileClient(
                                  fs.readFileSync('./views/client_template.jade','utf8'),
                                  {
                                    filename: './views/client_template.jade'
                                  });

var store = require('./action/store');
var form_view = require('./lib/form_view');
var projects_scheme = require('./action/projects_scheme');

function get_projects_view ( projects ) {
  var projects_view = new form_view.form();
  projects_view.load_scheme(projects_scheme);
  if( projects ){
    projects_view.set_value( projects );
  }
  return projects_view;
}

app.get('/',function( req, resp ) {
  resp.redirect('/projects');
});

var projects_router = new express.Router();

projects_router.route('/projects')
  .get(function( req, resp, next ) {
    var projects = store.get('projects');

    resp.render('projects.jade',{ 
      projects : projects,
      pretty   : true
    });
  })
projects_router
  .get('/add',function( req, resp, next ) {
    var projects_view = get_projects_view();
    resp.render('edit.jade',{ 
      post_url : '/edit',
      projects : projects_view,
      pretty   : true
    });
  })
  .get('/edit',function( req, resp, next ) {
    if( req.query.id == 'undefined' ){
      next('illegal params');
      return;
    }
    var project = store.getPath('projects.'+req.query.id);
    if( !project ){
      next('project not exsists');
      return;
    }
    var projects_view = get_projects_view( project );

    resp.render('edit.jade',{ 
      post_url : '/edit?id=' + req.query.id,
      projects : projects_view,
      pretty   : true
    });
  })
  .get('/clone',function( req, resp, next ) {
    if( req.query.id == 'undefined' ){
      next('illegal params');
      return;
    }
    var project = store.getPath('projects.'+req.query.id);
    if( !project ){
      next('project not exsists');
      return;
    }
    var projects_view = get_projects_view(project);

    resp.render('edit.jade',{
      post_url : '/edit',
      projects : projects_view,
      pretty   : true
    });
  })
  .get('/delete',function( req, resp, next ) {
    if( req.query.id == 'undefined' ){
      next('illegal params');
      return;
    }

    store.setPath('projects.'+req.query.id +'.deleted', true);

    resp.redirect(301,'/projects');
  })
  .post('/edit',function( req, resp, next ) {
    var projects_view = get_projects_view(req.body);
    var error = '';
    if( projects_view.can_submit()){
      if( req.query.id ){
        store.setPath('projects.' + req.query.id, 
                      projects_view.get_value());
      } else {
        store.push('projects', projects_view.get_value());
      }
    } else {
      error = 'input errors';
    }
    if( error ){
      resp.render('edit.jade',{
        id       : req.query.id,
        projects : projects_view, 
        error    : error 
      });
    } else {
      resp.redirect(301,'/projects');
    }
  });
app.use(projects_router);

app.listen(app.get('port'));
console.log('send mail ui start at ', app.get('port'));