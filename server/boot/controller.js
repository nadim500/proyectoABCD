var debug = require("debug")("controller");

module.exports = function(app) {
    var router = app.loopback.Router();

    var Categoria = app.models.Categoria;
    var Producto = app.models.Producto;
    var Usuario = app.models.Usuario;
    var sesion = false;

    // TODO: validar sesion con middleware
    // app.use(function(req, res, next) {
    //     if(!sesion) return res.sendStatus(500);

    //     console.log("->", req.url.indexOf("/login"));
    //     next();
    // });

    /////////////////USUARIO////////////////

    var usuario_por_defecto = {
        email: 'root@root.com',
        username: 'root',
        password: 'root'
    };
    Usuario.create(usuario_por_defecto, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });

    /////////////////CATEGORIAS/////////////

    var categoria1 = {
        nombre: 'mueble',
        descripcion: 'cosas para el hogar'
    };
    Categoria.create(categoria1, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });
    ///////////////////////////////////////////
    var categoria2 = {
        nombre: 'juegos',
        descripcion: 'para diversion'
    };
    Categoria.create(categoria2, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });
    ///////////////////////////////////////////
    var categoria3 = {
        nombre: 'frutas',
        descripcion: 'alimentos naturales'
    };
    Categoria.create(categoria3, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });
    ///////////////////////////////////////////
    var categoria4 = {
        nombre: 'proteinas',
        descripcion: 'para el desarrollo muscular'
    };
    Categoria.create(categoria4, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });

    ///////////PRODUCTOS///////////////////////

    var producto1 = {
        nombre: 'sillon',
        precio: '50.00',
        cantidad: '5',
        descripcion: 'sirve para descanzar',
        categoriaId: '1'
    };
    Producto.create(producto1, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });
    ///////////////////////////////////////////
    var producto2 = {
        nombre: 'dota2',
        precio: '100.00',
        cantidad: '2',
        descripcion: 'Millones lo juegan',
        categoriaId: '2'
    };
    Producto.create(producto2, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });
    ///////////////////////////////////////////
    var producto3 = {
        nombre: 'platano',
        precio: '0.50',
        cantidad: '100',
        descripcion: 'Rica en potasio',
        categoriaId: '3'
    };
    Producto.create(producto3, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });
    ///////////////////////////////////////////
    var producto4 = {
        nombre: 'Whey Protein',
        precio: '200.00',
        cantidad: '1',
        descripcion: 'gran regeneracion muscular',
        categoriaId: '4'
    };
    Producto.create(producto4, function(err, obj) {
        if (err) return res.sendStatus(404);
        console.log(obj);
    });

    router.get('/homepage', function(req, res) {
        res.render('homepage');
    });

    router.get('/nuevoUsuario', function(req, res) {
        console.log("********");
        return res.render('nuevoUsuario');
    });

    router.post('/nuevoUsuario', function(req, res) {
        var nuevoUsuario = {
            email: req.body.nombre,
            username: req.body.usuario,
            password: req.body.password
        }
        console.log("---->", nuevoUsuario);

        password = req.body.password;
        password1 = req.body.password1;
        if (password == password1) {
            Usuario.create(nuevoUsuario, function(err, objResult) {
                if (err) return res.sendStatus(404);
                return res.render('login')
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
        console.log("****", user);
        console.log("****", contr);
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
        return res.render('login');
    });

    router.get('/salir', function(req, res) {
        sesion = false;
        res.redirect('login');
    })

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
        var idProducto = req.query.id;

        Categoria.find({}, function(err, objResult_categoria) {
            Producto.find({
                where: {
                    id: idProducto
                }
            }, function(err, objResult_producto) {
                console.log("________-----_____", objResult_producto);
                if (err) return res.sendStatus(404);
                return res.render('editarproducto', {
                    objResult_producto: objResult_producto,
                    objResult_categoria: objResult_categoria
                });
            });
        });

        // if (sesion) return res.render('editarproducto');
        // else return res.redirect('login');
    });

    //--------------Comentando la funcion del boton editar en producto.jade

    /*router.post('/producto/editar', function(req, res) {
        var idProducto = req.body.idProducto;
        console.log("--->",idProducto);

        Categoria.find({}, function(err, objResult_categoria) {
            Producto.find({
                where: {
                    id: idProducto
                }
            }, function(err, objResult_producto) {
                console.log("________-----_____",objResult_producto)
                if (err) return res.sendStatus(404);
                return res.render('editarproducto', {
                    objResult_producto: objResult_producto,
                    objResult_categoria: objResult_categoria
                });
            });
        });

    });*/

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

        Producto.create(nuevoProducto, function(err, obj) {
            Producto.find({}, function(err, objResult_producto) {
                if (err) return res.sendStatus(404);
                return res.render('producto', {
                    objResult_producto: objResult_producto
                });
            });
        });

        /*Categoria.find({}, function(err, objResult_categoria) {
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
        });*/
    });

    router.get('/producto/eliminar', function(req, res) {
        var idProducto = req.query.id;
        console.log(idProducto);
        Producto.destroyById(idProducto, function(err) {
            // if (err) {
            //  return res.json({
            //     success: false, 
            //     id: null
            //  })
            // }
            // return res.json({
            //     success: true,
            //     id: idProducto
            // });

            if(err) {
                return res.sendStatus(500);
            } else {
                return res.sendStatus(200);
            }
        });

    /*            
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
            */

    });

    //----------Quitando funcion del boton eliminar en editarproducto

    /*router.post('/producto/eliminar', function(req, res) {
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
    });*/


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
            Categoria.find({}, function(err, objResult) {
                if (err) return res.sendStatus(404);
                return res.render('categoria', {
                    objResult: objResult
                });
            });
        });
        /*Categoria.create(nuevaCategoria, function(err, obj) {
            if (err) {
                debug("err", err);
                res.render('crearcategoria', {
                    message: "error producido"
                });
            }
            res.render('crearcategoria', {
                message: "objeto guardado con exito"
            });
        });*/
    });

    router.get('/categoria/crear', function(req, res) {

        if (sesion) {
            return res.render('crearcategoria');
        } else
            return res.redirect('login');
    });

    router.get('/categoria/eliminar', function(req, res) {
        var idCategoria = req.query.id;

        Producto.destroyAll({
            categoriaId: idCategoria
        }, function(err, info) {
            console.log("err:", err);
            console.log("info:", info);

            if (err) return res.sendStatus(404);
            // console.log("se elimino", info);

            Categoria.destroyById(idCategoria, function(err) {
                if (err) return res.sendStatus(404);

                Categoria.find({}, function(err, objResult) {
                    if (err) return res.sendStatus(404);
                    else return res.render('categoria', {
                        objResult: objResult
                    });
                });
            });
        });


        // Producto.find({},function(err,obj){
        //     for each (var producto in obj){
        //         if(producto.categoriaId==idCategoria){
        //             var idProducto = producto.id;
        //             Producto.destroyById(idProducto,function(err){
        //                 if(err) return res.sendStatus(404);
        //             });
        //         }
        //     }
        //     Producto.find({},function(err,obj){
        //         console.log(obj);
        //     })
        // });


    });

    //------Quitando la funcion del bton eliminar de editarcategoria
    /*router.post('/eliminar/categoria', function(req, res) {
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
    });*/

    router.get('/categoria/editar', function(req, res) {

        var idCategoria = req.query.id;
        Categoria.find({
            where: {
                id: idCategoria
            }
        }, function(err, objResult_categoria) {
            if (err) return res.sendStatus(404);
            return res.render('editarcategoria', {
                objResult_categoria: objResult_categoria
            });
        });

    });

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


    app.use(router);
}