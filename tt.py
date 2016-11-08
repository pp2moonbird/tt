from flask import Flask, render_template, jsonify
import json

from flask import request

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('tt.html')


@app.route('/data')
def data():
    result = None
    with open('data.json', 'r') as inputfile:
        student = json.load(inputfile)
    result = jsonify(student)
    return result


@app.route('/data', methods=['POST'])
def writeData():
    a = request.json
    print(a)
    with open('data.json', 'w') as outputfile:
        json.dump(a, outputfile)
    return 'ok'


if __name__ == '__main__':
    app.run(debug=True)