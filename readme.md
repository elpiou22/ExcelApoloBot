# ExcelApoloBot
### Version 1
### 12/2024

## Requirements:

### Software
- [Node.js](https://nodejs.org/en/download/package-manager)

### Libraries
In your project directory:
```bash
npm install discord.js
npm install fs
npm install axios
npm install exceljs
```

## Configuration:
In `./json/config.json`, put your clash of clan api to generate the correct data.
In `./json/config.json`, put your discord api to communicate with your own discord bot.
In `./js/main.js`, update your clan tag (in line ~15) to generate the correct data.
> **Note:** It should be modified in futures versions, keep updated with this project


## Starting
In your project directory:
```bash
node ./js/main.js
```

## After execution
After execution, you should see an Excel file at `./export/v0.xlsx`.

### Data scoring
#### **1**
- 3 stars on any town hall level
- 2 stars on a superior town hall level if all other ones are destroyed
#### **-1**
- The player didn't attack
- 0 star on an equal town hall level
#### **0**
- 0 stars on a superior town hall level
- 2 stars on a equal or inferior town hall level
- 2 stars on a superior town hall level but there's at least one equal town hall left
#### ***blank***
- The player was not present on that war day
- Any other attack -> must be checked manually
> **Note:** The scoring system will be improved in futures versions, keep updated with this project.

---

## Discord Bot
Work In Progress, stay updated !