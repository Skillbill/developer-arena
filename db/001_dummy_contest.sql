INSERT INTO "public" . contest(
       end_presentation,
       end_applying,
       end_voting,
       state
) VALUES(
  '2018-04-25',
  '2018-04-22',
  '2018-05-13',
  'ACTIVE'
);

INSERT INTO "public" . contest_i18n(
       entity_id,
       entity_attribute,
       language,
       translation
) VALUES(
    1,
    'title',
    'en',
    'Avengers WEB application'
);

INSERT INTO "public" . contest_i18n(
       entity_id,
       entity_attribute,
       language,
       translation
) VALUES(
    1,
    'description',
    'en',
    'Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis **nostrud** exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
);

INSERT INTO "public" . contest_i18n(
       entity_id,
       entity_attribute,
       language,
       translation
) VALUES(
    1,
    'title',
    'it',
    'Applicazione WEB Avengers'
);

INSERT INTO "public" . contest_i18n(
       entity_id,
       entity_attribute,
       language,
       translation
) VALUES(
    1,
    'description',
    'it',
    'Il tema di questa gara è lo sviluppo di un programma **HTML5** animato e/o interattivo ispirato al mondo **Marvel** più specificatamente al nuovo film in arrivo **“Avengers Infinity War”**.
Ecco alcuni esempi :

 - una animazione ispirata al film con i vari personaggi
 - la visualizzazione di un algoritmo genetico per pilotare i proiettili sparati da Iron Man
 - la trasformazione di Banner in HULK basata sulla velocità dei click del mouse
 - prendere tutte le gemme dell’Infinito giocando un rhythm game

le idee possono essere davvero tante e il limite è quindi solo la tua immaginazione.
Potrai usare qualsiasi tecnica web.'
);

INSERT INTO "public" . contest_i18n(
       entity_id,
       entity_attribute,
       language,
       translation
) VALUES(
    1,
    'rules',
    'it',
    '1. Il tuo programma verrà aperto nel browser **Chrome** ‘Official Build’ 64 bit versione >= 65
2. Il browser sarà ospitato in una macchina virtuale avente **8GB** di RAM, **4 core**, impostazione di rete **offline** e con sistema operativo **Xubuntu** 16.04.x appena installato (qui… c’è export VirtualBox della macchina)
'
);

INSERT INTO "public" . contest_i18n(
       entity_id,
       entity_attribute,
       language,
       translation
) VALUES(
    1,
    'rules',
    'en',
    '1. Rule number one.
2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa labore accusamus commodi sequi natus obcaecati odio deleniti praesentium sed quam, modi pariatur soluta nihil autem nisi numquam ea animi iure.
3. Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa labore accusamus commodi sequi natus obcaecati odio deleniti praesentium sed quam, modi pariatur soluta nihil autem nisi numquam ea animi iure.
'
);
