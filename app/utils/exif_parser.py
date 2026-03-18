import os
import json
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def get_decimal_from_dms(dms, ref):
    degrees = float(dms[0])
    minutes = float(dms[1]) / 60.0
    seconds = float(dms[2]) / 3600.0
    if ref in ['S', 'W']:
        return -(degrees + minutes + seconds)
    return degrees + minutes + seconds

def extract_trip_data(photo_dir, output_json):
    points = []

    # Ensure data directory exists
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    
    for filename in os.listdir(photo_dir):
        if filename.lower().endswith(('jpg', 'jpeg')):
            path = os.path.join(photo_dir, filename)
            try:
                img = Image.open(path)
                exif_raw = img._getexif()
                if not exif_raw:
                    continue
                
                # Create a readable dictionary of all EXIF tags
                full_exif = {}
                for tag, value in exif_raw.items():
                    decoded = TAGS.get(tag, tag)
                    full_exif[decoded] = value

                # 1. Get the Timestamp (DateTimeOriginal)
                # Format is usually "YYYY:MM:DD HH:MM:SS"
                raw_time = full_exif.get("DateTimeOriginal", "Unknown Time")
                # Clean up the format for the UI (e.g., replace : with / in date)
                clean_time = raw_time.replace(":", "/", 2) if raw_time != "Unknown Time" else raw_time

                # 2. Get GPS info (Latitude, Longitude, Altitude)
                gps_info = {}
                gps_data = full_exif.get("GPSInfo")
                if gps_data:
                    for t in gps_data:
                        sub_decoded = GPSTAGS.get(t, t)
                        gps_info[sub_decoded] = gps_data[t]

                if 'GPSLatitude' in gps_info:
                    lat = get_decimal_from_dms(gps_info['GPSLatitude'], gps_info['GPSLatitudeRef'])
                    lon = get_decimal_from_dms(gps_info['GPSLongitude'], gps_info['GPSLongitudeRef'])
                    
                    # Handle Altitude
                    alt = 0
                    if 'GPSAltitude' in gps_info:
                        alt = float(gps_info['GPSAltitude'])
                        # If AltitudeRef is 1, the object is below sea level
                        if gps_info.get('GPSAltitudeRef') == 1:
                            alt = -alt

                    points.append({
                        "lat": float(lat),
                        "lon": float(lon),
                        "alt": alt,
                        "time": clean_time,
                        "img": filename
                    })

            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Sort points by time so the line on the map follows your actual path
    points.sort(key=lambda x: x['time'])

    with open(output_json, 'w') as f:
        json.dump(points, f, indent=4)
    print(f"Successfully parsed {len(points)} photos to {output_json}")

# To test: run this script directly
if __name__ == "__main__":
    extract_trip_data('app/static/photos', 'data/points.json')