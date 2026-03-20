import re
from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app)
 
# ─── DB connection ────────────────────────────────────────────────────────────
def get_db():
    return mysql.connector.connect(
        host="db",
        user="user_pfe",
        password="user_password",
        database="PFE-database"
    )
 
# ══════════════════════════════════════════════════════════════════════════════
# BILINGUAL SYNONYM MAP  (FR ↔ EN → single canonical token)
# ══════════════════════════════════════════════════════════════════════════════
SYNONYM_GROUPS = [
    (["chaussure","chaussures","shoe","shoes","basket","baskets",
      "sneaker","sneakers","botte","bottes","boot","boots",
      "sandale","sandales","mocassin","loafer","talon","escarpin",
      "retro","rétro","samba","running","trail"], "shoe"),
 
    (["chemise","shirt","chemisier","blouse","top","tops",
      "tshirt","t-shirt","tee","polo","tunique","tunic"], "shirt"),
 
    (["pantalon","pants","trouser","trousers","jean","jeans",
      "denim","jogger","jogging","legging","leggings",
      "short","shorts","bermuda"], "pants"),
 
    (["veste","jacket","veston","blouson","manteau","coat",
      "trench","parka","doudoune","puffy","imperméable"], "jacket"),
 
    (["pull","pullover","sweat","sweatshirt","hoodie","sweater",
      "gilet","cardigan","tricot","knit"], "sweater"),
 
    (["robe","dress","jupe","skirt","combinaison","jumpsuit",
      "combi","salopette","overall"], "dress"),
 
    (["sac","bag","sacoche","handbag","pochette","clutch",
      "cartable","backpack","valise","luggage","bagage"], "bag"),
 
    (["montre","watch","watches","smartwatch","chrono"], "watch"),
 
    (["bijou","bijoux","jewelry","collier","necklace","bracelet",
      "bague","ring","boucle","earring","pendentif","chaine"], "jewelry"),
 
    (["ceinture","belt","portefeuille","wallet","porte-carte"], "belt"),
 
    (["lunette","lunettes","glasses","sunglasses","eyewear"], "glasses"),
 
    (["parfum","perfume","fragrance","eau de toilette","cologne"], "perfume"),
 
    (["cosmetique","cosmetics","maquillage","makeup","fond de teint",
      "rouge a levres","lipstick","mascara","blush","serum",
      "creme","cream","soin","skincare","lotion","hydratant"], "cosmetic"),
 
    (["electronique","electronic","telephone","phone","smartphone",
      "mobile","iphone","android","ordinateur","computer","laptop",
      "tablette","tablet","ecouteur","earphone","airpods",
      "casque","headphone","speaker","enceinte","bluetooth"], "electronic"),
 
    (["maison","home","meuble","furniture","canape","sofa",
      "chaise","chair","table","bureau","lit","bed",
      "decoration","decor","tapis","rug","rideau","coussin",
      "lampe","lamp"], "home"),
 
    (["cuisine","kitchen","casserole","poele","couteau","couvert",
      "cafetiere","mixeur","blender","robot","friteuse",
      "micro-ondes","microwave"], "kitchen"),
 
    (["sport","fitness","gym","musculation","yoga","running",
      "course","velo","bike","football","tennis","natation",
      "haltere","dumbbell","tapis de course"], "sport"),
 
    (["bebe","baby","enfant","kid","kids","jouet","toy",
      "poussette","couche","biberon"], "baby"),
 
    (["livre","book","cahier","notebook","stylo","pen",
      "papeterie","stationery"], "book"),
 
    (["jeu","jeux","game","gaming","console","playstation",
      "xbox","nintendo","manette","controller"], "game"),
 
    # Colors
    (["noir","black","noire"], "black"),
    (["blanc","white","blanche"], "white"),
    (["rouge","red"], "red"),
    (["bleu","blue","bleue"], "blue"),
    (["vert","green","verte"], "green"),
    (["rose","pink"], "pink"),
    (["gris","grey","gray","grise"], "grey"),
    (["marron","brown","brun","brune"], "brown"),
    (["beige","creme","cream","ivory"], "beige"),
    (["or","gold","dore","doree"], "gold"),
    (["argent","silver"], "silver"),
 
    # Materials
    (["cuir","leather","suede","daim"], "leather"),
    (["coton","cotton"], "cotton"),
    (["laine","wool","cachemire","cashmere"], "wool"),
    (["velours","velvet"], "velvet"),
 
    # Gender
    (["homme","men","man","masculin","male"], "men"),
    (["femme","women","woman","feminin","female"], "women"),
    (["enfant","kid","kids","garcon","boy","fille","girl"], "kids"),
]
 
