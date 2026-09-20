import urllib.request

urls = [
    ("Esri Dark Gray Canvas", "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/7/57/95"),
    ("OpenStreetMap Standard", "https://a.tile.openstreetmap.org/7/95/57.png")
]

for name, url in urls:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        print(f"[{name}] Status: {resp.status}, Content-Type: {resp.headers.get('Content-Type')}, Size: {len(resp.read())} bytes")
