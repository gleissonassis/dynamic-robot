const express = require('express');
const axios = require('axios').default;
const Jimp = require('jimp');

const app = express();

const port = process.env.PORT || 3000;



app.get('/:stars/:name', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'image/png');
        const { name, stars } = req.params;
        const robot = await Jimp.read(`https://robohash.org/${name}${stars}?set=set3`);

        const width = 424;
        const height = 354;
        const base = new Jimp(width, height, 'white');

        const layerBackground = await Jimp.read(`./layers/layer-background.png`);
        const layerStars = await Jimp.read(`./layers/layer-${stars}-star.png`);
        const layerName = await Jimp.read(`./layers/layer-name.png`);

        base.composite(layerBackground, 0, 0);
        base.composite(robot, 62, 5);
        base.composite(layerStars, 0, 0);
        base.composite(layerName, 0, 0);

        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        base.print(font, 12, 289, {
            text: name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, 395, 53);

        const buffer = await new Promise((resolve, reject) => {
            base.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) {
                    reject(err);
                }

                resolve(buffer);
            });
        });

        res.end(buffer);
    } catch (e) {
        console.log(e);
        res.send({ e });
    }
});

app.listen(port, function () {
    console.log('Ready');
});