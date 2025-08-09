from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import dumps
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from Angular

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://adminTWCraftingCalculator:8ku10vK8ZTYyq3Rg@cluster0.yhfaqhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["TW-Crafting-Calculator"]
products_collection = db["Products"]
plans_collection = db["Plans"]


@app.route("/")
def index():
    return "<h1>Hello World<h1>"

@app.route("/add-product", methods=["POST"])
def add_product():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = products_collection.insert_one(data)
    return jsonify({"success": True, "id": str(result.inserted_id)})


@app.route("/save-plan", methods=["POST"])
def save_plan():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    result = plans_collection.insert_one(data)
    return jsonify({"Message": "Successfully inserted", "id": str(result.inserted_id)})

@app.route("/update-plan", methods=["POST"])
def update_plan():
    try:
        # Convert plan_id string to ObjectId
        

        # Data sent from frontend (Angular form)
        update_data = request.json
        object_id = ObjectId(update_data["_id"])
        del update_data["_id"]
        # Update the plan
        result = plans_collection.update_one(
            {"_id": object_id},
            {"$set": update_data}  # Only update the provided fields
        )

        if result.matched_count == 0:
            return jsonify({"Message": "Plan not found"}), 404

        return jsonify({"Message": "Plan updated successfully"}), 200
    

    except Exception as e:
        print(e)
        return jsonify({"Message": "Error updating plan"}), 500

@app.route("/get-plans")
def get_plans():
    plans = list(plans_collection.find())
    return dumps([{
        '_id': str(plan['_id']),
        'name': plan['name'],
        'products': plan.get('products', [])
    } for plan in plans])

@app.route("/get-plan", methods=["GET", "POST"])
def get_plan():
    data = request.json
    response = {
        "data":"",
        "error":""
    }
    if not data:
        response["error"] = "Error: {data}"
        return dumps(response), 400

    plan = list(plans_collection.find_one({"_id"}))
    response["data"] = {
        '_id': str(plan['_id']),
        'name': plan['name'],
        'products': plan.get('products', [])
    }
    return dumps(response), 200

@app.route("/get_products", methods=["GET"])
def get_products():
    products = list(products_collection.find())
    return dumps([{
        '_id': str(product['_id']),
        'name': product['name'],
        'composition': product.get('composition', [])
    } for product in products])

if __name__ == "__main__":
    app.run(debug=True)