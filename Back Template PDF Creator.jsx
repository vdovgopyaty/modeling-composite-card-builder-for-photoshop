//******************************************
// PHOTOSHOP PDF CREATOR
// Author: Vladislav Dovgopyaty <vdovgopyaty@gmail.com>
// Url: https://bitbucket.org/vladislavdovg/photoshop-pdf-creator

#target photoshop

var frame = {
    top: 307,
    left: 118,
    right: 118,
    bottom: 235
};

var currentFolder = decodeURI(File($.fileName).parent);

var doc = app.activeDocument;
var docWidth = doc.width;
var docHeight = doc.height;

var imageWidth = docWidth - frame.left - frame.right;
var imageHeight = docHeight - frame.top - frame.bottom;
var imageRatio = imageWidth / imageHeight;

var outputFilePath = prompt('Укажите путь к папке для сохранения PDF-файлов (папка должна существовать)', currentFolder + '/pdf');
var options = new PDFSaveOptions;
options.presentation = true;
options.view = true;
options.autoAdvance = true;
options.interval = 5;
options.loop = true;
options.transition = TransitionType.RANDOM;
options.layers = false;

// чтение текстового файла
var textFilePath = prompt('Укажите путь к текстовому файлу', currentFolder + '/input.txt');
var textFile = File(textFilePath);
if (textFile.exists) {
    textFile.open('r');
    var data = [];
    while (!textFile.eof) {
        data.push({
            name: textFile.readln(),
            props: textFile.readln()
        });
    }
    textFile.close();

    // чтение изображений
    var imagesFolderPath = prompt('Укажите путь к папке с изображениями', currentFolder + '/images/front');
    var images = Folder(imagesFolderPath).getFiles(/\.(jpg|jpeg|png|bmp)$/i);
    if (images.length > 0) {

        if (data.length = images.length) {
            var group = doc.layerSets.getByName('group');
            var newGroups = [];

            // перебор изображений
            for (var i = 0; i < images.length; i++) {
                // дублирования шаблонного слоя и изменение значений текстовых полей
                newGroups.push(group.duplicate());
                newGroups[i].layers[0].textItem.contents = data[i].name;
                newGroups[i].layers[1].textItem.contents = data[i].props;

                // загрузка изображения из папки
                load(images[i]);
                var currentImage = app.activeDocument;
                var currentImageWidth = currentImage.width;
                var currentImageHeight = currentImage.height;
                var currentImageRatio = currentImageWidth / currentImageHeight;

                // изменение размера изображения в соответвии с рамкой
                if (currentImageRatio < imageRatio) {
                    currentImage.resizeImage(imageWidth);
                } else if (currentImageRatio > imageRatio) {
                    currentImage.resizeImage(imageHeight * currentImageRatio);
                }
                currentImageWidth = currentImage.width;
                currentImageHeight = currentImage.height;

                // вставка изображения в исходный документ
                currentImage.activeLayer.copy();
                currentImage.close(SaveOptions.DONOTSAVECHANGES);
                doc.paste().move(newGroups[i], ElementPlacement.PLACEATEND);

                // перемещение изображения в соответствии с рамкой
                if (currentImageHeight > imageHeight) {
                    var currentImageMargin = currentImageHeight - imageHeight;
                    doc.activeLayer.translate(frame.right - frame.left, (frame.top - frame.bottom + currentImageMargin) / 2);
                } else {
                    doc.activeLayer.translate(frame.right - frame.left, (frame.top - frame.bottom) / 2);
                }

                // сохранение PDF-файла
                var prefix = '0';
                if (i < 9) {
                    prefix += '0';
                }
                var outputFile = File(outputFilePath + '/' + prefix + parseInt(i + 1) + '-back-' + Date.now() + '.pdf');
                doc.saveAs(outputFile, options);
                newGroups[i].visible = false;
            }

        } else {
            alert('Ошибка: количество данных в текстовом файле не соответствует количеству изображений');
        }
    } else {
        alert('Ошибка: изображения в папке ' + imagesFolderPath + ' не найдены');
    }
} else {
    alert('Ошибка: текстовый файл ' + textFilePath + ' не найден');
}
