import os
import json
import subprocess
from PIL import Image
from pillow_heif import register_heif_opener

# Enable HEIC support for Pillow conversion
register_heif_opener()

def extract_trip_data(photo_dir, output_json):
    """
    Scans photo_dir, extracts GPS via ExifTool, converts HEIC to JPG, 
    and appends new points to the JSON log.
    """
    # 1. LOAD EXISTING DATA
    existing_points = []
    if os.path.exists(output_json):
        try:
            with open(output_json, 'r') as f:
                existing_points = json.load(f)
        except Exception:
            existing_points = []

    processed_files = {p['img'] for p in existing_points}
    new_points = []

    # 2. SCAN FOR PHOTOS
    valid_exts = ('.jpg', '.jpeg', '.heic', '.JPG', '.JPEG', '.HEIC')
    if not os.path.exists(photo_dir):
        return

    all_files = [f for f in os.listdir(photo_dir) if f.lower().endswith(valid_exts)]
    
    for filename in all_files:
        if filename in processed_files or filename.startswith('.'):
            continue
            
        path = os.path.join(photo_dir, filename)
        
        try:
            # 3. EXTRACT METADATA via ExifTool
            cmd = ['exiftool', '-j', '-gpslatitude#', '-gpslongitude#', '-gpsaltitude#', '-datetimeoriginal', path]
            result = subprocess.run(cmd, capture_output=True, text=True)
            data_list = json.loads(result.stdout)
            if not data_list: continue
            metadata = data_list[0]

            lat = metadata.get('GPSLatitude')
            lon = metadata.get('GPSLongitude')

            if lat is None or lon is None:
                continue

            # 4. HANDLE CONVERSION
            current_display_name = filename
            if filename.lower().endswith('.heic'):
                with Image.open(path) as img:
                    jpg_name = os.path.splitext(filename)[0] + ".jpg"
                    jpg_path = os.path.join(photo_dir, jpg_name)
                    img.save(jpg_path, "JPEG", quality=90)
                os.remove(path)
                current_display_name = jpg_name

            # 5. FORMAT DATA
            raw_time = metadata.get("DateTimeOriginal", "Unknown Time")
            clean_time = raw_time.replace(":", "/", 2) if "Unknown" not in raw_time else raw_time

            new_points.append({
                "lat": float(lat),
                "lon": float(lon),
                "alt": float(metadata.get('GPSAltitude', 0)),
                "time": clean_time,
                "img": current_display_name
            })

        except Exception as e:
            print(f"Error on {filename}: {e}")

    # 6. SAVE
    final_list = existing_points + new_points
    final_list.sort(key=lambda x: x['time'])

    with open(output_json, 'w') as f:
        json.dump(final_list, f, indent=4)

if __name__ == "__main__":
    # Dynamically find paths relative to this script's location
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
    
    PHOTOS = os.path.join(PROJECT_ROOT, "app", "static", "photos")
    JSON_FILE = os.path.join(PROJECT_ROOT, "data", "points.json")
    
    extract_trip_data(PHOTOS, JSON_FILE)