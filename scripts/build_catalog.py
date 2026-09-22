import json
import os
import sys

# Import our data modules
from generate_movies import TELUGU_MOVIES
from hindi_data import HINDI_MOVIES
from tamil_data import TAMIL_MOVIES
from kannada_data import KANNADA_MOVIES
from english_data import ENGLISH_MOVIES
from tv_data import TV_SHOWS

def process_movie(m, lang_code, lang_label, is_tv=False):
    year = m.get("year", "2023")
    release_date = f"{year}-06-15"
    media_type = "tv" if is_tv else "movie"
    title = m.get("title", m.get("name", "Untitled"))
    
    obj = {
        "id": m["id"],
        "title": title,
        "overview": m["overview"],
        "poster_path": m["poster"],
        "backdrop_path": m["backdrop"],
        "vote_average": float(m.get("rating", 7.5)),
        "vote_count": int(m.get("rating", 7.5) * 600),
        "genre_ids": m.get("genres", [28]),
        "popularity": float(round(m.get("rating", 7.5) * 45 + 100, 1)),
        "media_type": media_type,
        "original_language": lang_code,
        "language_label": lang_label,
        "release_date": release_date,
    }
    if is_tv:
        obj["name"] = m.get("name", title)
        obj["first_air_date"] = release_date
    return obj

telugu_processed = [process_movie(m, "te", "Telugu") for m in TELUGU_MOVIES]
hindi_processed = [process_movie(m, "hi", "Hindi") for m in HINDI_MOVIES]
tamil_processed = [process_movie(m, "ta", "Tamil") for m in TAMIL_MOVIES]
kannada_processed = [process_movie(m, "kn", "Kannada") for m in KANNADA_MOVIES]
tv_processed = [process_movie(m, "en", "English", is_tv=True) for m in TV_SHOWS]

# Split English into eras
english_all = [process_movie(m, "en", "English") for m in ENGLISH_MOVIES]

classics_70s_80s = [m for m in english_all if int(m["release_date"][:4]) < 1990]
movies_90s = [m for m in english_all if 1990 <= int(m["release_date"][:4]) < 2000]
movies_2000s = [m for m in english_all if 2000 <= int(m["release_date"][:4]) < 2010]
movies_2010s = [m for m in english_all if 2010 <= int(m["release_date"][:4]) < 2020]
movies_2020s = [m for m in english_all if int(m["release_date"][:4]) >= 2020]

total_count = (
    len(telugu_processed) +
    len(hindi_processed) +
    len(tamil_processed) +
    len(kannada_processed) +
    len(english_all) +
    len(tv_processed)
)

print(f"Catalog Summary:")
print(f"  Telugu:   {len(telugu_processed)}")
print(f"  Hindi:    {len(hindi_processed)}")
print(f"  Tamil:    {len(tamil_processed)}")
print(f"  Kannada:  {len(kannada_processed)}")
print(f"  English:  {len(english_all)}")
print(f"    - 70s/80s Classics: {len(classics_70s_80s)}")
print(f"    - 90s Golden Era:   {len(movies_90s)}")
print(f"    - 2000s Cinema:     {len(movies_2000s)}")
print(f"    - 2010s Hits:       {len(movies_2010s)}")
print(f"    - 2020s Latest:     {len(movies_2020s)}")
print(f"  TV Shows: {len(tv_processed)}")
print(f"  TOTAL:    {total_count} titles")

def to_ts_array(arr, const_name):
    lines = [f"export const {const_name}: Movie[] = ["]
    for item in arr:
        # format object
        lines.append("  {")
        for k, v in item.items():
            if isinstance(v, str):
                safe_str = json.dumps(v)
                lines.append(f"    {k}: {safe_str},")
            elif isinstance(v, (int, float)):
                lines.append(f"    {k}: {v},")
            elif isinstance(v, list):
                lines.append(f"    {k}: {json.dumps(v)},")
        lines.append("  },")
    lines.append("];\n")
    return "\n".join(lines)

ts_content = """// MovieArena Official Curated Cinema Database
// Contains 370+ curated titles across English, Telugu, Hindi, Tamil, Kannada & TV Series
import type { Movie } from "./movies.functions";

"""

ts_content += to_ts_array(telugu_processed, "CURATED_TELUGU_MOVIES")
ts_content += to_ts_array(hindi_processed, "CURATED_HINDI_MOVIES")
ts_content += to_ts_array(tamil_processed, "CURATED_TAMIL_MOVIES")
ts_content += to_ts_array(kannada_processed, "CURATED_KANNADA_MOVIES")
ts_content += to_ts_array(classics_70s_80s, "CURATED_CLASSICS_70S_80S")
ts_content += to_ts_array(movies_90s, "CURATED_MOVIES_90S")
ts_content += to_ts_array(movies_2000s, "CURATED_MOVIES_2000S")
ts_content += to_ts_array(movies_2010s, "CURATED_MOVIES_2010S")
ts_content += to_ts_array(movies_2020s, "CURATED_MOVIES")
ts_content += to_ts_array(tv_processed, "CURATED_TV_SHOWS")

ts_content += """
export const ALL_CURATED_MOVIES: Movie[] = [
  ...CURATED_TELUGU_MOVIES,
  ...CURATED_HINDI_MOVIES,
  ...CURATED_TAMIL_MOVIES,
  ...CURATED_KANNADA_MOVIES,
  ...CURATED_MOVIES,
  ...CURATED_MOVIES_2010S,
  ...CURATED_MOVIES_2000S,
  ...CURATED_MOVIES_90S,
  ...CURATED_CLASSICS_70S_80S,
  ...CURATED_TV_SHOWS,
];

export const TOTAL_CURATED_COUNT = ALL_CURATED_MOVIES.length;
"""

target_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "lib", "movieCatalog.ts"))
with open(target_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Wrote {len(ts_content)} bytes to {target_path}")
