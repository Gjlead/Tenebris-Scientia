import sqlite3
from flask import Flask, render_template, request, jsonify, g

# Configure application
app = Flask(__name__)

# SQLite database connection
DATABASE = 'ingredients.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # Enable accessing columns by name
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route("/")
def index():
    """Show Index page"""
    return render_template("index.html")


@app.route("/news")
def news():
    """Show News page"""
    return render_template("news.html")


@app.route("/about")
def about():
    """Show About page"""
    return render_template("about.html")


@app.route("/campus")
def campus():
    """Show Campus page"""
    return render_template("campus.html")


@app.route("/poetry")
def poetry():
    """Show Poetry Competition page"""
    return render_template("poetry.html")


@app.route("/potionStore")
def potionStore():
    """Show Potion Store page"""
    cursor = get_db().cursor()
    bases = cursor.execute(
        "SELECT name, description, effect, price, is_base, is_vegan, is_poisonous, is_dubious, tastes_bad FROM ingredient WHERE is_base = 1"
    ).fetchall()

    # Get column names and convert rows to dictionaries so I can use them in the html
    columnsBase = [col[0] for col in cursor.description]
    bases = [dict(zip(columnsBase, row)) for row in bases]
    # Update price so it also contains the currency
    for base in bases:
        base["price"] = str(base.get("price")) + "A"


    ingredients = cursor.execute(
        "SELECT name, description, effect, price, is_base, is_vegan, is_poisonous, is_dubious, tastes_bad FROM ingredient WHERE is_base = 0"
    ).fetchall()

    columnsIngredient = [col[0] for col in cursor.description]
    ingredients = [dict(zip(columnsIngredient, row)) for row in ingredients]
    for ingredient in ingredients:
        ingredient["price"] = str(ingredient.get("price")) + "A"

    return render_template("potionStore.html", bases = bases, ingredients=ingredients)


@app.route("/update_filter", methods=['POST'])
def update_filter():

    filter_value = request.get_json().get("filters")
    filter_conditions = []

    for filter in filter_value:
        if filter == "hideBase":
            filter_conditions.append("is_base = 0")
        elif filter == "showVegan":
            filter_conditions.append("is_vegan = 1")
        elif filter == "showPoison":
            filter_conditions.append("is_poisonous = 1")
        elif filter == "hidePoison":
            filter_conditions.append("is_poisonous = 0")
        elif filter == "hideDubious":
            filter_conditions.append("is_dubious = 0")
        elif filter == "hideTaste":
            filter_conditions.append("tastes_bad = 0")


    if len(filter_conditions) > 1:
        where_clause = " AND ".join(filter_conditions)
    elif len(filter_conditions) == 1:
        where_clause = filter_conditions[0]
    else:
        where_clause = "1=1"

    sql_query = f"SELECT name, description, effect, price, is_base, is_vegan, is_poisonous, is_dubious, tastes_bad FROM ingredient WHERE {where_clause}"

    cursor = get_db().cursor()
    updated_data = cursor.execute(sql_query).fetchall()

    columns = [col[0] for col in cursor.description]
    ingredients = [dict(zip(columns, row)) for row in updated_data]
    for ingredient in ingredients:
        ingredient["price"] = str(ingredient.get("price")) + "A"

    return jsonify(ingredients)


@app.route("/get_ingredient_info", methods=['POST'])
def get_ingredient_info():
    ingredient_name = request.json["ingredient_name"]
    sql_query = f"SELECT name, price, is_poisonous, is_dubious FROM ingredient WHERE name = '{ingredient_name}'"

    cursor = get_db().cursor()
    query_result = cursor.execute(sql_query).fetchall()

    columns = [col[0] for col in cursor.description]
    ingredient_info = [dict(zip(columns, row)) for row in query_result]

    return jsonify(ingredient_info)
