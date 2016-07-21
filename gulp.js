var gulp = require('gulp');
var express = require('express');
var browserSync = require('browser-sync'); // 브라우저싱크 모듈
var gutil = require('gulp-util'); // gulp 에서 사용할 수 있는 유틸리티 모듈

var server;

gulp.task('server', function () {
    // 먼저 빌드된 디렉토리를 서빙할 용도로
    // 8000번 포트로 express 를 구동시킨다.
    server = express();
    server.use(express.static('dist'));
    server.listen(8000);
    // browserSync 모듈이 8000번 포트에 프록시를 추가하도록 한다.
    // 이렇게 하면 HTML을 응답할 때, 새로고침을 위한 코드 스니핏을 추가한다.
    browserSync({
        proxy: 'localhost:8000'
    });
});

// 브라우저를 새로고침할 때는 `browserSync.reload()` 메서드를 호출하면 된다.
// 브라우저 새로고침은 개발 중에 서버가 올라와있을 때에만 동작하면 되고,
// 여기에 더해, 다른 태스크의 스트림에 연결해서 동작할 수 있게 하면 훨씬 편리할 것이다.
function reload() {
    if (server) {
        return browserSync.reload({
            stream: true
        });
    }
    return gutil.noop(); // 아무 것도 하지 않는 스트림을 리턴한다.
}

// 이제 `reload()` 함수를 리소스가 변경되었을 때 새로고침하길 원하는 태스크에 추가하면 된다.
// 아래 코드처럼 스트림의 마지막에 파이프로 추가해주면 된다.
gulp.task('less', function () {
    return gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(reload());
});

// 개발 중에 리소스가 새로고침 되길 원한다면 `watch`로 등록해두면 된다.
gulp.task('watch', function () {
    return gulp.watch('less/*.less', ['less']);
});