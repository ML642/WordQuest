import kagglehub
import pandas as pd
import json
import os

# Download dataset
path = kagglehub.dataset_download("nezahatkk/10-000-english-words-cerf-labelled")
print("Path to dataset files:", path)

# Load CSV
df = pd.read_csv(os.path.join(path, "ENGLISH_CERF_WORDS.csv"))

# Group by CEFR level
data = {}
for level in df['CEFR'].unique():
    words = df[df['CEFR'] == level]['headword'].tolist()
    data[level] = words

# Save JSON
with open("cefr_words.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Saved to cefr_words.json")
