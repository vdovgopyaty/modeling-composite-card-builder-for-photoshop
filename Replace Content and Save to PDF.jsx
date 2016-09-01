// переключение слоев https://youtu.be/wWYjPHQ_Frs

#target photoshop

var textFile = File('/d/Iskra/text.txt');
var images = Folder('/d/Iskra/images').getFiles();

if (textFile.exists == true) {
    textFile.open('r', undefined, undefined);
    var data = [];
    while (!textFile.eof) {
        data.push({
            name: textFile.readln(),
            props: textFile.readln()
        });
    }
    textFile.close();
    
    var doc = app.activeDocument;
    var layer = doc.layerSets.getByName('group');
    
    for (var i = 0; i < data.length; i++) {
        var newLayer = layer.duplicate();
        newLayer.name = 'group' + i;
        newLayer.layers[0].name = 'name' + i;
        newLayer.layers[0].textItem.contents = data[i].name;
        newLayer.layers[1].name = 'props' + i;
        newLayer.layers[1].textItem.contents = data[i].props;
        newLayer.layers[2].name = 'image' + i;
        
        load(images[0]);
        
    }
 
} else {
    alert('Текстовый файл text.txt не найден');
}




// newLayer.layers[0].textItem.contents = 'Hello World';





// Сохранение PDF
// output to the desktop
// var outputFile = File("~/Desktop/JavaScriptPresentation.pdf")
// there are defaults but I like to set the options myself
// var options = new PresentationOptions
// options.presentation = true
// options.view = true
// options.autoAdvance = true
// options.interval = 5
// options.loop = true
// options.transition = TransitionType.RANDOM
// create the presentation
// makePDFPresentation(inputFiles, outputFile, options)