_SYN = {}
for group, canonical in SYNONYM_GROUPS:
    for word in group:
        key = re.sub(r'[^a-z0-9]', '', word.lower())
        _SYN[key] = canonical
 
STOP_WORDS = {
    'de','du','des','le','la','les','un','une','pour','avec','en',
    'et','ou','au','aux','sur','par','dans','a','l','d','s','y',
    'ce','se','sa','son','ses','mon','ton','ma','ta','mes','tes',
    'qui','que','dont','mais','donc','or','ni','car',
    'plus','tres','bien','bon','bonne','bons',
    'nouveau','nouvelle','grand','grande','petit','petite',
    'the','a','an','for','and','with','in','of','to','by','at',
    'on','is','are','its','this','that','new','good','best',
    'lot','set','pack','kit','piece','pcs','pieces',
    'collection','serie','model','modele','style','type','design',
    'qualite','quality','premium','luxe','luxury','original',
    'generique','import','importe',
    '2024','2025','2026',
}
 
# ─── Text pipeline ────────────────────────────────────────────────────────────
def clean_text(text):
    if not isinstance(text, str) or not text.strip():
        return ""
    text = text.lower()
    accent_map = str.maketrans(
        "àáâãäåçèéêëìíîïñòóôõöùúûüýÿæœðþ",
        "aaaaaaceeeeiiiinooooouuuuyyaodp"
    )
    text = text.translate(accent_map)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text
 
def normalize_synonyms(text):
    tokens = text.split()
    result = []
    i = 0
    while i < len(tokens):
        if i + 1 < len(tokens):
            bigram = re.sub(r'[^a-z0-9]', '', tokens[i] + tokens[i+1])
            if bigram in _SYN:
                result.append(_SYN[bigram])
                i += 2
                continue
        key = re.sub(r'[^a-z0-9]', '', tokens[i])
        result.append(_SYN.get(key, tokens[i]))
        i += 1
    return ' '.join(result)
 
def extract_keywords(text):
    cleaned = clean_text(text)
    tokens  = [t for t in cleaned.split() if t not in STOP_WORDS and len(t) > 1]
    return normalize_synonyms(' '.join(tokens))
 
# ══════════════════════════════════════════════════════════════════════════════
# LOAD DATA — uses YOUR exact table/column names
# ══════════════════════════════════════════════════════════════════════════════
def load_data():
    db     = get_db()
    cursor = db.cursor(dictionary=True)
 
    # ── Products + category name + first image from Product_Images ──────────
    # Your schema: product has no img_url column — images are in Product_Images
    cursor.execute("""
        SELECT
            p.id_product,
            p.nom_produit,
            p.description,
            p.prix,
            p.stock,
            p.views,
            p.id_categorie,
            c.nom_categorie,
            (
                SELECT pi.img_url
                FROM Product_Images pi
                WHERE pi.prod_ID = p.id_product
                LIMIT 1
            ) AS img_url
        FROM product p
        LEFT JOIN categorie c ON p.id_categorie = c.id_categorie
    """)
    products = cursor.fetchall()
 
    # ── Co-purchase from Ligne_Commande + commande (your real table names) ───
    try:
        cursor.execute("""
            SELECT lc.id_produit AS id_product, c.id_user
            FROM Ligne_Commande lc
            JOIN commande c ON lc.id_commande = c.id_commande
        """)
        orders = cursor.fetchall()
    except Exception as e:
        print(f"[co-purchase load] {e}")
        orders = []
 
    # ── View history from historique_de_consultation ─────────────────────────
    try:
        cursor.execute("""
            SELECT id_produit AS id_product, id_utilisateur AS id_user
            FROM historique_de_consultation
        """)
        history = cursor.fetchall()
    except Exception as e:
        print(f"[history load] {e}")
        history = []
 
    cursor.close()
    db.close()
    return products, orders, history
 
 
