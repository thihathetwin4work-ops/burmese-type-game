from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Burmese word bank (Simple to Complex)
WORD_BANK = [
    # Original 10
    "နေကောင်းလား", "မင်္ဂလာပါ", "ကျောင်း", "စာအုပ်", "ကွန်ပျူတာ", 
    "မြန်မာ", "ထမင်းစား", "ပျော်ရွှင်", "အလုပ်", "သူငယ်ချင်း",
    
    # 1. Nature & Environment (Short/Medium)
    "နေကြာပန်း", "သစ်ပင်", "ကောင်းကင်", "ပင်လယ်", "မိုးတိမ်", 
    "ပန်းသီး", "ရေတံခွန်", "သဘာဝ", "လမင်း", "ကြယ်စင်",

    # 2. Technology & Education (Medium)
    "အင်တာနက်", "ဖုန်းနံပါတ်", "ဆော့ဖ်ဝဲ", "သင်ခန်းစာ", "စာကြည့်တိုက်", 
    "သုတေသန", "ပညာရေး", "နည်းပညာ", "ဝက်ဘ်ဆိုက်", "အချက်အလက်",

    # 3. Daily Life & Emotions (Medium)
    "ကျန်းမာရေး", "ဈေးဝယ်", "ခရီးသွား", "မိသားစု", "နံနက်စာ", 
    "ချစ်ခြင်း", "စိတ်ကူး", "အောင်မြင်", "ကြိုးစား", "ဝါသနာ",

    # 4. Places & Objects (Medium)
    "ဆေးရုံ", "ဘူတာရုံ", "လေဆိပ်", "စားသောက်ဆိုင်", "ပန်းခြံ", 
    "ရုပ်ရှင်", "နိုင်ငံခြား", "မီးဖိုချောင်", "ဧည့်ခန်း", "ရုံးခန်း",

    # 5. Complex/Long Words (Challenge Mode)
    "ဒီမိုကရေစီ", "အနာဂတ်", "ယဉ်ကျေးမှု", "လွတ်လပ်ရေး", "စည်းလုံးခြင်း", 
    "စွန့်ဦးတီထွင်", "အမှတ်တရ", "တာဝန်ယူမှု", "လူမှုရေး", "ဂုဏ်ယူပါတယ်"
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/words')
def get_words():
    # Shuffles words so every game session is different
    words = random.sample(WORD_BANK, len(WORD_BANK))
    return jsonify(words)

if __name__ == '__main__':
    app.run(debug=True)