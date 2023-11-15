var express = require('express');
var router = express.Router();
var projectsModel = require('../../models/Models');
var util = require('util');
var cloudinary = require('cloudinary').v2;

const fs = require('fs');

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {
  var projects = await projectsModel.getProjects();

  projects = projects.map(project =>{
    if (project.img_id){
       const imagen = cloudinary.image(project.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...project,
        imagen : cloudinary.image(project.img_id)
      }
    }
    else {
      return{
        ...project,
        imagen: ''
      }
    }
  })

  res.render('admin/projects', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    projects
  });
});
router.get('/agregar', (req, res, next) =>{
  res.render('admin/agregar', {
    layout: 'admin/layout'
  });
});

router.post('/agregar', async (req, res, next) =>{
  try{
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }
    if(req.body.usuario != '' && req.body.puntuacion != '' && req.body.project != ''){
      await projectsModel.insertProjects({
      ...req.body,
      img_id
    });
    res.redirect('/projects')
    }
    else{
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true, message: 'Todos los campos son requeridos'
      });
    }
  }
  catch(error){
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true, message: 'No se cargo el project'
  })
  }
});

router.get('/eliminar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const project = await projectsModel.getProjectsById(id);

    if (project && project.img_id) {
      await destroy(project.img_id);
    }

    await projectsModel.deleteProjectsById(id);
    res.redirect('/projects');
  } catch (error) {
    console.log(error);
    res.redirect('/projects');
  }
});


router.get('/modificar/:id', async (req, res, next) =>{
  let id = req.params.id;
  let projects = await projectsModel.getProjectsById(id);
  res.render('admin/modificar', {
    layout:'admin/layout',
    projects
  });
});

router.post('/modificar', async (req, res) => {
  try {
    // Extraer los campos del formulario.
    const { id, titulo, enlace, cuerpo, img_delete } = req.body;
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;

    // Verificar si se seleccionó eliminar la imagen actual.
    if (img_delete === '1') {
      img_id = null;
      borrar_img_vieja = true;
    }

    // Verificar si se ha subido una nueva imagen y procesarla con Cloudinary.
    if (req.files && req.files.img) {
      const imagen = req.files.img;
      const result = await uploader(imagen.tempFilePath);
      img_id = result.public_id;
      borrar_img_vieja = true;
    }

    // Si se debe borrar la imagen anterior, hacerlo.
    if (borrar_img_vieja && req.body.img_original) {
      await destroy(req.body.img_original);
    }

    // Crear un objeto con los campos actualizados.
    const updatedProject = {
      titulo,
      enlace,
      cuerpo,
      img_id,
    };

    // Llamar a la función para actualizar el proyecto.
    await projectsModel.modificarProjectsById(updatedProject, id);

    // Redireccionar a la página de proyectos después de la modificación.
    res.redirect('/projects');
  } catch (error) {
    console.error(error);
    // Renderizar la página de modificación con un mensaje de error.
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se pudo modificar el proyecto',
    });
  }
});


module.exports = router;