# ══════════════════════════════════════════════════════════════════════════════
# BUILD FEATURE MATRICES
# ══════════════════════════════════════════════════════════════════════════════
def build_model(products, orders, history):
    df = pd.DataFrame(products)
    if df.empty:
        return None
 
    n = len(df)
 
    # ── Popularity score: based on views + consultation history ──────────────
    df['views'] = pd.to_numeric(df['views'], errors='coerce').fillna(0)
    max_views   = df['views'].max() if df['views'].max() > 0 else 1
    df['popularity'] = df['views'] / max_views
 
    # ── Boost popularity with unique user views from historique_de_consultation
    if history:
        hist_df     = pd.DataFrame(history)
        view_counts = hist_df.groupby('id_product')['id_user'].nunique().reset_index()
        view_counts.columns = ['id_product', 'unique_views']
        df = df.merge(view_counts, on='id_product', how='left')
        df['unique_views'] = df['unique_views'].fillna(0)
        max_uv = df['unique_views'].max() if df['unique_views'].max() > 0 else 1
        # 70% raw views + 30% unique visitors
        df['popularity'] = (df['popularity'] * 0.7) + (df['unique_views'] / max_uv * 0.3)
    else:
        df['unique_views'] = 0
 
    # ── Text features ─────────────────────────────────────────────────────────
    df['kw_name']    = df['nom_produit'].apply(extract_keywords)
    df['kw_desc']    = df['description'].apply(extract_keywords)
    df['kw_cat']     = df['nom_categorie'].apply(clean_text)
    df['clean_name'] = df['nom_produit'].apply(clean_text)
 
    # Combined text: title + description keywords + category repeated 2x
    # (category repeated to boost same-category grouping, but only 2x not 3x
    #  so cross-category popular products can still compete)
    df['combined'] = (
        df['kw_name']  + ' ' +
        df['kw_desc']  + ' ' +
        df['kw_cat']   + ' ' + df['kw_cat']
    )
 
    # Word-level TF-IDF on combined field
    tfidf_w = TfidfVectorizer(analyzer='word', ngram_range=(1, 2),
                               min_df=1, max_features=8000)
    # Char-level TF-IDF on raw name (catches partial matches)
    tfidf_c = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5),
                               min_df=1, max_features=5000)
 
    mat_w = tfidf_w.fit_transform(df['combined'])
    mat_c = tfidf_c.fit_transform(df['clean_name'])
 
    sim_word = cosine_similarity(mat_w)
    sim_char = cosine_similarity(mat_c)
 
    # Blend: 65% word (meaning) + 35% char (morphology)
    text_sim = (sim_word * 0.65) + (sim_char * 0.35)
 
    # ── Category matrix: 1 if same category, 0 otherwise ────────────────────
    cat_ids   = df['id_categorie'].values
    cat_boost = (cat_ids[:, None] == cat_ids[None, :]).astype(float)
 
    # ── Price proximity ───────────────────────────────────────────────────────
    prices = pd.to_numeric(df['prix'], errors='coerce').fillna(0).values.astype(float)
    with np.errstate(divide='ignore', invalid='ignore'):
        p_min = np.minimum(prices[:, None], prices[None, :])
        p_max = np.maximum(prices[:, None], prices[None, :])
        price_sim = np.where(p_max > 0, p_min / p_max, 0.5)
 
    # ── Co-purchase matrix from Ligne_Commande ────────────────────────────────
    co_mat = np.zeros((n, n))
    if orders:
        ord_df   = pd.DataFrame(orders)
        id2idx   = {int(row['id_product']): idx for idx, row in df.iterrows()}
        by_user  = ord_df.groupby('id_user')['id_product'].apply(list)
        for prods in by_user:
            idxs = [id2idx[int(p)] for p in prods if int(p) in id2idx]
            for a in idxs:
                for b in idxs:
                    if a != b:
                        co_mat[a][b] += 1
        co_max = co_mat.max()
        if co_max > 0:
            co_mat /= co_max
 
    return df, text_sim, cat_boost, price_sim, co_mat
 
 
