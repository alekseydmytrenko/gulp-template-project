var gulp       = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	//browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	//imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	//pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('sass/style.scss') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min (для того, что бы в продакшене и в разработке файлы назывались одинаково, минифицированный файл создаеться на этапе билда, что бы не занимать много времени во время разработки)
		.pipe(gulp.dest('css')) // Выгружаем результата в папку app/css
		//.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//gulp.task('browser-sync', function() { // Создаем таск browser-sync
//	browserSync({ // Выполняем browserSync
//		server: { // Определяем параметры сервера
//			baseDir: '' // Директория для сервера - app
//		},
//		notify: false // Отключаем уведомления
//	});
//});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
        'js/vendor/bootstrap.js', // Берем bootstrap
		'js/main.js', // Берем main js
		'js/plugins.js' // Берем Plugin js
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('js')); // Выгружаем в папку app/js
});



gulp.task('watch', ['sass', 'scripts'], function() {
	gulp.watch('sass/style.scss', ['sass']); // Наблюдение за sass файлами в папке sass
	//gulp.watch('*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('js/**/*.js', ['scripts']);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('production'); // Удаляем папку production перед сборкой
});

//gulp.task('img', function() {
//	return gulp.src('app/img/**/*') // Берем все изображения из app
//		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
//			interlaced: true,
//			progressive: true,
//			svgoPlugins: [{removeViewBox: false}],
//			use: [pngquant()]
//		})))
//		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
//});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('css/style.min.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        //.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('css/min')); // Выгружаем в папку css/min что бы из нее уже перенести в продакшен просто в папку css/
});

gulp.task('build', ['clean', 'sass', 'css-libs', 'scripts'], function() {

    gulp.watch('css/style.min.css', ['css-libs']); // выбираем файл для минификации и запускаем его сжатие

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'css/min/style.min.css'
		])
	.pipe(gulp.dest('production/css'))

	var buildFonts = gulp.src('fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('production/fonts'))

	var buildJs = gulp.src('js/libs.min.js') // Переносим скрипты в продакшен
	.pipe(gulp.dest('production/js'))

	var buildHtml = gulp.src('*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('production'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
