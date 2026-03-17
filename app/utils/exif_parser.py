import os
import json
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def get_decimal_from_dms(dms, ref):
    degrees = dms[0]
    minutes = dms[1] / 60.0
    seconds = dms[2] / 3600.0
    if ref in ['S', 'W']:
        return -(degrees + minutes + seconds)
    return degrees + minutes + seconds

def extract_trip_data(photo_dir, output_json):
    points = []
    
    for filename in os.listdir(photo_dir):
        if filename.lower().endswith(('jpg', 'jpeg')):
            path = os.path.join(photo_dir, filename)
            try:
                img = Image.open(path)
                exif = img._getexif()
                if not exif:
                    continue
                
                # Get GPS info
                info = {}
                for tag, value in exif.items():
                    decoded = TAGS.get(tag, tag)
                    if decoded == "GPSInfo":
                        for t in value:
                            sub_decoded = GPSTAGS.get(t, t)
                            info[sub_decoded] = value[t]
                
                if 'GPSLatitude' in info:
                    lat = get_decimal_from_dms(info['GPSLatitude'], info['GPSLatitudeRef'])
                    lon = get_decimal_from_dms(info['GPSLongitude'], info['GPSLongitudeRef'])
                    points.append({
                        "lat": float(lat),
                        "lon": float(lon),
                        "img": filename
                    })
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    with open(output_json, 'w') as f:
        json.dump(points, f, indent=4)

# To test: run this script directly
if __name__ == "__main__":
    extract_trip_data('app/static/photos', 'data/points.json')