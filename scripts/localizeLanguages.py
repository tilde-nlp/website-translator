import requests
import xmltodict
import pathlib
import regex as re
import json
import subprocess

from os import listdir
from os.path import isfile, join

localization_file_dir = "src/localization/languages"

languages= {
    'ar', 
    'bg', 
    'cs', 
    'da', 
    'de', 
    'el', 
    'en', 
    'es', 
    'et', 
    'fi', 
    'fr', 
    'ga', 
    'hr', 
    'hu', 
    'is', 
    'it', 
    'ja', 
    'lt', 
    'lv', 
    'mt', 
    'nb', 
    'nl', 
    'nn', 
    'pl', 
    'pt', 
    'ro', 
    'ru', 
    'sk', 
    'sl', 
    'sv', 
    'uk',
    'zh'
}


def fetch_localization(language_code):
    localization_repo_url = f"https://raw.githubusercontent.com/unicode-org/cldr/main/common/main/{language_code}.xml"
    
    response = requests.get(localization_repo_url)
    data = xmltodict.parse(response.content)

    return data["ldml"]["localeDisplayNames"]["languages"]["language"]

def filter_localization(localization):
    update = {} 
    for language in localization:
        lang_code = language["@type"]
        if(lang_code in languages):
            lang_name = str(language["#text"])
            lang_name = lang_name[0].upper() + lang_name[1:]

            update[lang_code] = lang_name
    return update

def write_localization(update, file_name):
    with open(file_name, mode="r", encoding="utf-8") as file:
        contents = file.read()
        contents = re.sub(r"languages:\s({[^}]*})", f"languages: {json.dumps(update)}", contents)

    with open(file_name, mode="w", encoding="utf-8") as file:
        file.write(contents)


for file in listdir(localization_file_dir):
    file_path = join(localization_file_dir, file)
    if(isfile(file_path)):
        language_code = pathlib.Path(file).stem

        localization = fetch_localization(language_code)
        update = filter_localization(localization)

        print(f"Language: {language_code}")
        write_localization(update, file_path)

subprocess.run(["npm", "run", "lint:fix"], shell=True)