import pandas as pd
import json

with open('../config/config.txt', 'r') as configfile:
    datafilepath = configfile.readline()

file = open(datafilepath, encoding="utf-8")
data = json.load(file)

df = pd.DataFrame(data)
df['tags'] = df['tags'].apply(lambda x: x[0] if len(x)>0 else 'untagged')
df['persons'] = df['persons'].apply(lambda x: ','.join(x))

df.to_csv('tt.csv')
print(df)