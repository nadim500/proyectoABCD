var debug = require("debug")("controller");
var _ = require("lodash");

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
    Categoria.create(categoria1, function(err, categoria) {
        if (err) return res.sendStatus(404);
        var producto1 = {
            nombre: 'sillon',
            precio: '50.00',
            cantidad: '5',
            descripcion: 'Sirve para descanzar',
        };
        categoria.productos.create(producto1, function(err, obj) {
            if (err) return res.sendStatus(404);
        })
    });
    ///////////////////////////////////////////
    var categoria2 = {
        nombre: 'juegos',
        descripcion: 'para diversion'
    };
    Categoria.create(categoria2, function(err, categoria) {
        if (err) return res.sendStatus(404);
        var producto2 = {
            nombre: 'dota2',
            precio: '100.00',
            cantidad: '2',
            descripcion: 'Millones lo juegan',
            categoriaId: '2'
        };
        categoria.productos.create(producto2, function(err, obj) {
            if (err) return res.sendStatus(404);
        })
    });
    ///////////////////////////////////////////
    var categoria3 = {
        nombre: 'frutas',
        descripcion: 'alimentos naturales'
    };
    Categoria.create(categoria3, function(err, categoria) {
        if (err) return res.sendStatus(404);
        var producto3 = {
            nombre: 'platano',
            precio: '0.50',
            cantidad: '100',
            descripcion: 'Rica en potasio',
            categoriaId: '3'
        };
        categoria.productos.create(producto3, function(err, obj) {
            if (err) return res.sendStatus(404);
        })
    });
    ///////////////////////////////////////////
    var categoria4 = {
        nombre: 'proteinas',
        descripcion: 'para el desarrollo muscular'
    };
    Categoria.create(categoria4, function(err, categoria) {
        if (err) return res.sendStatus(404);
        var producto4 = {
            nombre: 'Whey Protein',
            precio: '200.00',
            cantidad: '1',
            descripcion: 'gran regeneracion muscular',
            categoriaId: '4'
        };
        categoria.productos.create(producto4, function(err, obj) {
            if (err) return res.sendStatus(404);
        })
    });

    ///////////PRODUCTOS///////////////////////


    ///////////////////////////////////////////
    //var producto2 = {
    //var producto2 = {
    //  nombre: 'dota2',
    //  precio: '100.00',
    //  cantidad: '2',
    //  descripcion: 'Millones lo juegan',
    //  categoriaId: '2'
    //};
    //Producto.create(producto2, function(err, obj) {
    //  if (err) return res.sendStatus(404);
    //  console.log(obj);
    //});
    /////////////////////////////////////////////
    //var producto3 = {
    //  nombre: 'platano',
    //  precio: '0.50',
    //  cantidad: '100',
    //  descripcion: 'Rica en potasio',
    //  categoriaId: '3'
    //};
    //Producto.create(producto3, function(err, obj) {
    //  if (err) return res.sendStatus(404);
    //  console.log(obj);
    //});
    /////////////////////////////////////////////
    //var producto4 = {
    //  nombre: 'Whey Protein',
    //  precio: '200.00',
    //  cantidad: '1',
    //  descripcion: 'gran regeneracion muscular',
    //  categoriaId: '4'
    //};
    //Producto.create(producto4, function(err, obj) {
    //  if (err) return res.sendStatus(404);
    //  console.log(obj);
    //});

    //--------------------------------------------------------------------//
    //--------------------------------------------------------------------//

    router.post('/prueba', function(req, res) {

        /*Producto.create(function(err,producto){
        
        var categoria = Producto.Categoria.build({
          nombre: req.body.nombre,
          descripcion:req.body.descripcion
        })
        console.log("---->",categoria);

      })*/

        var categoria = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        }
        var producto = {
                nombre: 'prueba',
                precio: '50.00',
                cantidad: '5',
                descripcion: 'sirve para descanzar'
            }
            /*Producto.create(producto, function(err, product) {
            console.log(product);
            Categoria.create(categoria, function(err, categ) {
                console.log(categ);
                product.Categoria.add(categ, function(err, obj) {
                    console.log(obj);
                })
            });
        })*/
        Categoria.productos.create(producto, function() {
            console.log("exito");
        })

        var nuevoProducto = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            descripcion: req.body.descripcion,
        }

        var categoriaId = req.body.categoriaId;

        Categoria.findById(categoriaId, function(err, cat) {
            // err
            cat.productos.create(nuevoProducto, function(err, newProducto) {
                // er
                console.log("DONE");
                return res.sendStatus(400);
            });
        });




    })




    //--------------------------------------------------------------------//
    //--------------------------------------------------------------------//

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

                else if (objResult_categoria.length == 0) {
                    var mostrarTitulo = "Creacion de Producto";
                    var mostrarMensaje = "No existe ninguna categoria, tal vez quiera crear una para poder crear un producto";
                    var modo = false;
                    Producto.find({
                        include: ['categorias']
                    }, function(err, objResult_producto) {
                        if (err) return res.sendStatus(404);
                        objResult_producto = objResult_producto.map(function(obj) {
                            return obj.toJSON();
                        });
                        return res.render('producto', {
                            objResult_producto: objResult_producto,
                            mostrarTitulo: mostrarTitulo,
                            mostrarMensaje: mostrarMensaje,
                            modo: modo
                        });
                    });
                } else {

                    return res.render('crearproducto', {
                        objResult_categoria: objResult_categoria
                    });
                }

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
        var modo;
        console.log("*********", idProducto);
        Producto.findById(idProducto, function(err, objResult) {
            if (err) return res.sendStatus(404);
            var exNombre = objResult.nombre;
            modo = true;
            var mostrarTitulo = "Edicion de Producto"
            var mostrarMensaje = "El producto " + exNombre + " con id " + idProducto + " fue editado exitosamente";
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
                    objResult_producto: objResult_producto,
                    mostrarTitulo: mostrarTitulo,
                    mostrarMensaje: mostrarMensaje,
                    modo: modo
                });
            });
        });
    });
    //Categoria.find({}, function(err, objResult_categoria) {
    //    Producto.find({}, function(err, objResult_producto) {
    //        if (err) return res.sendStatus(404);
    //        return res.render('producto', {
    //            objResult_producto: objResult_producto,
    //            objResult_categoria: objResult_categoria
    //        })
    //    })
    //})

    router.get('/producto', function(req, res) {
        if (sesion) {
            var idCategoria = req.query.idCategoria;
            console.log(idCategoria);
            if (idCategoria != undefined) {

                Categoria.find({
                    where: {
                        id: idCategoria
                    }
                }, function(err, categoria) {
                    console.log("---->categoria:", categoria);
                    categoria = categoria[0];
                    categoria.productos({}, function(err, objResult_producto) {
                        if (err) return res.sendStatus(404);
                        objResult_producto = objResult_producto.map(function(obj) {
                            return obj.toJSON();
                        });
                        res.render('filtrarcategoria_producto', {
                            objResult_producto: objResult_producto,
                            categoria: categoria
                        })
                    });
                });

                //Producto.find({
                //    where: {
                //        categoriaId: idCategoria
                //    },
                //    include: ['categorias']
                //}, function(err, objResult_producto) {
                //    if (err) return res.sendStatus(404);
                //    objResult_producto = objResult_producto.map(function(obj) {
                //        return obj.toJSON();
                //    })
                //    res.render('producto', {
                //        objResult_producto: objResult_producto
                //    })
                //})

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

            } else {

                Producto.find({}, function(err, objResult_producto) {
                    if (err) return res.sendStatus(404);
                    return res.render('producto', {
                        objResult_producto: objResult_producto
                    });
                });

                //Producto.find({
                //    include: ['categorias']
                //}, function(err, objResult_producto) {
                //    if (err) return res.sendStatus(404);
                //    objResult_producto = objResult_producto.map(function(obj) {
                //        return obj.toJSON();
                //    });
                //    return res.render('producto', {
                //        objResult_producto: objResult_producto

                //Categoria.find({}, function(err, objResult_categoria) {
                //    Producto.find({}, function(err, objResult_producto) {
                //        if (err) res.sendStatus(404);
                //        else res.render('producto', {
                //            objResult_producto: objResult_producto,
                //            objResult_categoria: objResult_categoria
                //        });
                //    });

                //    });
                //});
            }
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

        var modo;
        var categoriaId = req.body.categoriaId;

        var nuevoProducto = {
                nombre: req.body.nombre,
                precio: req.body.precio,
                cantidad: req.body.cantidad,
                descripcion: req.body.descripcion,
            }
            //console.log(nuevoProducto);
        console.log("--->", nuevoProducto.nombre);

        Producto.find({
            where: {
                nombre: nuevoProducto.nombre
            }
        }, function(err, objExiste) {
            console.log("wtffff!", objExiste);
            if (err) return res.sendStatus(404);
            else if (objExiste.length != 0) {
                modo = false;
                var mostrarTitulo = "Creacion de Producto";
                var mostrarMensaje = "El producto ya existe";
                Producto.find({}, function(err, objResult_producto) {
                    if (err) return res.sendStatus(404);
                    return res.render('producto', {
                        objResult_producto: objResult_producto,
                        mostrarTitulo: mostrarTitulo,
                        mostrarMensaje: mostrarMensaje,
                        modo: modo
                    });
                });
            } else {
                modo = true;
                var mostrarTitulo = "Creacion de Producto";
                var mostrarMensaje = "El producto " + nuevoProducto.nombre + " se creo exitosamente";

                if (categoriaId == "none") {

                    Producto.create(nuevoProducto, function(err, obj) {
                        Producto.find({}, function(err, objResult_producto) {
                            if (err) return res.sendStatus(404);
                            return res.render('producto', {
                                objResult_producto: objResult_producto,
                                mostrarTitulo: mostrarTitulo,
                                mostrarMensaje: mostrarMensaje,
                                modo: modo
                            });
                        });
                    });
                } else {

                    Categoria.findById(categoriaId, function(err, categoria) {
                        categoria.productos.create(nuevoProducto, function(err, obj) {
                            Producto.find({}, function(err, objResult_producto) {
                                if (err) return res.sendStatus(404);
                                return res.render('producto', {
                                    objResult_producto: objResult_producto,
                                    mostrarTitulo: mostrarTitulo,
                                    mostrarMensaje: mostrarMensaje,
                                    modo: modo
                                });
                            });
                        });
                    });
                }


            }
        });
    });


    /*var modo;
      var nuevoProducto = {
              nombre: req.body.nombre,
              precio: req.body.precio,
              cantidad: req.body.cantidad,
              descripcion: req.body.descripcion,
              categoriaId: req.body.categoriaId
          }
          //console.log(nuevoProducto);
      console.log("--->", nuevoProducto.nombre);
      Producto.find({
          where: {
              nombre: nuevoProducto.nombre
          }
      }, function(err, objExiste) {
          console.log("wtffff!", objExiste);
          if (err) return res.sendStatus(404);
          else if (objExiste.length != 0) {
              modo = false;
              var mostrarTitulo = "Creacion de Producto";
              var mostrarMensaje = "El producto ya existe";
              Producto.find({}, function(err, objResult_producto) {
                  if (err) return res.sendStatus(404);
                  return res.render('producto', {
                      objResult_producto: objResult_producto,
                      mostrarTitulo: mostrarTitulo,
                      mostrarMensaje: mostrarMensaje,
                      modo: modo
                  });
              });
          } else {
              modo = true;
              var mostrarTitulo = "Creacion de Producto";
              var mostrarMensaje = "El producto " + nuevoProducto.nombre + " se creo exitosamente";
              Producto.create(nuevoProducto, function(err, obj) {
                  Producto.find({}, function(err, objResult_producto) {
                      if (err) return res.sendStatus(404);
                      return res.render('producto', {
                          objResult_producto: objResult_producto,
                          mostrarTitulo: mostrarTitulo,
                          mostrarMensaje: mostrarMensaje,
                          modo: modo
                      });
                  });
              });
          }
      });*/






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

            if (err) {
                return res.sendStatus(500);
            } else {
                return res.sendStatus(200);
            }
        });
    });

    router.post('/producto/eliminar', function(req, res) {
        var idProducto = req.body.id;
        var modo;
        Producto.destroyById(idProducto, function(err) {
            if (err) return res.sendStatus(404);
            modo = true;
            var mostrarTitulo = "Producto eliminado";
            var mostrarMensaje = "El producto con id " + idProducto + " fue eliminado exitosamente";
            Producto.find({
                include: ['categorias']
            }, function(err, objResult_producto) {
                if (err) return res.sendStatus(404);
                objResult_producto = objResult_producto.map(function(obj) {
                    return obj.toJSON();
                });
                return res.render('producto', {
                    objResult_producto: objResult_producto,
                    mostrarTitulo: mostrarTitulo,
                    mostrarMensaje: mostrarMensaje,
                    modo: modo
                });
            });
        });

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

            var idProducto = req.query.idProducto;

            if (idProducto != undefined) {

                Producto.find({
                    where: {
                        id: idProducto
                    }
                }, function(err, producto) {
                    if (err) return res.sendStatus(404);
                    producto = producto[0];
                    producto.categorias({}, function(err, objResult) {
                        if (err) return res.sendStatus(404);
                        return res.render('filtrarproducto_categoria', {
                            producto: producto,
                            objResult: objResult
                        });
                    });
                });

            } else {

                Categoria.find({}, function(err, objResult) {
                    if (err) return res.sendStatus(404);
                    return res.render('categoria', {
                        objResult: objResult
                    });
                });
            }


        } else return res.redirect('login')
    });

    router.post('/categoria', function(req, res) {

        var arrayId = req.body.arrayId;
        arrayId = JSON.parse(arrayId);
        console.log(arrayId);

        //var productoId = req.body.productoId;
        var modo;
        var nuevaCategoria = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        }

        Categoria.find({
            where: {
                nombre: nuevaCategoria.nombre
            }
        }, function(err, objExiste) {
            if (err) return res.sendStatus(404);
            else if (objExiste.length != 0) {
                var mostrarTitulo = "Creacion de Categoria";
                var mostrarMensaje = "La categoria ya existe";
                modo = false;
                Categoria.find({}, function(err, objResult) {
                    if (err) return res.sendStatus(404);
                    return res.render('categoria', {
                        objResult: objResult,
                        mostrarTitulo: mostrarTitulo,
                        mostrarMensaje: mostrarMensaje,
                        modo: modo
                    });
                });
            } else {
                var mostrarTitulo = "Creacion de Categoria";
                var mostrarMensaje = "La categoria " + nuevaCategoria.nombre + " fue creada exitosamente";
                modo = true;

                var rep = arrayId.length;

                if (rep == 0) {
                    Categoria.create(nuevaCategoria, function(err, obj) {
                        Categoria.find({}, function(err, objResult) {
                            if (err) return res.sendStatus(404);
                            return res.render('categoria', {
                                objResult: objResult,
                                mostrarTitulo: mostrarTitulo,
                                mostrarMensaje: mostrarMensaje,
                                modo: modo
                            });
                        });
                    });
                } else {

                    var a = 0;

                    Categoria.create(nuevaCategoria, function(err, categoria) {
                        if (err) return res.sendStatus(404);
                        _.times(rep, function() {
                            
                            var idProducto = _.toInteger(arrayId[a]);
                            Producto.findById(idProducto, function(err, producto) {
                                if (err) return res.sendStatus(404);
                                producto.categorias.add(categoria, function(err, obj) {
                                    if(err) return res.sendStatus(404);
                                });
                            });
                            a++;
                        });
                        Categoria.find({}, function(err, objResult) {
                            if (err) return res.sendStatus(404);
                            return res.render('categoria', {
                                objResult: objResult,
                                mostrarTitulo: mostrarTitulo,
                                mostrarMensaje: mostrarMensaje,
                                modo: modo
                            });
                        });
                    });

                    /*Producto.findById(productoId, function(err, producto) {
                        if (err) return res.sendStatus(404);
                        producto.categorias.create(nuevaCategoria, function(err, obj) {
                            Categoria.find({}, function(err, objResult) {
                                if (err) return res.sendStatus(404);
                                return res.render('categoria', {
                                    objResult: objResult,
                                    mostrarTitulo: mostrarTitulo,
                                    mostrarMensaje: mostrarMensaje,
                                    modo: modo
                                });
                            });
                        });
                    });*/
                }
            }
        });
    });

    /*debug('req.body', req.body);
      var modo;
      var nuevaCategoria = {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion
      }

      Categoria.find({
          where: {
              nombre: nuevaCategoria.nombre
          }
      }, function(err, objExiste) {
          if (err) return res.sendStatus(404);
          else if (objExiste.length != 0) {
              var mostrarTitulo = "Creacion de Categoria";
              var mostrarMensaje = "La categoria ya existe";
              modo = false;
              Categoria.find({}, function(err, objResult) {
                  if (err) return res.sendStatus(404);
                  return res.render('categoria', {
                      objResult: objResult,
                      mostrarTitulo: mostrarTitulo,
                      mostrarMensaje: mostrarMensaje,
                      modo: modo
                  });
              });
          } else {
              var mostrarTitulo = "Creacion de Categoria";
              var mostrarMensaje = "La categoria " + nuevaCategoria.nombre + " fue creada exitosamente";
              modo = true;
              Categoria.create(nuevaCategoria, function(err, obj) {
                  Categoria.find({}, function(err, objResult) {
                      if (err) return res.sendStatus(404);
                      return res.render('categoria', {
                          objResult: objResult,
                          mostrarTitulo: mostrarTitulo,
                          mostrarMensaje: mostrarMensaje,
                          modo: modo
                      });
                  });
              });
          }
      });*/
    //-------------------------------------------------------------------------------------//
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


    router.get('/categoria/crear', function(req, res) {

        if (sesion) {
            Producto.find({}, function(err, objResult_producto) {
                return res.render('crearcategoria', {
                    objResult_producto: objResult_producto
                });
            })
        } else
            return res.redirect('login');
    });

    router.post('/categoria/eliminar', function(req, res) {
        var idCategoria = req.body.id;
        var modo;

        console.log('-->idCategoria', idCategoria);

        if (!idCategoria) {
            return res.redirect('categoria');
        }

        Producto.destroyAll({
            categoriaId: idCategoria
        }, function(err, info) {
            console.log("err:", err);
            console.log("info:", info);

            if (err) return res.sendStatus(404);
            // console.log("se elimino", info);

            Categoria.destroyById(idCategoria, function(err) {
                modo = true;
                var mostrarTitulo = "Categoria eliminada";
                var mostrarMensaje = "La categoria con id " + idCategoria + " fue eliminado exitosamente";
                Categoria.find({}, function(err, objResult) {
                    if (err) return res.sendStatus(404);
                    else return res.render('categoria', {
                        objResult: objResult,
                        mostrarTitulo: mostrarTitulo,
                        mostrarMensaje: mostrarMensaje,
                        modo: modo
                    });
                });

                /*if (err){
            return res.json({
                existe:false,
                id:null
            })
        }else{
            return res.json({
                existe:true,
                id:idCategoria
            })
        }*/
                /*Categoria.find({}, function(err, objResult) {
            if (err) return res.sendStatus(404);
            else return res.render('categoria', {
                objResult: objResult,
                message: message
            });
        });*/
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
    /*    router.post('/eliminar/categoria', function(req, res) {
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
        var modo;
        Categoria.findById(idCategoria, function(err, objResult_categoria) {
            if (err) return res.sendStatus(404);
            console.log("->", objResult_categoria);
            var mostrarTitulo = "Edicion de Categoria";
            var mostrarMensaje = "La categoria " + objResult_categoria.nombre + " con id " + idCategoria + " fue editado exitosamente";
            modo = true;
            objResult_categoria.nombre = req.body.nuevoNombre;
            objResult_categoria.descripcion = req.body.nuevaDescripcion;
            objResult_categoria.save();
            Categoria.find({}, function(err, objResult) {
                if (err) return res.sendStatus(404);
                else return res.render('categoria', {
                    objResult: objResult,
                    mostrarMensaje: mostrarMensaje,
                    mostrarTitulo: mostrarTitulo,
                    modo: modo
                })
            });

        });
    });


    app.use(router);
}