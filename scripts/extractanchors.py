import glob
import os

directories = []
anchors = {}
for filename in glob.glob("./*", recursive = True):
    if (os.path.isdir(filename)) :
      directories.append(filename)

for filename in directories:
    anchors[filename] = [{
        "href": filename[2:],
        "level": 1
    }]
    
    with open(os.path.join(filename, "page.mdx"), 'r', encoding = 'utf-8', newline='') as file:
        for line in file.readlines():
            if(line[0] != "#"):
                continue
            end = line.rfind("]")
            start = line[:end].rfind("[")
            if(start == end): # start == end == -1
                continue
            if(line[start-2:start]=="# "): # ...# [...] 
                continue
            anchors[filename].append({
                "href": line[(start+1):(end)],
                "level": line.count("#")
            })

for filename in anchors:
   if(len(anchors[filename]) > 0):
       print(f"{filename[2:]}: {anchors[filename]}")
