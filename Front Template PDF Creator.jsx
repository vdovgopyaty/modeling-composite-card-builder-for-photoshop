//******************************************
// PHOTOSHOP PDF CREATOR
// Author: Vladislav Dovgopyaty <vdovgopyaty@gmail.com>
// Url: https://bitbucket.org/vladislavdovg/photoshop-pdf-creator

#target photoshop

var frame = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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

// чтение изображений
var imagesFolderPath = prompt('Укажите путь к папке с изображениями', currentFolder + '/images/back');
var images = Folder(imagesFolderPath).getFiles(/\.(jpg|jpeg|png|bmp)$/i);
if (images.length > 0) {
    var group = doc.layerSets.getByName('group');
    var newGroups = [];

    // перебор изображений
    for (var i = 0; i < images.length; i++) {
        // дублирования шаблонного слоя
        newGroups.push(group.duplicate());

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
        var outputFile = File(outputFilePath + '/' + prefix + parseInt(i + 1) + '-front-' + Date.now() + '.pdf');
        doc.saveAs(outputFile, options);
        newGroups[i].visible = false;
    }
} else {
    alert('Ошибка: изображения в папке ' + imagesFolderPath + ' не найдены');
}
