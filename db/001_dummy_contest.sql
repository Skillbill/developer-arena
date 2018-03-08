INSERT INTO "public" . contest(
       end_presentation,
       end_applying,
       end_voting,
       state
) VALUES(
  '2018-04-01',
  '2018-04-15',
  '2018-05-01',
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
    'Contest TEST title'
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
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
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
    'TEST titolo gara'
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
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
);
