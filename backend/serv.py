#Garrett Rudisill
#CptS 322 ta finder backend

from flask import Flask, jsonify, request, render_template, session, url_for
from flask_cors import CORS, cross_origin
import flask_sqlalchemy as sqlalchemy
from sqlalchemy import exc #so we can handle integrity errors

import datetime

app = Flask(__name__)
CORS(app)
#cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'
#app.config['CORS_HEADERS'] = 'Content-Type'
db = sqlalchemy.SQLAlchemy(app)

baseURL = "/api/"

#this is to test rendering with flask for login information
#this does work, but relies on the static css folder
#and the templates folder for html
@app.route('/', methods=['GET', 'POST'])
def home():
	""" Session control"""
	if not session.get('logged_in'):
        # session['logged_in']=True
        # this we can used logged in to control redirects
		return render_template('login.html')
	else:
		#redirect based on login status goes here
		if request.method == 'POST':
			return render_template('class.html')
		return render_template('class.html')


#needed tables

#student table model
class Student(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    fname = db.Column(db.String(64),nullable = False)
    lname = db.Column(db.String(64),nullable = False)
    email = db.Column(db.String(64),nullable = False)
    major = db.Column(db.String(64),nullable = False)
    gpa = db.Column(db.Integer, nullable = False)
    gradDate = db.Column(db.String(64),nullable = False)

#route for student profile creation
@app.route(baseURL + 'account/student',methods=['POST'])
def newStudent():
    newStud = Student(**request.json)
    db.session.add(newStud)
    db.session.commit()
    db.session.refresh(newStud)
    return jsonify({"status": 1, "newStud":rowToStudent(newStud)}), 200

#route to edit a student account
@app.route(baseURL + 'editaccount/student/<int:id>',methods=['POST'])
def editStudent(id):
    editedStudent = Student(**request.json)
    row = Student.query.filter_by(id = id).first()
    row.id = editedStudent.id
    row.fname = editedStudent.fname
    row.lname = editedStudent.lname
    row.email = editedStudent.email
    row.major = editedStudent.major
    row.gpa = editedStudent.gpa
    row.gradDate = editedStudent.gradDate
    db.session.commit()
    db.session.refresh(row)
    return jsonify({"status": 1, "editedStud":rowToStudent(row)}), 200
  
#convert a passed json to a student profile
def rowToStudent(row):
    row = {
        "id":row.id,
        "fname":row.fname,
        "lname":row.lname,
        "email":row.email,
        "major":row.major,
        "gpa":row.gpa,
        "gradDate":row.gradDate
        }

    return row

#instructor db model
class Instructor(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    fname = db.Column(db.String(64),nullable = False)
    lname = db.Column(db.String(64),nullable = False)
    email = db.Column(db.String(64),nullable = False)
    phone = db.Column(db.String(64),nullable = False)
    office = db.Column(db.String(64),nullable = False)
 

#create a new instructor from a given json
def rowToIns(row):
    row = {
        "id":row.id,
        "fname":row.fname,
        "lname":row.lname,
        "email":row.email,
        "phone":row.phone,
        "office":row.office
        }

    return row

#new instructor route
@app.route(baseURL + 'account/instructor',methods=['POST'])
def newIns():
    newProf = Instructor(**request.json)
    db.session.add(newProf)
    db.session.commit()
    db.session.refresh(newProf)
    return jsonify({"status": 1, "newProf": rowToIns(newProf)}), 200

#route to edit an instructor account
@app.route(baseURL + 'editaccount/instructor/<int:id>',methods=['POST'])
def editInstructor(id):
    editedInstructor = Instructor(**request.json)
    row = Instructor.query.filter_by(id = id).first()
    row.id = editedInstructor.id
    row.fname = editedInstructor.fname
    row.lname = editedInstructor.lname
    row.email = editedInstructor.email
    row.phone = editedInstructor.phone
    row.office = editedInstructor.office
    db.session.commit()
    db.session.refresh(row)
    return jsonify({"status": 1, "editedIns":rowToIns(row)}), 200
#courses

class Class(db.Model):
    name = db.Column(db.String(64),nullable = False,primary_key=True, unique=True)
    title = db.Column(db.String(64),nullable = False)
    desc = db.Column(db.String(2048),nullable = False)

def rowToClass(row):
    row = {
        "name": row.name,
        "title": row.title,
        "desc": row.desc
        }

    return row

#route to create a new course
@app.route(baseURL + 'newclass',methods=['POST'])
def newClass():
    addedCourse = Class(**request.json)
    try:
        db.session.add(addedCourse)
        db.session.commit()
        db.session.refresh(addedCourse)
        return jsonify({"status": 1, "Course": rowToClass(addedCourse)}), 200
    except exc.IntegrityError:
        return "duplicate name", 500


#route for to get courses
@app.route(baseURL + 'classes',methods=['GET'])
def getAllClasses():
    #row = Class.query.first()
    row = Class.query.all() #returns a list of the objects, must go through iteratively
    result = []
    #convert each query and add to a list to return
    for ent in row:
        result.append(rowToClass(ent))

    return  jsonify({"status": 1, "classes": result}), 200
 
#get instructor by ID
@app.route(baseURL+"account/instructor/<int:id>",methods=["GET"])
def getIns(id):
    row = Instructor.query.filter_by(id=id).first()
    return jsonify({"instructor":rowToIns(row),"status":1}),200

#get all instructors
@app.route(baseURL+"account/instructors",methods=["GET"])
def getAllIns():
    row = Instructor.query.filter_by(id=id).first()
    return jsonify({"instructor":rowToIns(row),"status":1}),200

#get student by ID
@app.route(baseURL+"account/student/<int:id>",methods=["GET"])
def getStudent(id):
    row = Student.query.filter_by(id=id).first()
    return jsonify({"student":rowToStudent(row),"status":1}),200

#gets all students
@app.route(baseURL+"account/allstudents",methods=["GET"])
def getAllStudent():
    row = Student.query.all()
    result = []
    #convert each query and add to a list to return
    for ent in row:
        result.append(rowToStudent(ent))

    return jsonify({"students":result,"status":1}),200

# #courses taught 
# class Taught(db.Model):
#     id = db.Column(db.Integer,primary_key=True)
#     name = db.Column(db.String(64),nullable = False)

#TODO get all courses

# #ta applications
# class Application(db.Model):
#     sid = db.Column(db.Integer, nullable = False)
#     fid = db.Column(db.Integer,nullable = False)
#     name = db.Column(db.String(64),nullable = False)
#     grade = db.Column(db.String(3),nullable = False)
#     semTaken = db.Column(db.String(64),nullable = False)
#     date = db.Column(db.String(64),nullable = False)
#     status = db.Column(db.String(64),nullable = False)


# #login info

#login is the email of the user
#pw is the user password, I will add a server end hash/dehash for "security"
#account type will be a I or S, representing Instructor and Student respectively
#when loading into account page, use the acctype to do a proper page info request and render the right page details

class logins(db.Model):
    login = db.Column(db.String(64),nullable = False,primary_key=True, unique=True)
    pw = db.Column(db.String(64),nullable = False)
    accType = db.Column(db.String(1),nullable = False)


#route to create a new login 
@app.route(baseURL + 'login/create',methods=['POST'])
def newLogin():
    newLog = logins(**request.json)
    try:
        db.session.add(newLog)
        db.session.commit()
        db.session.refresh(newLog)
        return jsonify({"status": 1, "login": "New Account added"}, 200)
        #return only the status and new account added because security
    except exc.IntegrityError:
        return "login prexisting", 500

def loginToObj(log):
    row = {
        "login" : log.login,
        "pw" : log.pw,
        "type" : log.accType
    }
    return row

#route to do logins 

#modify to accept the json to get passwords, decrypt the hash
#check credentials if the username is found
@app.route(baseURL + 'login/<string:login>',methods=['GET','POST'])
def getLogin(login):
    print(login+" attempts to login")
    attLog = logins(**request.json)
    row = logins.query.filter_by(login=login).first()
    if row != None:
        creds = loginToObj(row)
        pw = loginToObj(attLog)
        print("row = " + str(creds));
        print("pw = "+ str(pw));

        if creds["login"]==pw["login"] and creds["pw"]==pw["pw"]:
            session['logged_in']=True
            print("logged in successfully")
            return jsonify({"status": 1, "login": login}, 200)
        else:
            print("credential missmatch")
            return jsonify({"status": 1, "login": login}, 500)
    else:
        print("user not found")
    return jsonify({"status": 1, "login": login}, 500)


def main():
	db.create_all() # creates the tables you've provided
	app.secret_key="42069" #just need a key to use session
	app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()