import os

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class FileHandler:
    def __init__(self):
        pass

    async def save_files(self, files):
        file_paths = []
        for file in files:
            path = os.path.join(UPLOAD_DIR, file.filename)
            with open(path, "wb") as f:
                f.write(await file.read())
            file_paths.append(path)
        return file_paths

    def read_file(self, path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()

    def cleanup_files(self, file_paths):
        for path in file_paths:
            if os.path.exists(path):
                os.remove(path)
