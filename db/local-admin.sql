-- Cuenta exclusiva para desarrollo local. No se usa en Railway.
INSERT INTO admin_users (username, password_hash, display_name, active)
VALUES (
  'abfadmin',
  '$2b$12$NOpixwaWJzC07gCPdFfu4exLwO4Fh4P9NwXETpZOQIQZpDyiah0V2',
  'Administrador ABF',
  TRUE
)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  active = TRUE;
