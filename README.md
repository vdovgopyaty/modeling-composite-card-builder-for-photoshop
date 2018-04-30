# Photoshop PDF Creator #

Скрипт для Photoshop CS6 и выше, который позволяет создать композитки в формате PDF на основе данных из текстового файла и фотографий.

Объединить несколько PDF-файлов в один можно с помощью сервиса [PDF Joiner](http://pdfjoiner.com/ru/).

## Как этим пользоваться? ##

**Внимание! Для работы скрипта в Фотошопе в настройках единиц измерения требуется выбрать пиксели.**

1. Создать папку `/pdf` в папке, где лежит скрипт.
2. Открыть Front Template.psd или Back Template.psd в Photoshop.
3. Нажать `Файл` -> `Сценарии` -> `Обзор` и выбрать файл `Front Template PDF Creator.jsx` или `Back Template PDF Creator.jsx` соответственно.

Файлы и папки:

`/input.txt` - файл с данными для заполнения в формате:
```
Имя_и_фамилия_1
Параметры_1
Имя_и_фамилия_2
Параметры_2
```

`/images/front` - папка с фотографиями для лицевой стороны
`/images/back` - папка с фотографиями для задней стороны

`/pdf` - папка, в которую будут сохранены PDF-файлы

[Photoshop CS6 documentation](http://wwwimages.adobe.com/content/dam/Adobe/en/products/photoshop/pdfs/cs6/Photoshop-CS6-JavaScript-Ref.pdf)