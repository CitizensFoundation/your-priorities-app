from docx.api import Document
import json
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import _Cell, Table
from docx.text.paragraph import Paragraph

from docx.document import Document as doctwo

def iter_block_items(parent):
    if isinstance(parent, doctwo):
        parent_elm = parent.element.body
    elif isinstance(parent, _Cell):
        parent_elm = parent._tc
    else:
        raise ValueError("something's not right")

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

document = Document("/home/robert/Documents/WorldBank/Surveys/refwforyourinputcovidsocialimpactmonitoringsurve/Comm Rep_Final_ENG_clear_June 9 2020.docx")

survey_items = []

def hasNumbers(inputString):
  return any(char.isdigit() for char in inputString)

def hasBrackets(inputString):
  return any(char=="[" for char in inputString)

def getStringToBracket(inputString):
  return inputString.split("[")[0].strip()

def appendSurveyItem(item):
  print(item)
  survey_items.append(item)

def clean(text):
  return text.strip()

def appendRatio(uniqueId, optionsText, questionText):
  print("RADIOS")
  radios = []
  for option in optionsText:
    number = option[:2].strip().replace(".","")
    #print("Number: "+number)
    text = option[2:].strip()
    #print("Text: "+text)
    isSpecify = False
    skipTo = None
    if text.find("specify")>0:
      isSpecify = True
    if text.find("skip to")>0:
      skipTo = text.split("skip to")[1].strip()
      text = getStringToBracket(text.split("skip to")[0]).strip()
    radios.append({'skipTo': skipTo, 'text': text, 'number': number})
  appendSurveyItem({'type':'radios', 'uniqueId': uniqueId, 'isSpecify': isSpecify, 'radioButtons': radios, 'text': getStringToBracket(questionText)})

def appendCheckbox(uniqueId, optionsText, questionText):
  print("CHECKBOXES")
  checkboxes = []
  for option in optionsText:
    number = option[:2].strip().replace(".","")
    text = option[2:].strip()
    isSpecify = False
    skipTo = None
    if text.find("specify")>0:
      isSpecify = True
    if text.find("skip to")>0:
      skipTo = text.split("skip to")[1].strip()
      text = text.split("skip to")[0].strip()
    checkboxes.append({'skipTo': skipTo, 'text': text, 'number': number})
  appendSurveyItem({'type':'checkboxes', 'uniqueId': uniqueId, 'checkboxes': checkboxes, 'text': getStringToBracket(questionText)})

def splitByDigit(text):
  text = text.strip()
  part = ""
  for char in text:
    if char.isdigit():
      part+="\n"
    part += char
  part+="\n"
  print("PART: "+part)
  return part.strip()

firstCell = True

for block in iter_block_items(document):
    if isinstance(block, Paragraph):
      appendSurveyItem({'type':'textHeader','text': block.text.strip()})
    if isinstance(block, Table):
      table = block
      denseUniqueId = None
      for ri, row in enumerate(table.rows):
        if firstCell==True:
            firstCell=False
            print("Description")
            appendSurveyItem({'type':'textDescription','text': getStringToBracket(row.cells[0].text.strip())})
        elif row.cells[2] and len(row.cells[2].text)>1:
          #print("ROWS"+str(len(table.rows))+" ri: "+str(ri))
          if len(table.rows)>ri+1 and table.rows[ri+1].cells[0].text.strip().startswith("a"):
            denseUniqueId = row.cells[0].text.strip()
            print("DENSE RATIOS: "+denseUniqueId)
            appendSurveyItem({'type':'textDescription','text': getStringToBracket(row.cells[1].text.strip())+" "})
          elif len(row.cells)>3 and row.cells[3].text.strip().startswith("A "):
            appendCheckbox(row.cells[0].text.strip(), row.cells[3].text.split("\n"), row.cells[2].text.strip())
          elif row.cells[2].text.startswith("A "):
            appendCheckbox(row.cells[0].text.strip(), row.cells[2].text.split("\n"), row.cells[1].text.strip())
          elif len(row.cells[0].text.strip())==1:
            appendRatio(denseUniqueId+row.cells[0].text.strip(), splitByDigit(row.cells[3].text).split("\n"), row.cells[1].text.strip())
          elif len(row.cells)>3 and row.cells[3].text.strip().startswith("1 "):
            appendRatio(row.cells[0].text.strip(), row.cells[3].text.split("\n"), row.cells[2].text.strip())
          elif row.cells[2].text.strip().startswith("1 "):
            appendRatio(row.cells[0].text.strip(), row.cells[2].text.split("\n"), row.cells[1].text.strip())
          elif row.cells[0] and len(row.cells[0].text)>3 and len(row.cells[0].text)<6:
            appendSurveyItem({'type':'textField', 'uniqueId': row.cells[0].text.strip(), 'maxLength': 250, 'text': getStringToBracket(row.cells[1].text.strip())})

print(json.dumps(survey_items))
