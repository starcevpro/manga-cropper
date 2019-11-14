
    const fs = require('fs')
    const its = require('image-to-slices')
    const mergeImg = require('merge-img');
    const ora = require('ora');

    class App {
        constructor() {
            this.manga = './manga'
            this.croped = './croped'

            this.app()
        }

        app() {
            console.log('Manga crop: v0.1')
            fs.readdir(this.manga, (err, files) => {
                if(files && !err) {
                    console.log('Количество манги для обработки: ' + files.length)

                    var c = 0
                    var task = () => {
                        this.crop(files[c], () => {
                            c++
                            if(files[c]) {
                                task()
                            }
                        })
                    }

                    task()

                } else {
                    throw Error('Папка с мангой пуста или её не существует')
                }
            });
        }

        crop(manga, cb) {
            var manga = manga
            const spinner = ora("Crop "+manga).start();
            var source = this.manga+'/'+manga

            var width = 208,
                height = 296,
                white = 12

            var x = [width, width*2, width*3, width*4]
            var y = [height, height*2, height*3, height*4]

            its(source, y, x, {
                clipperOptions: {
                canvas: require('canvas')
                },
                saveToDataUrl: true
            }, (img) => {

                var img = img.map(function(img) {
                return img.dataURI.replace(/^data:image\/\w+;base64,/, "");
                });

                mergeImg([
                    { src: Buffer.from(img[0], 'base64')},
                    { src: Buffer.from(img[5], 'base64')},
                    { src: Buffer.from(img[10], 'base64')},
                    { src: Buffer.from(img[15], 'base64')},
                    { src: Buffer.from(img[4], 'base64')},

                    { src: Buffer.from(img[1], 'base64'), offsetX: -white-width*4, offsetY: height},
                    { src: Buffer.from(img[6], 'base64'), offsetY: height},
                    { src: Buffer.from(img[11], 'base64'), offsetY: height},
                    { src: Buffer.from(img[16], 'base64'), offsetY: height},
                    { src: Buffer.from(img[9], 'base64'), offsetY: height},

                    { src: Buffer.from(img[2], 'base64'), offsetX: -white-width*4, offsetY: height*2},
                    { src: Buffer.from(img[7], 'base64'), offsetY: height*2},
                    { src: Buffer.from(img[12], 'base64'), offsetY: height*2},
                    { src: Buffer.from(img[17], 'base64'), offsetY: height*2},
                    { src: Buffer.from(img[14], 'base64'), offsetY: height*2},

                    { src: Buffer.from(img[3], 'base64'), offsetX: -white-width*4, offsetY: height*3},
                    { src: Buffer.from(img[8], 'base64'), offsetY: height*3},
                    { src: Buffer.from(img[13], 'base64'), offsetY: height*3},
                    { src: Buffer.from(img[18], 'base64'), offsetY: height*3},
                    { src: Buffer.from(img[19], 'base64'), offsetY: height*3},
                ]).then((img) => {
                    img.write(this.croped+'/'+manga, () => {
                        spinner.succeed(manga + " saved!")
                        cb()
                    });
                })
            })
        }
    }

    new App();