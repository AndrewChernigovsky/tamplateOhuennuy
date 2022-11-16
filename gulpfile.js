(() => {
  'use strict';

  const gulpConfig = require('./gulp-config.js');
  const gulp = require('gulp');
  const browserSync = require('browser-sync').create();

  function requireTask(taskName, path, options, dependencies) {
    let settings = options || {};
    const taskFunction = function (callback) {
      if (settings.checkProduction) {
        settings.isProduction = process.argv[process.argv.length - 1] === 'build';
      }

      let task = require(path + taskName + '.js').call(this, settings);

      return task(callback);
    };

    settings.taskName = taskName;

    if (!Array.isArray(dependencies)) {
      gulp.task(taskName, taskFunction);
    } else if (dependencies.length === 1) {
      gulp.task(taskName, gulp.series(dependencies[0], taskFunction));
    } else {
      gulp.task(taskName, gulp.series(dependencies, taskFunction));
    }
  }

  requireTask(`${gulpConfig.task.fileIncludepug}`, `./${gulpConfig.folder.tasks}/`, {
    templates: gulpConfig.fileIncludepug.templates,
    dest: gulpConfig.fileIncludepug.dest,
  });

  requireTask(`${gulpConfig.task.fileIncludepugProd}`, `./${gulpConfig.folder.tasks}/`, {
    templates: gulpConfig.fileIncludepugProd.templates,
    dest: gulpConfig.fileIncludepugProd.dest,
  });

  requireTask(`${gulpConfig.task.esLint}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
  });

  requireTask(`${gulpConfig.task.buildCustomJs}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    dest: gulpConfig.folder.build,
    mainJs: gulpConfig.file.mainJs,
    checkProduction: true,
  });

  requireTask(`${gulpConfig.task.developJS}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    dest: gulpConfig.folder.build,
    developJs: gulpConfig.file.developJs,
    checkProduction: true,
  });

  // BUILDJSVENDO;S

  requireTask(`${gulpConfig.task.buildJsVendors}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    dest: gulpConfig.folder.build,
    vendorJs: gulpConfig.file.vendorJs,
    vendorJsMin: gulpConfig.file.vendorJsMin,
    checkProduction: true,
  });

  // BUILDSASS

  requireTask(`${gulpConfig.task.buildSass}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    dest: gulpConfig.folder.build,
    mainScss: gulpConfig.file.mainScss,
    mainScssMin: gulpConfig.file.mainScssMin,
    checkProduction: true,
  });

  // BUILDCUSTOM

  requireTask(`${gulpConfig.task.buildSassCustom}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    sassFilesInfo: gulpConfig.getPathesForSassCompiling(),
    dest: gulpConfig.folder.build,
  });

  // STYLESVENDOrs

  requireTask(`${gulpConfig.task.buildStylesVendors}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    dest: gulpConfig.folder.build,
    vendorScss: gulpConfig.file.vendorScss,
    vendorScssMin: gulpConfig.file.vendorScssMin,
    checkProduction: true,
  });

    /**
   * Minify images
   */
     requireTask(`${gulpConfig.task.imageMin}`, `./${gulpConfig.folder.tasks}/`, {
        src: gulpConfig.folder.src,
        dest: gulpConfig.folder.build,
      });

  // WEBP

  requireTask(`${gulpConfig.task.imageWebP}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.src,
    dest: gulpConfig.folder.build,
  });

  /**
   * Clean build folder
   */
  requireTask(`${gulpConfig.task.cleanBuild}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.build,
  });
  /**
   * Clean php folder
   */
  requireTask(`${gulpConfig.task.delPHP}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.build,
  });

  /**
   * Clean production folder
   */
  requireTask(`${gulpConfig.task.cleanProd}`, `./${gulpConfig.folder.tasks}/`, {
    src: gulpConfig.folder.prod,
  });

  /**
   * Copy foldersPHP to the build folder
   */
  requireTask(`${gulpConfig.task.copyPHP}`, `./${gulpConfig.folder.tasks}/`, {
    dest: gulpConfig.folder.build,
    src: gulpConfig.getPathesToCopyPHP(),
  });

  /**
   * Copy folders to the build folder
   */
  requireTask(`${gulpConfig.task.copyFolders}`, `./${gulpConfig.folder.tasks}/`, {
    dest: gulpConfig.folder.build,
    foldersToCopy: gulpConfig.getPathesToCopy(),
  });

  /**
   * Copy folders to the production folder
   */
  requireTask(`${gulpConfig.task.copyFoldersProduction}`, `./${gulpConfig.folder.tasks}/`, {
    dest: gulpConfig.folder.prod,
    foldersToCopy: gulpConfig.getPathesToCopyForProduction(),
  });

    //Svg sprite

    requireTask(`${gulpConfig.task.svgSprite}`, `./${gulpConfig.folder.tasks}/`, {
      src: gulpConfig.folder.src,
      dest: gulpConfig.folder.build
    });

  /**
   * Start browserSync server
   */
  requireTask(`${gulpConfig.task.browserSync}`, `./${gulpConfig.folder.tasks}/`, {
    mainHtml: gulpConfig.file.mainHtml,
    browserSync,
  });

  requireTask(
    `${gulpConfig.task.watch}`,
    `./${gulpConfig.folder.tasks}/`,
    {
      src: gulpConfig.folder.src,
      dest: gulpConfig.folder.build,
      imageExtensions: gulpConfig.imageExtensions,
      browserSync,
      tasks: {
        esLint: gulpConfig.task.esLint,
        ttf2woff: gulpConfig.task.ttf2woff,
        ttf2woff2: gulpConfig.task.ttf2woff2,
        buildCustomJs: gulpConfig.task.buildCustomJs,
        buildSass: gulpConfig.task.buildSass,
        buildSassCustom: gulpConfig.task.buildSassCustom,
        fileIncludepug: gulpConfig.task.fileIncludepug,
        copyFolders: gulpConfig.task.copyFolders,
        svgSprite: gulpConfig.task.svgSprite,
        copyPHP: gulpConfig.task.copyPHP,
        imageResize: gulpConfig.task.imageResize,
        developJS: gulpConfig.task.developJS,
      },
    },
    false
  );

  gulp.task(
    'default',
    gulp.series(
        gulpConfig.task.cleanBuild,
        gulpConfig.task.esLint,
        gulp.parallel(
          gulp.series(gulpConfig.task.fileIncludepug),
          gulp.series(gulpConfig.task.buildSass,
            gulpConfig.task.buildSassCustom,
            gulpConfig.task.buildStylesVendors),
          gulp.series(
            gulpConfig.task.buildCustomJs,
            gulpConfig.task.developJS,
            gulpConfig.task.buildJsVendors),
          gulp.parallel(gulpConfig.task.svgSprite, gulpConfig.task.imageWebP)
        ),
        gulpConfig.task.copyFolders,
        gulp.parallel(gulpConfig.task.browserSync, gulpConfig.task.watch),
      )
    );

  gulp.task(
    'build',
    gulp.series(

        gulp.parallel(gulpConfig.task.cleanProd, gulpConfig.task.cleanBuild),
        gulpConfig.task.esLint,
        gulp.parallel(
          gulp.series(gulpConfig.task.fileIncludepug),
          gulp.series(gulpConfig.task.buildSass, gulpConfig.task.buildSassCustom, gulpConfig.task.buildStylesVendors),
          gulp.series(gulpConfig.task.buildCustomJs, gulpConfig.task.buildJsVendors)
        ),
        gulp.series(gulpConfig.task.imageMin, gulpConfig.task.imageWebP),
        gulpConfig.task.svgSprite,
        gulpConfig.task.copyFolders,
        gulpConfig.task.copyFoldersProduction,
        gulp.parallel(gulpConfig.task.browserSync, gulpConfig.task.watch)
      )
    );

  gulp.task(
    'webp',
    gulp.series(
            gulpConfig.task.imageMin,
            gulpConfig.task.imageWebP
        )
    );

  gulp.task(
    'sprite',
    gulp.series(
          gulpConfig.task.svgSprite
        )
    );
  gulp.task(
    'php',
    gulp.series(

          gulpConfig.task.copyPHP
        )
    );
})();
