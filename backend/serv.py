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

#TODO get instructor data route
#courses

class Class(db.Model):
    name = db.Column(db.String(64),nullable = False,primary_key=True, unique=True)
    title = db.Column(db.String(64),nullable = False)
    desc = db.Column(db.String(2048),nullable = False)
    positions = db.Column(db.Integer,default = 0)
    filled_pos = db.Column(db.Integer,default = 0)

    

def rowToClass(row):
    row = {
        "name": row.name,
        "title": row.title,
        "desc": row.desc,
        "positions" : row.positions,
        "filled_pos" : row.filled_pos
        }

    return row

#get classes without TA's or not enough TAs
@app.route(baseURL + 'unfilled',methods=['GET'])
def unfilCourses():
    row = Class.query.all()
    filtered = []
    for ent in row:
        if ent.filled_pos < ent.positions:
            filtered.append(ent)
    result = []
    for ent in filtered:
        result.append(rowToClass(ent))
    return  jsonify({"status": 1, "classes": result}), 200
    

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
 
#get instructor by email which is important
#url has account/instructor?email=accountemail
@app.route(baseURL+"account/instructor",methods=["GET"])
def getIns():
    email= request.args.get("email",None)

    row = Instructor.query.filter_by(email=email).first()
    if row == None:
        return jsonify({"acc":"not ins" ,"status":1}),200
    else:
        return jsonify({"instructor":rowToIns(row),"status":1}),200

#get all instructors
@app.route(baseURL+"account/instructors",methods=["GET"])
def getAllIns():
    row = Instructor.query.filter_by(id=id).first()
    return jsonify({"instructor":rowToIns(row),"status":1}),200



#get student by email because this is helpful for later
#url has account/student?email=accountemail

@app.route(baseURL+"account/student",methods=["GET"])
def getStudent():
    email= request.args.get("email",None)
    row = Student.query.filter_by(email=email).first()
    if row == None:
        return jsonify({"acc":"not student" ,"status":1}),200
    else:
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

#ta applications
#need to change SID to be the primary key
class Application(db.Model):
    sid = db.Column(db.Integer, nullable = False,primary_key=True)
    fid = db.Column(db.Integer,nullable = False)
    #future reference, this is the course name
    name = db.Column(db.String(64),nullable = False)
    grade = db.Column(db.String(3),nullable = False)
    semTaken = db.Column(db.String(64),nullable = False)
    date = db.Column(db.String(64),nullable = False)
    status = db.Column(db.String(64),nullable = False, default="Under Review")

#table for TA's who are approved
class CurrentTA(db.Model):
    sid = db.Column(db.Integer, nullable = False)
    fid = db.Column(db.Integer,nullable = False)
    class_name = db.Column(db.String(64),nullable = False,primary_key=True)
    ta_name = db.Column(db.String(64),nullable = False)

def rowToTA(row):
    row = {
        "sid": row.sid,
        "fid": row.fid,
        "class_name": row.class_name,
        "ta_name": row.ta_name
        }
    return row    


def rowToApp(row):
    row = {
        "sid": row.sid,
        "fid": row.fid,
        "name": row.name,
        "grade" : row.grade,
        "semTaken" : row.semTaken,
        "date" : row.date,
        "status" : row.status
        }
    return row

#should return TA's for a given course by coursename, this could be modified to be by professor, ID, etc
#TODO need a route/function to add TA's to this table so there is anything to query
@app.route(baseURL+"TAS",methods=['GET'])
def getTAs():
    className = request.args.get("className",None)
    if className is None:
        return "Must provide class name", 500
    query = CurrentTA.query.filter_by(class_name = className)
    results = []
    for entry in query:
        results.append(rowToTA(entry))
    
    return jsonify({"status":1,"TAs":results}), 200

#get all applications based on class name
@app.route(baseURL+"getApps",methods=['GET'])
def getApps():
    className = request.args.get("className",None)
    if className is None:
        return "Must provide class name", 500
    query = Application.query.filter_by(name= className)
    results = []
    for entry in query:
        results.append(rowToApp(entry))
    
    return jsonify({"status":1,"Apps":results}), 200

#get all approved TAs for a given classname
@app.route(baseURL+"getApprovedApps",methods=['GET'])
def getApprovedApps():
    className = request.args.get("className",None)
    if className is None:
        return "Must provide class name", 500
    query = Application.query.filter_by(name= className)
    results = []
    for entry in query:
        # print(entry.status)
        if entry.status == "Approved":
            results.append(rowToApp(entry))
    
    return jsonify({"status":1,"Apps":results}), 200
    
#deletes all TA applications with the deny status
@app.route(baseURL+"apply/delete",methods=['DELETE'])
def delTAs():
    
    query = Application.query.filter_by(status="Deny")
    query.delete()
    db.session.commit()
    
    return "denied TAships deleted", 200

#change status of application based on JSON recieved and a given ID
#TODO change this to automatically approve per a path, or deny via a path
@app.route(baseURL + 'apply/<int:id>',methods=['POST'])
def appStatus(id):
    ta_app = Application(**request.json)
    row = Application.query.filter_by(sid = id).first()
    row.status = ta_app.status
    db.session.commit()
    db.session.refresh(row)
    return jsonify({"status": 1, "app_status":rowToApp(row)}), 200

@app.route(baseURL + 'apply',methods=['POST'])
def newApp():
    new_application = Application(**request.json)
    try:
        db.session.add(new_application)
        db.session.commit()
        db.session.refresh(new_application)
        return jsonify({"status": 1, "Course": rowToApp(new_application)}), 200
    except exc.IntegrityError:
        return "duplicate name", 500




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
        print("row = " + str(creds))
        print("pw = "+ str(pw))

        if creds["login"]==pw["login"] and creds["pw"]==pw["pw"]:
            session['logged_in']=True
            print("logged in successfully")
            return jsonify({"status": 1, "login": row.accType}, 200)
        else:
            print("credential missmatch")
            return jsonify({"status": 1, "login": "FAIL"}, 500)
    else:
        print("user not found")
        return jsonify({"status": 1, "login": "FAIL"}, 500)

    return jsonify({"status": 1, "login": login}, 500)


def main():
	db.create_all() # creates the tables you've provided
	app.secret_key="42069" #just need a key to use session
	app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()