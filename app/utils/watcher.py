import time
import os
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from exif_parser import extract_trip_data

PHOTO_DIR = os.path.join(os.getcwd(), 'app', 'static', 'photos')
OUTPUT_JSON = os.path.join(os.getcwd(), 'data', 'points.json')

class PhotoHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(('.jpg', '.jpeg')):
            print(f"New photo detected: {os.path.basename(event.src_path)}")
            time.sleep(1) 
            extract_trip_data(PHOTO_DIR, OUTPUT_JSON)

    def on_moved(self, event):
        if event.dest_path.lower().endswith(('.jpg', '.jpeg')):
            print(f"Photo synced/moved: {os.path.basename(event.dest_path)}")
            time.sleep(1)
            extract_trip_data(PHOTO_DIR, OUTPUT_JSON)

if __name__ == "__main__":
    event_handler = PhotoHandler()
    observer = Observer()
    observer.schedule(event_handler, PHOTO_DIR, recursive=False)
    
    print(f"📡 Tabi(旅)Time Watcher Active: Monitoring {PHOTO_DIR}...")
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()