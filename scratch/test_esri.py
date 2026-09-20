import urllib.request

test_urls = [
    ("Esri Dark Gray Canvas", "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/7/57/95"),
    ("CartoDB Dark Matter no sub", "https://a.basemaps.cartocdn.com/dark_all/7/95/57.png"),
    ("CartoDB Dark Matter Voyager", "https://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/7/95/57.png"),
    ("OSM Bright Dark (CyclOSM)", "https://a.tile-cyclosm.openstreetmap.fr/cyclosm/7/95/57.png")
]

for name, url in test_urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            print(f"[{name}] Status: {resp.status}, Bytes: {len(data)}")
    except Exception as e:
        print(f"[{name}] Error: {e}")
