#Python script that scrapes list of birds from Wikipedia and saves them to ts file as JSON
#saves as array of groups with each element in format
#{
#  "name": "name of group",
#  "birds": [
#    ["bird1 name", "bird1 alternative name"],
#    ["bird2 name", "bird2 alternative name"],
#    ...
#  ]
#}

from bs4 import BeautifulSoup
import requests
import re
import json

url = "https://en.wikipedia.org/wiki/List_of_birds_of_Wales"

request = requests.get("https://en.wikipedia.org/wiki/List_of_birds_of_Wales") #retrieve page

soup = BeautifulSoup(request.text, 'html.parser') #parse page

data = {}

for element in soup.find_all(['table', 'h2']): #for table and heading in page
    if element.name == 'table': #if table encountered
        for row in element.find_all('tr'): #for row in table
            columns = row.find_all('td') #get columns in row
            if len(columns) == 3 and 'BR' not in columns[2] and 'WR' not in columns[2]: #if 3 columns and not rarity
                columnText = [c.text for c in columns] #get text from columns
                bird = [columnText[0].replace('(','').replace(')','')] #add name to list of names for current bird
                if '(' in columnText[0]: #if word is bracketed
                    bird.append(re.sub("\(.*\) ", "", columnText[0])) #also add name with bracketed word remove
                elif 'European' in columnText[0]: #if European in name
                    bird.append(columnText[0].replace('European ', '')) #add name without European
                data[currentGroup].append(bird) #add list of bird names to current group
    if element.name == 'h2': #if heading encountered
        currentGroup = element.text.replace('[edit]', '') #set current group to heading name
        data[currentGroup] = []

output = []
for group, birds in data.items():
    if len(birds) > 0:
        output.append({'name':group, 'birds':birds})

with open('src/birdLists.ts', 'w') as file:
    file.write('export var birdLists = '+ json.dumps(output, indent=2))
    file.close()
