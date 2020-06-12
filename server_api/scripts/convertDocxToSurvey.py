from docx.api import Document
import json

document = Document("/home/robert/Documents/WorldBank/Surveys/refwforyourinputcovidsocialimpactmonitoringsurve/Comm Rep_Final_ENG_clear_June 9 2020.docx")

def hasNumbers(inputString):
  return any(char.isdigit() for char in inputString)

def hasBrackets(inputString):
  return any(char=="[" for char in inputString)

def getStringToBracket(inputString):
  return inputString.split("[")[0]

keys = None
survey_items = []
for ti, table in enumerate(document.tables):
  for ri, row in enumerate(table.rows):
      type = None

      if row.cells[2] and len(row.cells[2].text)>1:
        if row.cells[2].text.startswith("1 ") and table.rows[ri+1] and table.rows[ri+1].cells[0].text.startswith("a"):
          survey_items.append({'type':'textDescription','text': getStringToBracket(row.cells[1])+" "})
        elif row.cells[2].text.startswith("A "):
          checkboxes = []
          for option in row.cells[2].text.split("\n"):
            number = option[:2].strip()
            text = option[2:].strip()
            isSpecify = False
            skipTo = None
            if text.find("specify"):
              isSpecify = True
            if text.find("skip to"):
              skipTo = text.split("skip to")
            checkboxes.append({'skipTo': skipTo, 'text': text, 'number': number})
          survey_items.append({'type':'checkboxes', 'uniqueId': row.cells[0].text, 'checkboxes': checkboxes, 'text': getStringToBracket(row.cells[1].text)})
        elif row.cells[2].text.startswith("1 "):
          radios = []
          for option in row.cells[2].text.split("\n"):
            number = option[:2].strip().strip(".")
            print("Number: "+number)
            text = option[2:].strip()
            print("Text: "+text)
            isSpecify = False
            skipTo = None
            if text.find("specify"):
              isSpecify = True
            if text.find("skip to"):
              skipTo = text.split("skip to")
            radios.append({'skipTo': skipTo, 'text': text, 'number': number})
          survey_items.append({'type':'radios', 'uniqueId': row.cells[0].text, 'radios': radios, 'text': getStringToBracket(row.cells[1].text)})
        elif row.cells[0] and len(row.cells[0].text)>4 and len(row.cells[0].text)<6:
          survey_items.append({'type':'textField', 'uniqueId': row.cells[0].text, 'maxLength': 250, 'text': getStringToBracket(row.cells[1].text)})
      print(json.dumps(survey_items))

print(json.dumps(survey_items))
