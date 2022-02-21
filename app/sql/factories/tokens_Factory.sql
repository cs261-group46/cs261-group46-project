DELETE FROM TOKEN_TYPES;
INSERT INTO TOKEN_TYPES VALUES (DEFAULT, 'LOGIN', 60, true, false);
INSERT INTO TOKEN_TYPES VALUES (DEFAULT, 'EMAIL_VERIFY', 15, false, true);
INSERT INTO TOKEN_TYPES VALUES (DEFAULT, 'PASSWORD_RESET', 5, false, false);
INSERT INTO TOKEN_TYPES VALUES (DEFAULT, 'DEV', 10000, true, false); --for development, you just have to connect about once a week to keep it up



