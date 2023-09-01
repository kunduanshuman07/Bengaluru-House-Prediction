from flask import Flask, request, jsonify
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations':utils.get_location_names()
    })
    return response


@app.route('/predict_home_price', methods=['GET','POST'])
def predict_home_price():
    total_sqft = float(request.json['total_sqft'])
    location = request.json['location']
    bhk = int(request.json['bhk'])
    bath = int(request.json['bath'])
    response = jsonify({
        'estimated_price': utils.get_estimated_price(location,total_sqft,bhk,bath)
    })
    return response

if __name__ == "__main__":
    print("Python Server up and running")
    utils.load_saved_artifacts()
    app.run(host='0.0.0.0', debug=True)
