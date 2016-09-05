# Photoshop PDF Creator #

Скрипт для Photoshop CS6 и выше, который позволяет создать композитки в формате PDF на основе данных из текстового файла и фотографий.

Объединить несколько PDF-файлов в один можно с помощью сервиса [Smallpdf](https://smallpdf.com/ru/merge-pdf).

## Как этим пользоваться? ##

1. Разместить файлы в папке `D:/pdfcreator/` или любой другой, убедиться, что папка `D:/pdfcreator/pdf/` создана.
2. Открыть Front Template.psd или Back Template.psd в Photoshop.
3. Нажать `Файл` -> `Сценарии` -> `Обзор` и выбрать файл `Front Template PDF Creator.jsx` или `Back Template PDF Creator.jsx` соответственно.
4. Указать пути до текстового файла, папки с фотографиями и папки, в которую будут сохранены исходные файлы. По умолчанию `/d/pdfcreator/` (диск *D:/* папка *pdfcreator*).

Ниже прокомментированы значения по умолчанию:

`/d/pdfcreator/input.txt` - файл с данными для заполнения в формате:
```
Имя_и_фамилия_1
Параметры_1
Имя_и_фамилия_2
Параметры_2
```

`/d/pdfcreator/images/front` - папка с фотографиями

`/d/pdfcreator/pdf` - папка, в которую будут сохранены PDF-файлы

где:

`/d` - буква диска

`/pdfcreator` - папка, в которой размещены все файлы

[Photoshop CS6 documentation](http://wwwimages.adobe.com/content/dam/Adobe/en/products/photoshop/pdfs/cs6/Photoshop-CS6-JavaScript-Ref.pdf)