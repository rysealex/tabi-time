import time
import os
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from exif_parser import extract_trip_data

# Use environment variables for paths, or default to relative project structure
PROJECT_ROOT = os.getenv("TABITIME_ROOT", os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
WATCH_DIR = os.path.join(PROJECT_ROOT, "app", "static", "photos")
JSON_OUTPUT = os.path.join(PROJECT_ROOT, "data", "points.json")

class PhotoHandler(FileSystemEventHandler):
    def handle_event(self, event):
        if event.is_directory:
            return
        
        dest_path = getattr(event, 'dest_path', event.src_path)
        filename = os.path.basename(dest_path)

        if filename.startswith('.') or not filename.lower().endswith(('.jpg', '.jpeg', '.heic')):
            return

        # Settle delay for Syncthing rename events
        time.sleep(2)
        extract_trip_data(WATCH_DIR, JSON_OUTPUT)

    def on_created(self, event): self.handle_event(event)
    def on_moved(self, event): self.handle_event(event)

if __name__ == "__main__":
    observer = Observer()
    observer.schedule(PhotoHandler(), WATCH_DIR, recursive=False)
    observer.start()
    try:
        while True: time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()