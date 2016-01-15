var debug = require("debug")("controller");

module.exports = function(app) {
    var router = app.loopback.Router();

    var Categoria = app.models.Categoria;
    var Producto = app.models.Producto;

    router.post('/auth/login', function(req, res) {
        var root = {
            usuario: 'root',
            password: 'root'
        };
        var persona = {
            usuario: req.body.form_usuario,
            password: req.body.form_password
        };
        if ((root.usuario == persona.usuario) && (root.password == persona.password)) {
            res.render('principal');
        }
    });

    router.get('/', function(req, res) {
        res.redirect('login');
    });

    router.get('/principal', function(req, res) {
        res.render('principal');
    });

    router.get('/login', function(req, res) {
        res.render('login');
    });


    router.get('/producto/crear', function(req, res) {
        Categoria.find({}, function(err, objResult_categoria) {
            if (err) res.sendStatus(404)
            res.render('crearproducto', {
                objResult_categoria: objResult_categoria
            })
        });
    });

    router.get('/producto/editar', function(req, res) {
        res.render('editarproducto');
    });

    router.get('/producto/eliminar', function(req, res) {
        res.render('eliminarproducto');
    });

    router.get('/producto', function(req, res) {
        var idCategoria = req.query.idCategoria;
        console.log(idCategoria);
        Categoria.find({}, function(err, objResult_categoria) {
            Producto.find({}, function(err, objResult_producto) {
                if (err) res.sendStatus(404);
                res.render('producto', {
                    objResult_producto: objResult_producto,
                    objResult_categoria: objResult_categoria
                });
            });
        });
    });

    router.post('/producto', function(req, res) {
        var nuevoProducto = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            descripcion: req.body.descripcion,
            categoriaId: req.body.categoriaId
        }
        console.log(nuevoProducto);


        Categoria.find({}, function(err, objResult_categoria) {
            Producto.create(nuevoProducto, function(err, obj) {
                if (err) res.render('crearproducto', {
                    message: "error producido",
                    objResult_categoria: objResult_categoria
                });
                else res.render('crearproducto', {
                    message: "producto creado con exito",
                    objResult_categoria: objResult_categoria
                });
            });
        });
    });


    /*Producto.create(nuevoProducto,function(err,obj){
          if(err) res.render('crearproducto',{
            message: "error producido",
          });
          res.render('crearproducto',{
            message: "objeto guardado con exito"
          });
        });*/

    router.get('/categoria', function(req, res) {
        Categoria.find({}, function(err, objResult) {
            if (err) res.sendStatus(404);
            res.render('categoria', {
                objResult: objResult
            })
        })
    });

    router.post('/categoria', function(req, res) {
        debug('req.body', req.body);

        var nuevaCategoria = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        }
        Categoria.create(nuevaCategoria, function(err, obj) {
            if (err) {
                debug("err", err);
                res.render('crearcategoria', {
                    message: "error producido"
                });
            }
            res.render('crearcategoria', {
                message: "objeto guardado con exito"
            });
        });
    });

    router.get('/categoria/crear', function(req, res) {

        res.render('crearcategoria');
    });

    router.get('/categoria/editar', function(req, res) {
        res.render('editarcategoria');
    });

    router.get('/categoria/eliminar', function(req, res) {
        res.render('eliminarcategoria');
    });

    router.get('/categoria/listar', function(req, res) {
        /*Categoria.find({}, function(err, objResult) {
            if (err) return res.sendStatus(404);
            res.render('listarcategoria', {
                objResult: objResult
            })
        })*/
        res.render('listarcategoria');
    });


    app.use(router);
}