# ══════════════════════════════════════════════════════════════════════════════
# CORE RECOMMENDATION LOGIC
# ══════════════════════════════════════════════════════════════════════════════
def get_recommendations(product_id, n_results=8):
    try:
        products, orders, history = load_data()
        result = build_model(products, orders, history)
 
        if result is None:
            return None
 
        df, text_sim, cat_boost, price_sim, co_mat = result
 
        if product_id not in df['id_product'].values:
            return None
 
        idx    = df[df['id_product'] == product_id].index[0]
        n      = len(df)
 
        candidates = []
 
        for j in range(n):
            if int(df.iloc[j]['id_product']) == product_id:
                continue
 
            s_text    = float(text_sim[idx][j])
            s_cat     = float(cat_boost[idx][j])   # 1 = same cat, 0 = different
            s_price   = float(price_sim[idx][j])
            s_copurch = float(co_mat[idx][j])
            s_pop     = float(df.iloc[j]['popularity'])
 
            # ── Scoring formula ───────────────────────────────────────────
            # Key design decision:
            #   - Category is a BONUS (0.20), not a gate
            #   - Popularity has HIGH weight (0.35) so views/sales always
            #     push products up regardless of category
            #   - Text similarity is meaningful but not dominant
            #   - Co-purchase beats everything when available
 
            if s_copurch > 0:
                score = (
                    s_text    * 0.20 +
                    s_cat     * 0.15 +
                    s_price   * 0.10 +
                    s_copurch * 0.30 +
                    s_pop     * 0.25
                )
            else:
                score = (
                    s_text  * 0.25 +
                    s_cat   * 0.20 +
                    s_price * 0.10 +
                    s_pop   * 0.45   # ← popularity is the main driver when
                                     #   no purchase history exists
                )
 
            candidates.append({
                "idx":       j,
                "id":        int(df.iloc[j]['id_product']),
                "nom":       df.iloc[j]['nom_produit'],
                "prix":      float(df.iloc[j]['prix'] or 0),
                "categorie": df.iloc[j]['nom_categorie'],
                "img_url":   df.iloc[j]['img_url'] or "",
                "views":     int(df.iloc[j]['views']),
                "score":     round(score, 4),
                "text_sim":  round(s_text, 4),
                "is_same_cat": bool(s_cat > 0),
                "popularity":  round(s_pop, 4),
                "co_purchased": round(s_copurch, 4),
            })
 
        # ── Sort all candidates by final score ────────────────────────────
        candidates.sort(key=lambda x: x['score'], reverse=True)
 
        # ── Guaranteed diversity: always include 2 cross-category popular ─
        # This ensures products with high views from OTHER categories
        # always appear, even if same-cat products dominate the score.
        cross_cat = [c for c in candidates if not c['is_same_cat']]
        cross_cat_by_pop = sorted(cross_cat, key=lambda x: x['popularity'], reverse=True)
        guaranteed = cross_cat_by_pop[:2]
        guaranteed_ids = {c['id'] for c in guaranteed}
 
        # Fill remaining slots from top-scored list (skipping guaranteed ones)
        remaining = [c for c in candidates if c['id'] not in guaranteed_ids]
        remaining = remaining[:n_results - len(guaranteed)]
 
        # Merge and re-sort by score
        pool = remaining + guaranteed
        pool.sort(key=lambda x: x['score'], reverse=True)
 
        # ── Human-readable match level ────────────────────────────────────
        for item in pool:
            if item['co_purchased'] > 0.3:
                item['match_level'] = "Frequently Bought Together"
            elif item['is_same_cat'] and item['text_sim'] > 0.25:
                item['match_level'] = "Top Recommendation"
            elif item['is_same_cat']:
                item['match_level'] = "Same Category"
            elif item['popularity'] > 0.4:
                item['match_level'] = "Trending & Popular"
            elif item['text_sim'] > 0.15:
                item['match_level'] = "Similar Style"
            else:
                item['match_level'] = "You Might Like"
 
            # Remove internal fields
            del item['idx']
            del item['is_same_cat']
 
        return pool
 
    except Exception as e:
        import traceback
        print(f"[AI Engine Error] {e}")
        traceback.print_exc()
        return None
 
 
