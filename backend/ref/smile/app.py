from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import flask_sqlalchemy as sqlalchemy

import datetime

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'
app.config['CORS_HEADERS'] = 'Content-Type'
db = sqlalchemy.SQLAlchemy(app)

class Smile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    space = db.Column(db.String(64),nullable = False) #limits string to 64 char
    title = db.Column(db.String(64),nullable = False)
    story = db.Column(db.String(2048),nullable = False)
    happiness_level = db.Column(db.Integer,nullable = False)
    like_count = db.Column(db.Integer,default = 0)
    created_at = db.Column(db.DateTime, default =datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # can use date-time as an option
    # TODO 1: add all of the columns for the other table attributes DONE
    

base_url = '/api/'

# index
# loads all smiles given a space, count parameter and order_by parameter 
# if the count param is specified and doesn't equal all limit by the count
# if the order_by param is specified order by param otherwise load by updated_at desc
# return JSON

# look at https://stackoverflow.com/questions/4186062/sqlalchemy-order-by-descending
#that should do sorted return
@app.route(base_url + 'smiles')
def index():
    space = request.args.get('space', None) 

    if space is None:
        return "Must provide space", 500

    count = request.args.get('count', None)
    order_by = request.args.get('order_by', None)
    
    
    # TODO 2: set the column which you are ordering on (if it exists)
    if(order_by=="created_at"):
        query = Smile.query.order_by(Smile.created_at.desc())
    elif (order_by=="update_at"):
        query = Smile.query.order_by(Smile.updated_at.desc())
    elif (order_by=="happiness_level"):
        query = Smile.query.order_by(Smile.happiness_level.desc())
    elif(order_by=="like_count"):
        query = Smile.query.order_by(Smile.like_count.desc())
    else:
        query = Smile.query.all() # store the results of your query here 
    # TODO 3: limit the number of posts based on the count (if it exists)
    if(count!=None):
        #limits number of results from the query rules above
        query=query.limit(count)
            
    result = []
    for row in query:
        result.append(
            row_to_obj(row) # you must call this function to properly format 
        )

    return jsonify({"status": 1, "smiles": result})

# show
# loads a smile given the id as a value in the URL

# TODO 4: create the route for show

@app.route(base_url + 'smiles/<int:id>', methods=["GET"])
def show(id):
    row = Smile.query.filter_by(id=id).first()
    return jsonify({"smiles": row_to_obj(row), "status": 1}), 200

# create
# creates a smile given the params

# TODO 5: create the route for create
#endpoint works, fix content
@app.route(base_url + 'smiles', methods=['POST'])
def create():
    smiles = Smile(**request.json)
    db.session.add(smiles)
    db.session.commit()

    db.session.refresh(smiles)

    return jsonify({"status": 1, "smile": row_to_obj(smiles)}), 200

#  make post request with this json at http://127.0.0.1:5000/api/smiles and it work
#  id form isnt necessary, will auto generate
#  {
#     "happiness_level": 1,
#     "id": 16,
#     "like_count": 3,
#     "space": "initial",
#     "story": "I was standing in line to buy tickets at Disneyland with my 3 friends. We could hardly wait to get in. The man standing in front of us suddenly turned around and handed us each a ticket to the park. “Enjoy the park today...tickets are on me!” It was so unexpected and so wonderful. I can only hope to pay it forward someday.",
#     "title": "Disney"	
# }

# delete_smiles
# delete given an space
# delete all smiles in that space

# TODO 6: create the route for delete_smiles
@app.route(base_url + 'smiles', methods=['DELETE'])
def delete():
    space = request.args.get('space', None) 
    if(space ==None):
        return "Must specify a space to delete", 500
    else:
        #Smile.query.delete()
        toRemove = Smile.query.filter_by(space=space)
        toRemove.delete()
        db.session.commit()
        return "Space is specified", 200

        

       


# post_like
# loads a smile given an ID and increments the count by 1

# TODO 7: create the route for post_like 
# DONE

@app.route(base_url + 'smiles/<int:id>/like', methods=["POST"])
def like(id):
    row = Smile.query.filter_by(id=id).first()
    if(row == None):
        return "No post found at that ID",500
    row.like_count+=1
    db.session.commit()
    return "liked",200

def row_to_obj(row):
    row = {
            "id": row.id,
            "space": row.space,
            "title": row.title,
            "story": row.story,
            "happiness_level": row.happiness_level,
            "like_count": row.like_count,
            "created_at": row.created_at,
            "updated_at": row.updated_at
        }

    return row

  
def main():
    db.create_all() # creates the tables you've provided
    app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()
