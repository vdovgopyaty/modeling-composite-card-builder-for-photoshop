#target photoshop

var frame = {
    top: 94,
    left: 38,
    right: 38,
    bottom: 54
};

var doc = app.activeDocument;
var docWidth = doc.width;
var docHeight = doc.height;

frame['width'] = docWidth - frame.left - frame.right;
frame['height'] = docHeight - frame.top - frame.bottom;

var imageWidth = docWidth - frame.left - frame.right;
var imageHeight = docHeight - frame.top - frame.bottom;
var imageRatio = imageWidth / imageHeight;

var outputFilePath = prompt('Укажите папку для сохранения PDF-файлов (папка должна существовать)', '/d/Iskra/pdf');
var options = new PDFSaveOptions;
options.presentation = true;
options.view = true;
options.autoAdvance = true;
options.interval = 5;
options.loop = true;
options.transition = TransitionType.RANDOM;

// чтение изображений
var imagesFolderPath = prompt('Укажите путь к папке с изображениями', '/d/Iskra/images/back');
var images = Folder(imagesFolderPath).getFiles();
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
        var currentimageRatio = currentImageWidth / currentImageHeight;

        // изменение размера изображения в соответвии с рамкой
        if (currentimageRatio < imageRatio) {
            currentImage.resizeImage(imageWidth);
        } else if (currentimageRatio > imageRatio) {
            currentImage.resizeImage(imageHeight * currentimageRatio);
        }
        currentImageWidth = currentImage.width;
        currentImageHeight = currentImage.height;

        // вставка изображения в исходный документ
        currentImage.activeLayer.copy();
        currentImage.close(SaveOptions.DONOTSAVECHANGES);
        doc.paste().move(newGroups[i], ElementPlacement.PLACEATEND);

        // перемещение изображения в соответствии с рамкой
        if (currentImageHeight > frame.height) {
            var currentImageMargin = currentImageHeight - frame.height;
            doc.activeLayer.translate(frame.right - frame.left, (frame.top - frame.bottom + currentImageMargin) / 2);
        } else {
            doc.activeLayer.translate(frame.right - frame.left, (frame.top - frame.bottom) / 2);
        }

        // сохранение PDF-файла
        var outputFile = File(outputFilePath + '/back' + parseInt(i + 1) + '.pdf');
        doc.saveAs(outputFile, options);
        newGroups[i].visible = false;
    }
} else {
    alert('Ошибка: изображения в папке D:/Iskra/images не найдены');
}
