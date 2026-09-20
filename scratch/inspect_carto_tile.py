import urllib.request
import os

env_path = r"c:\Users\DELL\Desktop\PROJECTS\FRA\frontend\.env"
key = ""
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            if line.startswith("VITE_CARTO_API_KEY="):
                key = line.split("=", 1)[1].strip()

print(f"Key loaded from .env: '{key}'")
print(f"Is placeholder 'YOUR_KEY_HERE': {key == 'YOUR_KEY_HERE'}")

# Test requesting a tile from CARTO dark basemap
tile_url = f"https://a.basemaps.cartocdn.com/dark_all/7/95/57.png?key={key}"
print(f"Requesting URL (key redacted in output): https://a.basemaps.cartocdn.com/dark_all/7/95/57.png?key=[REDACTED]")

req = urllib.request.Request(
    tile_url,
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
)

try:
    with urllib.request.urlopen(req) as response:
        status = response.status
        content_type = response.headers.get("Content-Type")
        body = response.read()
        print(f"HTTP Status: {status}")
        print(f"Content-Type: {content_type}")
        print(f"Tile image size: {len(body)} bytes")
except Exception as e:
    print(f"Error fetching tile: {e}")
