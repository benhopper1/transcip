import os
# print max([f for f in os.listdir('/') if f.lower().endswith('.*')], key=os.path.getctime)
a = os.listdir('/'), os.path.getctime()
print a