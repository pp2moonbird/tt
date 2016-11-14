from flask import Flask, render_template, jsonify
import json

from flask import request

app = Flask(__name__)

with open('./config/config.txt', 'r') as configfile:
    datafilepath = configfile.readline()


@app.route('/')
def index():
    return render_template('tt.html')


@app.route('/data')
def data():
    result = None
    with open(datafilepath, 'r') as inputfile:
        student = json.load(inputfile)
        print(student)
    result = jsonify(data = student)
    return result


@app.route('/data', methods=['POST'])
def writeData():
    a = request.json
    print(a)
    with open(datafilepath, 'w') as outputfile:
        json.dump(a, outputfile)
    return 'ok'

def testConfig():
    with open('./config/config.txt', 'r') as configfile:
        configfilepath = configfile.readline()
        print(configfilepath)
        with open(configfilepath) as jsonfile:
            for line in jsonfile.readlines():
                print(line)

if __name__ == '__main__':
    app.run(debug=True)