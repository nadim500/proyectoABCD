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

    router.post('/producto/editar', function(req, res) {
        var idProducto = req.body.idProducto;

        Categoria.find({}, function(err, objResult_categoria) {
            Producto.find({
                where: {
                    id: idProducto
                }
            }, function(err, objResult_producto) {
                if (err) return res.sendStatus(404);
                return res.render('editarproducto', {
                    objResult_producto: objResult_producto,
                    objResult_categoria: objResult_categoria
                });
            });
        });

    });

    router.post('/editarproducto', function(req, res) {
        var idProducto = req.body.idProducto;
        console.log("*********", idProducto);
        Producto.findById(idProducto, function(err, objResult) {
            if (err) return res.sendStatus(404);
            objResult.nombre = req.body.nuevoNombre;
            objResult.precio = req.body.nuevoPrecio;
            objResult.cantidad = req.body.nuevoCantidad;
            objResult.descripcion = req.body.nuevoDescripcion;
            objResult.categoriaId = req.body.idCategoria;
            objResult.save();
            console.log("+++", objResult);
            Producto.find({
                include: ['categorias']
            }, function(err, objResult_producto) {
                if (err) return res.sendStatus(404);
                objResult_producto = objResult_producto.map(function(obj) {
                    return obj.toJSON();
                });
                return res.render('producto', {
                    objResult_producto: objResult_producto

                    //Categoria.find({}, function(err, objResult_categoria) {
                    //    Producto.find({}, function(err, objResult_producto) {
                    //        if (err) return res.sendStatus(404);
                    //        return res.render('producto', {
                    //            objResult_producto: objResult_producto,
                    //            objResult_categoria: objResult_categoria
                    //        })
                    //    })
                    //})
                });
            });
        });
    });

    router.get('/producto/eliminar', function(req, res) {
        res.render('eliminarproducto');
    });

    router.get('/producto', function(req, res) {
        var idCategoria = req.query.idCategoria;
        console.log(idCategoria);
        if (idCategoria != undefined) {

            Producto.find({
                    where: {
                        categoriaId: idCategoria
                    },
                    include: ['categorias']
                }, function(err, objResult_producto) {
                    if(err) return res.sendStatus(404);
                    objResult_producto=objResult_producto.map(function(obj){
                        return obj.toJSON();
                    })
                    res.render('producto',{
                        objResult_producto:objResult_producto
                    })
            })

            //Categoria.find({}, function(err, objResult_categoria) {
            //    Producto.find({
            //        where: {
            //            categoriaId: idCategoria
            //        }
            //    }, function(err, objResult_producto) {
            //        if (err) res.sendStatus(404);
            //        else res.render('producto', {
            //            objResult_categoria: objResult_categoria,
            //            objResult_producto: objResult_producto
            //        });
            //    });
            //});

            //Producto.find({include:categorias:['tipo']})

        } else Producto.find({include: ['categorias']}, function(err, objResult_producto) {
            if (err) return res.sendStatus(404);
            objResult_producto = objResult_producto.map(function(obj) {
                return obj.toJSON();
            });
            return res.render('producto', {
                objResult_producto: objResult_producto

    //Categoria.find({}, function(err, objResult_categoria) {
    //    Producto.find({}, function(err, objResult_producto) {
    //        if (err) res.sendStatus(404);
    //        else res.render('producto', {
    //            objResult_producto: objResult_producto,
    //            objResult_categoria: objResult_categoria
    //        });
    //    });

            });
        });
    });


    //   Producto.find({include:{owner:'categorias'}},function(err, objResult) {
    //           console.log(objResult);
    //       });

    //me da los resultados del producto incluido el 
    //resultado de la categoria en cada producto
    //     Producto.find({include:'categorias'},function(err, objResult) {
    //             console.log(objResult);
    //         });

    //   Categoria.find({include:'productos'},function(err, objResult) {
    //           console.log(objResult);
    //       });



    router.post('/producto', function(req, res) {
        var nuevoProducto = {
                nombre: req.body.nombre,
                precio: req.body.precio,
                cantidad: req.body.cantidad,
                descripcion: req.body.descripcion,
                categoriaId: req.body.categoriaId
            }
            //console.log(nuevoProducto);


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

    router.post('/producto/eliminar', function(req, res) {
        var idProducto = req.body.idProducto;
        Producto.destroyById(idProducto, function(err) {
            if (err) return res.sendStatus(404)
        });

        Producto.find({include:['categorias']},function(err,objResult_producto){
            if(err) return res.sendStatus(404);
            objResult_producto=objResult_producto.map(function(obj){
                return obj.toJSON();
            });
            res.render('producto',{
                objResult_producto:objResult_producto
            })
        });

        //Categoria.find({}, function(err, objResult_categoria) {
        //    Producto.find({}, function(err, objResult_producto) {
        //        if (err) return res.sendStatus(404);
        //        return res.render('producto', {
        //            objResult_producto: objResult_producto,
        //            objResult_categoria: objResult_categoria
        //        });
        //    });
        //});


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

    /*router.get('/categoria/editar', function(req, res) {
        console.log("esta no");
        res.render('editarcategoria');
    });*/

    router.post('/categoria/editar', function(req, res) {
        //console.log("categoria editar");
        var idCategoria = req.body.idCategoria;
        Categoria.find({
            where: {
                id: idCategoria
            }
        }, function(err, objResult_categoria) {
            //  console.log(objResult_categoria);
            if (err) res.sendStatus(404)
            else res.render('editarcategoria', {
                objResult_categoria: objResult_categoria
            });
        });
    });

    router.post('/editarCategoria', function(req, res) {
        var idCategoria = req.body.categoriaId;
        Categoria.findById(idCategoria, function(err, objResult_categoria) {
            if (err) return res.sendStatus(404);


            console.log("->", objResult_categoria);
            objResult_categoria.nombre = req.body.nuevoNombre;
            objResult_categoria.descripcion = req.body.nuevaDescripcion;
            objResult_categoria.save();
            Categoria.find({}, function(err, objResult) {
                if (err) return res.sendStatus(404);
                else return res.render('categoria', {
                    objResult: objResult
                })
            })

        });
    });

    router.post('/eliminar/categoria', function(req, res) {
        var idCategoria = req.body.idCategoria;
        Categoria.destroyById(idCategoria, function(err) {
            if (err) return res.sendStatus(404);
        })
        Categoria.find({}, function(err, objResult) {
            if (err) return res.sendStatus(404);
            else return res.render('categoria', {
                objResult: objResult
            });
        });
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