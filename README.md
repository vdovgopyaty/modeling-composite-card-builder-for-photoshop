# Генератор композиток моделей для Photoshop

Скрипт для Photoshop CS6 и выше, который позволяет создать композитки в формате PDF на основе данных из текстового файла и фотографий.

Объединить несколько PDF-файлов в один можно с помощью сервиса [PDF Joiner](http://pdfjoiner.com/ru/).


## Как этим пользоваться?

**Внимание! Для работы скрипта в Фотошопе в настройках единиц измерения требуется выбрать пиксели.**

1. Открыть `/src/front-template.psd` или `/src/back-template.psd` в Photoshop.
2. Нажать `Файл` -> `Сценарии` -> `Обзор` и выбрать файл `/src/front-template.jsx` или `/src/back-template.jsx` соответственно.

Файлы и папки:

`/data/proportions.txt` - файл с данными для заполнения в формате:
```
Имя_и_фамилия_1
Параметры_1
Имя_и_фамилия_2
Параметры_2
```

`/data/images/front` - папка с фотографиями для лицевой стороны

`/data/images/back` - папка с фотографиями для оборотной стороны

`/out` - папка, в которую будут сохранены готовые композитки


[Photoshop CS6 documentation](http://wwwimages.adobe.com/content/dam/Adobe/en/products/photoshop/pdfs/cs6/Photoshop-CS6-JavaScript-Ref.pdf)