# ══════════════════════════════════════════════════════════════════════════════
# TRENDING endpoint — uses views + order history
# ══════════════════════════════════════════════════════════════════════════════
def get_trending(n=10):
    try:
        db     = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                p.id_product,
                p.nom_produit,
                p.prix,
                p.views,
                p.id_categorie,
                c.nom_categorie,
                (
                    SELECT pi.img_url
                    FROM Product_Images pi
                    WHERE pi.prod_ID = p.id_product
                    LIMIT 1
                ) AS img_url,
                COUNT(lc.id_ligne) AS order_count
            FROM product p
            LEFT JOIN categorie c   ON p.id_categorie  = c.id_categorie
            LEFT JOIN Ligne_Commande lc ON lc.id_produit = p.id_product
            GROUP BY p.id_product
            ORDER BY (p.views * 0.6 + COUNT(lc.id_ligne) * 0.4) DESC
            LIMIT %s
        """, (n,))
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        return rows
    except Exception as e:
        print(f"[Trending Error] {e}")
        return []
 
 
# ══════════════════════════════════════════════════════════════════════════════
# CATEGORY BESTSELLERS  — uses your categorie + Product_Images tables
# ══════════════════════════════════════════════════════════════════════════════
def get_category_bestsellers(category_id, exclude_id, n=6):
    try:
        db     = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                p.id_product,
                p.nom_produit,
                p.prix,
                p.views,
                c.nom_categorie,
                (
                    SELECT pi.img_url
                    FROM Product_Images pi
                    WHERE pi.prod_ID = p.id_product
                    LIMIT 1
                ) AS img_url
            FROM product p
            LEFT JOIN categorie c ON p.id_categorie = c.id_categorie
            WHERE p.id_categorie = %s AND p.id_product != %s
            ORDER BY p.views DESC
            LIMIT %s
        """, (category_id, exclude_id, n))
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        return rows
    except Exception as e:
        print(f"[Category Bestsellers Error] {e}")
        return []
 
 
# ══════════════════════════════════════════════════════════════════════════════
# API ROUTES
# ══════════════════════════════════════════════════════════════════════════════
 
@app.route('/recommend/<int:product_id>', methods=['GET'])
def recommend_api(product_id):
    n   = request.args.get('n', 8, type=int)
    n   = max(1, min(n, 20))
    res = get_recommendations(product_id, n_results=n)
    if res is None:
        return jsonify({"success": False, "message": "Product not found"}), 404
    return jsonify({"success": True, "product_id": product_id,
                    "count": len(res), "data": res})
 
 
@app.route('/trending', methods=['GET'])
def trending_api():
    n    = request.args.get('n', 10, type=int)
    rows = get_trending(n)
    return jsonify({"success": True, "count": len(rows), "data": rows})
 
 
@app.route('/category-bestsellers/<int:category_id>', methods=['GET'])
def category_bestsellers_api(category_id):
    exclude = request.args.get('exclude', 0, type=int)
    n       = request.args.get('n', 6,    type=int)
    rows    = get_category_bestsellers(category_id, exclude, n)
    return jsonify({"success": True, "count": len(rows), "data": rows})
 
 
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "engine": "RECOMIND Hybrid AI v3"})
 
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)