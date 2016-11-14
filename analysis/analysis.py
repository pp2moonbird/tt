import pandas as pd
import json

with open('../config/config.txt', 'r') as configfile:
    datafilepath = configfile.readline()

file = open(datafilepath, encoding="utf-8")
data = json.load(file)

print(data)
print(type(data))
df = pd.DataFrame(data)
df.to_csv('tt.csv')
print(df)