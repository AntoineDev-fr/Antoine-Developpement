import sqlite3
from pathlib import Path

DATABASE = Path(__file__).resolve().parent / "portfolio.db"

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    url TEXT,
    status TEXT NOT NULL CHECK(status IN ('online', 'progress'))
)
""")

projects = [
    (
        "Boucherie",
        "Site vitrine simple et moderne pour une entreprise locale.",
        "assets/boucherie.png",
        "https://site-client-1.fr",
        "online"
    ),
    (
        "Antoine Développement",
        "Mon site principal pour présenter mes services web.",
        "assets/devweb.png",
        "https://antoine-developpement.fr",
        "online"
    ),
    (
        "Projet en cours",
        "Projet actuellement en développement.",
        "assets/portfolio.png",
        "#",
        "progress"
    )
]

cursor.execute("DELETE FROM projects")
cursor.executemany("""
INSERT INTO projects (name, description, image, url, status)
VALUES (?, ?, ?, ?, ?)
""", projects)

conn.commit()
conn.close()

print("Base initialisée.")
