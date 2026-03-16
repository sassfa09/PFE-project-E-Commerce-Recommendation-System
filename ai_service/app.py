import os
import re
from flask import Flask, jsonify
import pandas as pd
import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="db", user="user_pfe", password="user_password", database="PFE-database"
    )

def clean_text(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

def get_recommendations(product_id):
    try:
        db = get_db_connection()
        # زدنا سحب عدد المشاهدات (views) للترتيب الهجين
        query = "SELECT id_product, nom_produit, views FROM product"
        df = pd.read_sql(query, db)
        db.close()

        if df.empty or product_id not in df['id_product'].values:
            return None

        # 1. حساب التشابه النصي (Text Similarity)
        df['clean_title'] = df['nom_produit'].apply(clean_text)
        tfidf = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4))
        tfidf_matrix = tfidf.fit_transform(df['clean_title'])
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

        idx = df[df['id_product'] == product_id].index[0]
        sim_scores = list(enumerate(cosine_sim[idx]))

        # 2. تطبيق خوارزمية الترتيب الهجين (Hybrid Ranking)
        # النورماليزاسيون ديال الـ views باش تكون بين 0 و 1
        max_views = df['views'].max() if df['views'].max() > 0 else 1
        df['normalized_views'] = df['views'] / max_views

        hybrid_results = []
        for i, text_score in sim_scores:
            if df.iloc[i]['id_product'] == product_id: continue
            
            pop_score = df.iloc[i]['normalized_views']
            
            # المعادلة: 70% تشابه نصي + 30% شعبية المنتج
            # هادشي كيعطينا "Intelligent Balanced Score"
            final_score = (text_score * 0.7) + (pop_score * 0.3)
            
            hybrid_results.append((i, final_score, text_score))

        # الترتيب حسب السكور النهائي
        hybrid_results = sorted(hybrid_results, key=lambda x: x[1], reverse=True)

        top_products = []
        for i, final_score, text_score in hybrid_results[:4]:
            top_products.append({
                "id": int(df.iloc[i]['id_product']),
                "nom": df.iloc[i]['nom_produit'],
                "score": round(float(final_score), 2),
                "text_match": round(float(text_score), 2),
                "match_level": "Top Recommendation" if final_score > 0.4 else "Related"
            })

        return top_products

    except Exception as e:
        print(f"AI Error: {e}")
        return None

@app.route('/recommend/<int:product_id>', methods=['GET'])
def recommend_api(product_id):
    res = get_recommendations(product_id)
    if res is None: return jsonify({"success": False}), 404
    return jsonify({"success": True, "data": res})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)