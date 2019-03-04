//******************************************
// MODELING COMPOSITE CARD BUILDER FOR PHOTOSHOP
// Author: Vladislav Dovgopyaty <vdovgopyaty@gmail.com>
// Url: https://github.com/vdovgopyaty/modeling-composite-card-builder-for-photoshop

#target photoshop

// конфигурация
var config = {
	// размер рамки
	frame: {
		top: 307,
		left: 118,
		right: 118,
		bottom: 235,
	},
	// пути к файлам и папкам относительно корневой папки проекта
	paths: {
		outputFolder: '/out',
		outputFilePrefix: 'back',
		imageFolder: '/data/images/back',
		textFile: '/data/proportions.txt',
	},
	// процессоры
	processors: {
		text: true
	}
};

function init() {
	config.doc = app.activeDocument;
	var d = config.doc;
		d.centerV = d.height / 2;
		d.centerH = d.width / 2;

	var p = config.paths;
		p.rootFolder = decodeURI(File($.fileName).parent.parent);

	if (p.outputFolder) { p.outputFolder = p.rootFolder + p.outputFolder; }
	if (p.imageFolder)  { p.imageFolder  = p.rootFolder + p.imageFolder; }
	if (p.textFile)     { p.textFile     = p.rootFolder + p.textFile; }

	if (config.frame) {
		var f = config.frame;
			f.height  = config.doc.height - f.top - f.bottom;
			f.width   = config.doc.width - f.left - f.right;
			f.ratio   = f.width / f.height;
			f.centerV = f.top + f.height / 2;
			f.centerH = f.left + f.width / 2;
	}

	config.pdfOptions = new PDFSaveOptions;
	var o = config.pdfOptions;
		o.presentation = true;
		o.view         = true;
		o.autoAdvance  = true;
		o.interval     = 5;
		o.loop         = true;
		o.transition   = TransitionType.RANDOM;
		o.layers       = false;

	p.outputFolder = prompt('Укажите путь к папке для сохранения PDF-файлов', p.outputFolder);
	var images = readImages(p.imageFolder);
	if (config.processors.text) {
		var textData = readTextFile(p.textFile);
	}
	createPdf(config, images, textData);
}

init();

// чтение изображений
function readImages(path) {
	var images = Folder(
		prompt('Укажите путь к папке с изображениями', path)
	).getFiles(/\.(jpg|jpeg|png|bmp)$/i);

	if (images.length > 0) {
		return images;
	}

	alert('Ошибка: изображения в папке ' + path + ' не найдены');
	return false;
}

// чтение текстового файла
function readTextFile(path) {
	var textFile = File(prompt('Укажите путь к текстовому файлу', path));

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
		return data;
	}

	alert('Ошибка: текстовый файл ' + path + ' не найден');
	return false;
}

function createPdf(cfg, images, textData) {
	if (cfg.processors.text) {
		if (textData.length != images.length) {
			alert('Ошибка: количество данных в текстовом файле не соответствует количеству изображений');
			return false;
		}
	}

	var group = cfg.doc.layerSets.getByName('group');
	var newGroups = [];

	// перебор изображений
	for (var i = 0; i < images.length; i++) {
		// дублирования шаблонного слоя и изменение значений текстовых полей
		newGroups.push(group.duplicate());
		if (cfg.processors.text) {
			newGroups[i].layers[0].textItem.contents = textData[i].name;
			newGroups[i].layers[1].textItem.contents = textData[i].props;
		}

		// загрузка изображения из папки
		load(images[i]);
		var image = app.activeDocument;
		var imageRatio = image.width / image.height;

		// изменение размера изображения в соответствии с рамкой
		if (imageRatio < cfg.frame.ratio) {
			image.resizeImage(cfg.frame.width);
		} else if (imageRatio > cfg.frame.ratio) {
			image.resizeImage(cfg.frame.height * imageRatio);
		}

		var imageHeight = image.height;
		var imageWidth = image.width;

		// вставка изображения в исходный документ
		image.activeLayer.copy();
		image.close(SaveOptions.DONOTSAVECHANGES);
		cfg.doc.paste().move(newGroups[i], ElementPlacement.PLACEATEND);

		// перемещение изображения по центру рамки
		if (imageHeight > cfg.doc.height) {
			var imageCenterV = imageHeight / 2;
		} else {
			var imageCenterV = cfg.doc.height / 2;
		}
		cfg.doc.activeLayer.translate(
			cfg.frame.right - cfg.frame.left,
			cfg.frame.centerV - imageCenterV
		);

		// сохранение PDF-файла
		var numPrefix = '0';
		if (i < 9) {
			numPrefix += '0';
		}
		var outputFile = File(cfg.paths.outputFolder + '/' + numPrefix + parseInt(i + 1) + '-' + cfg.paths.outputFilePrefix + '-' + Date.now() + '.pdf');
		cfg.doc.saveAs(outputFile, cfg.pdfOptions);
		newGroups[i].visible = false;
	}
};
