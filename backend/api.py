from flask import Flask, request, jsonify

app = Flask(__name__)

# Mock data for properties
properties = [
    {"id": 1, "name": "Cozy Villa", "location": "California", "price": 500000},
    {"id": 2, "name": "Modern Apartment", "location": "New York", "price": 750000}
]

@app.route('/api/properties', methods=['GET'])
def get_properties():
    return jsonify(properties)

@app.route('/api/lead', methods=['POST'])
def post_lead():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    # Log the received lead (for now, print it to the terminal)
    print(f"Lead received from {name} ({email}): {message}")

    return jsonify({"message": f"Lead received from {name}"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
