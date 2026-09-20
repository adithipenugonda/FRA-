import urllib.request

endpoints = [
    ("CartoDB Fastly Dark", "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/7/95/57.png"),
    ("CartoDB Fastly Dark Matter", "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/7/95/57.png"),
    ("CartoDB Rastertiles Dark", "https://a.basemaps.cartocdn.com/rastertiles/dark_all/7/95/57.png"),
    ("CartoDB Dark All", "https://a.basemaps.cartocdn.com/dark_all/7/95/57.png"),
    ("Esri World Dark Gray Canvas", "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/7/57/95"),
    ("Stadia Alidade Smooth Dark", "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/7/95/57.png"),
]

for name, url in endpoints:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            print(f"[{name}] Status: {response.status}, Size: {len(data)} bytes")
    except Exception as e:
        print(f"[{name}] Error: {e}")
