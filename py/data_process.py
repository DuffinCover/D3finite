from doctest import OutputChecker
import pandas as pd
import json

input_path = '../data/UCS-Satellite-Database-5-1-2022.csv'
input_csv = '../data/UCS-Satellite-Database-5-1-2022.xls'
output_path = '../data/satellites.json'

df = pd.read_excel(input_csv)


h = df.head(10)

print(h)

#for idx,r in df.rows:
#    pass

named_cols = [name for name in list(df.columns)[:28] if name != 'Date of Launch']

#for col in named_cols:
#    print(col)

filtered = df.filter(named_cols,axis = 1).fillna("")



df_dict = filtered.T.to_dict()

df_list = [v for v in df_dict.values()]

end = df_list[:-2]

for i in end:
    print(i)

with open(output_path,'w') as outfile:


    js_obj = json.dump(df_list,outfile)


#c_data = [df[c] for c in named_cols]
#c_zip = zip(c_data)

#result = [row[1] for row in c_zip]

pass