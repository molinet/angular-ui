const fs = require('fs');
const gulp = require('gulp');
const replace = require('gulp-replace');

gulp.task('set-version', () => {
  const versionArg = process.argv.find(arg => arg.startsWith('--version='));
  const packageArg = process.argv.find(arg => arg.startsWith('--package='));

  if (!versionArg) {
    console.error('No version code provided');
    process.exit(1);
  }

  if (!packageArg) {
    console.error('No package name provided');
    process.exit(1);
  }

  const version = versionArg.split('=')[1];
  const packageName = packageArg.split('=')[1];
  const packageDir = `./projects/${packageName}`;
  const packageFile = `${packageDir}/package.json`;

  const packageJson = JSON.parse(
    fs.readFileSync(packageFile, 'utf8'),
  );

  return gulp.src(packageFile)
    .pipe(
      replace(
        `"version": "${packageJson.version}"`,
        `"version": "${version}"`,
      ),
    )
    .pipe(
      gulp.dest(packageDir),
    );
});
