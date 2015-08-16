##Audio player

###Задание

Создайте с помощью WebAudio API плеер, который:

* умеет открывать аудиофайлы (поддерживаемых браузером форматов) с локального диска;
* поддерживает drag'n'drop;
* имеет кнопки play и stop;
* выводит название проигрываемого файла;
* умеет отображать хотя бы один вариант визуализации (waveform или spectrum);
* работает в Яндекс.Браузере, Safari, Chrome, Firefox.

Дополнительно реализуйте возможность:

* выбора настройки эквалайзера (pop, rock, jazz, classic, normal);
* вывод названия песни и исполнителя из метаданных аудиофайла.

###Решение
В разработке использовал БЭМ стек (шаблонизатор BEMHTML, js-framework i-bem, сборка enb). 
Старался максимально переиспользовать блоки из библиотеки bem-components.

Информацию по web audio api брал из mdn. Значения эквалайзера нашел где-то в сети и не уверен, что они верные.

Плеер тупит изредка в firefox developer edition (начинает воспроизведение не сразу)
