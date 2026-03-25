import os
import sqlite3
import uuid
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR.parent / "public"
UPLOAD_DIR = PUBLIC_DIR / "assets" / "portfolio"
DATABASE = BASE_DIR / "portfolio.db"
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def is_allowed_image(filename):
    if not filename or "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()
    return extension in ALLOWED_IMAGE_EXTENSIONS


def is_managed_portfolio_image(image_path):
    return bool(image_path) and image_path.startswith("assets/portfolio/")


def remove_unused_image(conn, image_path):
    if not is_managed_portfolio_image(image_path):
        return False

    result = conn.execute(
        "SELECT COUNT(*) AS count FROM projects WHERE image = ?",
        (image_path,),
    ).fetchone()

    if result["count"] != 0:
        return False

    full_path = PUBLIC_DIR / image_path

    if full_path.is_file():
        full_path.unlink()
        return True

    return False


@app.route("/api/upload", methods=["POST"])
def upload_image():
    file = request.files.get("image")

    if file is None:
        return jsonify({"error": "Aucun fichier envoye."}), 400

    if not file.filename:
        return jsonify({"error": "Aucun fichier selectionne."}), 400

    safe_filename = secure_filename(file.filename)

    if not safe_filename or not is_allowed_image(safe_filename):
        return jsonify({"error": "Format d'image non autorise."}), 400

    mimetype = (file.mimetype or "").lower()
    if mimetype and not mimetype.startswith("image/"):
        return jsonify({"error": "Le fichier doit etre une image."}), 400

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    extension = os.path.splitext(safe_filename)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_DIR / unique_filename

    file.save(destination)

    return jsonify({"path": f"assets/portfolio/{unique_filename}"}), 201


@app.route("/api/projects", methods=["GET", "POST", "PUT", "DELETE"])
def projects():
    if request.method == "GET":
        search_term = (request.args.get("search") or "").strip()
        conn = get_connection()

        if search_term:
            projects_rows = conn.execute(
                """
                SELECT id, name, description, image, url, status
                FROM projects
                WHERE LOWER(name) LIKE ?
                ORDER BY LOWER(name) ASC
                """,
                (f"%{search_term.lower()}%",),
            ).fetchall()
        else:
            projects_rows = conn.execute(
                """
                SELECT id, name, description, image, url, status
                FROM projects
                ORDER BY LOWER(name) ASC
                """
            ).fetchall()

        conn.close()

        return jsonify([dict(project) for project in projects_rows])

    if request.method == "POST":
        data = request.get_json(silent=True) or {}

        name = data.get("name")
        description = data.get("description")
        image = data.get("image")
        url = data.get("url")
        status = data.get("status")

        conn = get_connection()
        conn.execute(
            """
            INSERT INTO projects (name, description, image, url, status)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, description, image, url, status),
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Projet ajoute avec succes"}), 201

    if request.method == "DELETE":
        project_id = request.args.get("id")

        if not project_id:
            return jsonify({"error": "ID de projet manquant"}), 400

        conn = get_connection()
        project = conn.execute(
            "SELECT * FROM projects WHERE id = ?",
            (project_id,),
        ).fetchone()

        if not project:
            conn.close()
            return jsonify({"error": "Projet introuvable"}), 404

        image_path = project["image"]

        conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        conn.commit()

        deleted_file = remove_unused_image(conn, image_path)
        conn.close()

        return jsonify(
            {
                "message": "Projet supprime avec succes",
                "image_deleted": deleted_file,
            }
        )

    project_id = request.args.get("id")
    if not project_id:
        return jsonify({"error": "ID de projet manquant"}), 400

    data = request.get_json(silent=True) or {}

    name = data.get("name")
    description = data.get("description")
    image = data.get("image")
    url = data.get("url")
    status = data.get("status")

    conn = get_connection()
    old_project = conn.execute(
        "SELECT * FROM projects WHERE id = ?",
        (project_id,),
    ).fetchone()

    if not old_project:
        conn.close()
        return jsonify({"error": "Projet introuvable"}), 404

    old_image = old_project["image"]

    conn.execute(
        """
        UPDATE projects
        SET name = ?, description = ?, image = ?, url = ?, status = ?
        WHERE id = ?
        """,
        (name, description, image, url, status, project_id),
    )
    conn.commit()

    deleted_file = False
    if old_image != image and old_image:
        deleted_file = remove_unused_image(conn, old_image)

    conn.close()

    return jsonify(
        {
            "message": "Projet mis a jour avec succes",
            "old_image_deleted": deleted_file,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
