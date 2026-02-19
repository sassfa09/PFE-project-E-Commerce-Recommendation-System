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
        host="db",
        user="user_pfe",
        password="user_password",
        database="PFE-database"
    )

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
   # Clean the text while keeping numbers
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

def get_recommendations(product_id):
    try:
        db = get_db_connection()
        query = "SELECT id_product, nom_produit, description, id_categorie FROM product"
        df = pd.read_sql(query, db)
        db.close()

        if df.empty:
            return None

        df['id_product'] = df['id_product'].astype(int)

        if product_id not in df['id_product'].values:
            return None

        # 1. Identify the current product and its category
        current_product = df[df['id_product'] == product_id].iloc[0]
        current_category = current_product['id_categorie']

       # 2. Prepare the metadata (product name has 3x weight compared to description)
        df['metadata'] = ((df['nom_produit'] + " ") * 3) + df['description'].fillna('')
        df['metadata'] = df['metadata'].apply(clean_text)

        # 3. Compute TF-IDF (using n-grams to improve accuracy)
        tfidf = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000
        )

        tfidf_matrix = tfidf.fit_transform(df['metadata'])
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

        # 4. Fetch similarity results
        idx = df[df['id_product'] == product_id].index[0]
        sim_scores = list(enumerate(cosine_sim[idx]))

        enhanced_results = []

        for i, score in sim_scores:
            if df.iloc[i]['id_product'] == product_id:
                continue

           # We reduced the bonus to 0.07 so the AI can go outside the category if it finds a strong similarity
            category_bonus = 0.07 if df.iloc[i]['id_categorie'] == current_category else 0
            final_score = score + category_bonus

            enhanced_results.append((i, final_score))

       # Sort the results by the final score
        enhanced_results = sorted(enhanced_results, key=lambda x: x[1], reverse=True)

        # Filter out very weak results (less than 0.12) to ensure quality
        enhanced_results = [r for r in enhanced_results if r[1] > 0.12]

        # Take the top 4 products
        top_indices = enhanced_results[:4]

        results = []
        for i, final_score in top_indices:
            results.append({
                "id": int(df.iloc[i]['id_product']),
                "nom": df.iloc[i]['nom_produit'], 
                "score": round(float(final_score), 2),
                "match_level": (
                    "High" if final_score > 0.5 else 
                    "Medium" if final_score > 0.25 else 
                    "Low"
                )
            })

        # 5. Fallback: If the AI finds nothing, automatically fetch products from the same category
        if not results:
            fallback = df[
                (df['id_categorie'] == current_category) & 
                (df['id_product'] != product_id)
            ].head(4)

            for _, row in fallback.iterrows():
                results.append({
                    "id": int(row['id_product']),
                    "nom": row['nom_produit'],
                    "score": 0.15,
                    "match_level": "Category Match"
                })

        return results

    except Exception as e:
        print(f"AI ERROR: {str(e)}")
        return None

@app.route('/recommend/<int:product_id>', methods=['GET'])
def recommend_api(product_id):
    recommendations = get_recommendations(product_id)
    if recommendations is None:
        return jsonify({"success": False, "message": "Product not found"}), 404
    
    return jsonify({
        "success": True,
        "product_id": product_id,
        "data": recommendations
    })

@app.route('/health')
def health():
    return jsonify({"status": "AI Engine running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)