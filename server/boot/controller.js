var debug = require("debug")("controller");

module.exports = function(app) {
    var router = app.loopback.Router();

    var Categoria = app.models.Categoria;
    var Producto = app.models.Producto;
    var Usuario = app.models.Usuario;
    var sesion = false;

    router.get('/nuevoUsuario', function(req, res) {
        console.log("********");
        return res.render('nuevoUsuario');
    });

    router.post('/nuevoUsuario', function(req, res) {
        var nuevoUsuario = {
            nombre: req.body.nombre,
            username: req.body.usuario,
            password: req.body.password
        }
        console.log("---->", nuevoUsuario);

        password = req.body.password;
        password1 = req.body.password1;
        if (password == password1) {
            Usuario.create(nuevoUsuario, function(err, objResult) {
                if (err) return res.sendStatus(404);
                return res.render('nuevoUsuario', {
                    message: "usuario creado con exito"
                })
            });
        } else {

            console.log("____-------_____-");
            res.render('nuevoUsuario', {
                message: "las contraseñas no concuerdan"
            });
        }
    });



    router.post('/auth/login', function(req, res) {
        //var root = {
        //    usuario: 'root',
        //    password: 'root'
        //};
        //var persona = {
        //    usuario: req.body.form_usuario,
        //    password: req.body.form_password
        //};
        //if ((root.usuario == persona.usuario) && (root.password == persona.password)) {
        //    res.render('principal');
        //}
        var user = req.body.form_usuario;
        var contr = req.body.form_password;
        Usuario.find({
            where: {
                username: user,
                password: contr
            }
        }, function(err, objResult_usuario) {
            console.log(objResult_usuario);
            if (err) res.sendStatus(404);
            if (objResult_usuario.length == 0) return res.render('login', {
                message: "usuario no registrado"
            })
            if (objResult_usuario.length > 0) {
                sesion = true;
                return res.render('principal')
            }
        })

    });

    router.get('/', function(req, res) {
        res.redirect('login');
    });

    router.get('/principal', function(req, res) {
        if (sesion) return res.render('principal');
        else return res.redirect('login');
    });

    router.get('/login', function(req, res) {
        res.render('login');
    });


    router.get('/producto/crear', function(req, res) {
        if (sesion) {
            Categoria.find({}, function(err, objResult_categoria) {
                if (err) return res.sendStatus(404)
                return res.render('crearproducto', {
                    objResult_categoria: objResult_categoria
                });
            });
        } else return res.redirect('login');
    });

    router.get('/producto/editar', function(req, res) {

        if (sesion) return res.render('editarproducto');
        else return res.redirect('login');
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

    router.get('/producto', function(req, res) {
        if (sesion) {
            var idCategoria = req.query.idCategoria;
            console.log(idCategoria);
            if (idCategoria != undefined) {

                Producto.find({
                    where: {
                        categoriaId: idCategoria
                    },
                    include: ['categorias']
                }, function(err, objResult_producto) {
                    if (err) return res.sendStatus(404);
                    objResult_producto = objResult_producto.map(function(obj) {
                        return obj.toJSON();
                    })
                    res.render('producto', {
                        objResult_producto: objResult_producto
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

            } else Producto.find({
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
                    //        if (err) res.sendStatus(404);
                    //        else res.render('producto', {
                    //            objResult_producto: objResult_producto,
                    //            objResult_categoria: objResult_categoria
                    //        });
                    //    });

                });
            });
        } else
            return res.redirect('login');
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

        Producto.find({
            include: ['categorias']
        }, function(err, objResult_producto) {
            if (err) return res.sendStatus(404);
            objResult_producto = objResult_producto.map(function(obj) {
                return obj.toJSON();
            });
            res.render('producto', {
                objResult_producto: objResult_producto
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
        if (sesion) {
            Categoria.find({}, function(err, objResult) {
                if (err) return res.sendStatus(404);
                return res.render('categoria', {
                    objResult: objResult
                });
            });
        } else return res.redirect('login')
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

        if (sesion) {
            return res.render('crearcategoria');
        } else
            return res.redirect('login');
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

    app.use(router);
}