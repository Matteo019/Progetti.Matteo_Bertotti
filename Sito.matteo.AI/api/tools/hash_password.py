"""Prints the bcrypt hash for ADMIN_PASSWORD_HASH, already escaped for a Docker Compose .env file.

Usage: python tools/hash_password.py   (asks for the password without echoing it)
"""

import getpass

import bcrypt

password = getpass.getpass("Password admin: ")
if len(password) < 12:
    raise SystemExit("Usa almeno 12 caratteri.")
if password != getpass.getpass("Ripeti: "):
    raise SystemExit("Le password non coincidono.")

hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
print("ADMIN_PASSWORD_HASH=" + hashed.replace("$", "$$"))
