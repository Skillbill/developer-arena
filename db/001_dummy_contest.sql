INSERT INTO "public" . contest(
       end_presentation,
       end_applying,
       end_voting,
       state
) VALUES(
  '2018-06-22',
  '2018-07-22',
  '2018-08-22',
  'ACTIVE'
);

INSERT INTO "public" . contest_i18n(
       contest_id,
       attribute,
       language,
       text
) VALUES(
    1,
    'title',
    'en',
    'Example Contest'
);

INSERT INTO "public" . contest_i18n(
       contest_id,
       attribute,
       language,
       text
) VALUES(
    1,
    'description',
    'en',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur interdum sagittis mi non **pharetra**. In turpis elit, eleifend sit amet risus sed, volutpat rutrum neque. Curabitur eget sollicitudin enim. Donec libero lorem, bibendum non sollicitudin sed, sagittis tempor diam. Aenean porttitor varius odio in posuere. *Curabitur interdum viverra libero vel consequat.* Nulla congue ultricies ante, eget rhoncus nisi mollis eget. Duis blandit libero sed diam elementum finibus. Proin faucibus nisi ut elit molestie auctor id at ante. Donec auctor commodo diam ut consectetur.'
);

INSERT INTO "public" . contest_i18n(
       contest_id,
       attribute,
       language,
       text
) VALUES(
    1,
    'title',
    'it',
    'Contest d''esempio'
);

INSERT INTO "public" . contest_i18n(
       contest_id,
       attribute,
       language,
       text
) VALUES(
    1,
    'description',
    'it',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula tortor dui. Donec sit amet condimentum magna. Mauris ac dictum velit. Mauris ante magna, mollis at bibendum eget, laoreet sit amet libero. Vestibulum at lobortis risus. Nullam pharetra eget turpis consectetur suscipit. Proin bibendum nisi mauris, at hendrerit diam ultrices eu. Aliquam non lorem mattis, dictum felis vitae, placerat elit. Sed id dolor auctor, congue erat sed, consequat **magna**. Aenean ullamcorper dolor quis eros sodales aliquet. Nulla sit amet tempus neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam vestibulum nisi mauris, eget pharetra orci facilisis et. Aenean vitae augue auctor, scelerisque odio et, tempor elit. *Nam a lectus sed metus varius elementum.*'
);

INSERT INTO "public" . contest_i18n(
       contest_id,
       attribute,
       language,
       text
) VALUES(
    1,
    'rules',
    'it',
    '1. prima regola
2. seconda regola'
);

INSERT INTO "public" . contest_i18n(
       contest_id,
       attribute,
       language,
       text
) VALUES(
    1,
    'rules',
    'en',
    '1. first rule
2. second rule'
);
