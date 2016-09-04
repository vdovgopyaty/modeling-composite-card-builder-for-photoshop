#target photoshop

var frame = {
    top: 76,
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

// чтение текстового файла
var textFilePath = prompt('Укажите путь к текстовому файлу', '/d/Iskra/input.txt');
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
    var imagesFolderPath = prompt('Укажите путь к папке с изображениями', '/d/Iskra/images');
    var images = Folder(imagesFolderPath).getFiles();
    if (images.length > 0) {

        if (data.length == images.length) {
            var group = doc.layerSets.getByName('group'); // value type LayerSets
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
                var outputFile = File(outputFilePath + '/' + parseInt(i + 1) + '.pdf');
                doc.saveAs(outputFile, options);
                newGroups[i].visible = false;
            }

        } else {
            alert('Ошибка: количество данных в текстовом файле не соответствует количеству изображений');
        }
    } else {
        alert('Ошибка: изображения в папке D:/Iskra/images не найдены');
    }
} else {
    alert('Ошибка: текстовый файл D:/Iskra/text.txt не найден');
}
