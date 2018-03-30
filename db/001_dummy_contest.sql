INSERT INTO "public" . contest(
       end_presentation,
       end_applying,
       end_voting,
       state
) VALUES(
  '2018-04-22',
  '2018-04-29',
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
    'The theme of this competition is the development of an animated and / or interactive  **HTML5** application inspired by the **Marvel** world, more specifically for the new upcoming movie **“Avengers Infinity War”**.
Following some ideas :

- an animation inspired by the movie scenes using the original characters
- a visualization of a awesome genetic algorithm that pilots the IronMan''s bullets
- a transformation of Banner into HULK based on the speed of mouse clicks
- take all the gems of Infinity by playing a rhythm game

but ideas can be so many so the limit is only your imagination.
You can use any web technique.'
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
2. Il browser sarà ospitato in una macchina **VirtualBOX** avente **8GB** di RAM, **4** core cpu, impostazione di rete **offline** e con sistema operativo**Xubuntu 16.04 LTS 64 bit** appena installato (qui… c’è export VirtualBox della macchina). I file del tuo progetto verranno caricati con la condivisione delle cartelle verso il sitema VirtualBOX HOST'
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
    '1. Your program will run in the browser ** Chrome ** ‘Official Build’ 64 bit version> = 65
2. The target computer will be a **VirtualBOX** machine with **8GB** of RAM, **4** cpu core, network setting **offline** and a fresh installazion of the operating system **Xubuntu 16.04 LTS 64 bit** (here ... you can download and use the exported VirtualBOX appliance ). Your project will be loaded inside the virtual machine using the sharing folder feature with the VirtualBOX HOST'
);
