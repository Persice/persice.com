install:
	npm install

build:
	/node_modules/.bin/tsc -m commonjs -t es5 --experimentalDecorators --emitDecoratorMetadata src/public/app.ts

watch:
	/node_modules/.bin/tsc --watch -m commonjs -t es5 --experimentalDecorators --emitDecoratorMetadata src/public/app.ts

serve:
	./node_modules/http-server/bin/http-server src/public -p 8080 -a localhost