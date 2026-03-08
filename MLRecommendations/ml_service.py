from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
app = Flask(__name__)
CORS(app)

from dotenv import load_dotenv
import os

load_dotenv()  # Reads variables from .env

db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")
db_host = os.environ.get("DB_HOST")
db_name = os.environ.get("DB_NAME")
conn = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name
)
db = conn.cursor(dictionary=True) 
# --------------------------------------------------
# 1️⃣ EVENT SUGGESTION (CURRENT interests COLLABORATIVE FILTERING)
# --------------------------------------------------
@app.route('/event-suggestion', methods=['POST'])
def event_suggestion():
    data = request.json
    
    attendee = data['attendee']
    events = data['event']

    attendee_interests = set(attendee.get('interests', []))
    results = []

    for event in events:
        event_categories = set(event.get('event_category', []))
        common_interests = attendee_interests.intersection(event_categories)

        # Interest match %
        match_pct = (
            len(common_interests) / len(attendee_interests) * 100
        ) if attendee_interests else 0

        missing_categories = list(attendee_interests-event_categories)

        # 🔥 Calculate Average Host Rating
        hosts = event.get("hosts", [])
        
        if hosts:
            avg_rating = sum(h.get("rating", 0) for h in hosts) / len(hosts)
        else:
            avg_rating = 0
        if match_pct>30:
            results.append({
                "id": event.get("event_id"),
                "name": event.get("event_name"),
                "type": event.get("event_type"),
                "date": event.get("event_date"),
                "timing": event.get("timing"),
                "mode": event.get("event_mode"),
                "location": event.get("location"),
                "avg_host_rating": round(avg_rating, 2),
                "interestMatchPercentage": round(match_pct, 2),
                "missingCategories": missing_categories
            })

    # 🔥 SORTING LOGIC
    sorted_results = sorted(
        results,
        key=lambda x: (
            -x["interestMatchPercentage"],   # 1️⃣ primary
            -x["avg_host_rating"]            # 2️⃣ secondary
        )
    )

    return jsonify(sorted_results)

# --------------------------------------------------
# 2️⃣ TARGET SKILLS (TARGET SKILLS COLLABORATIVE FILTERING)
# --------------------------------------------------
# @app.route('/target-skills', methods=['POST'])
# def target_skills():
#     data = request.json
#     attendee = data['attendee']
#     event = data['event']

#     target_skills = set(attendee.get('target_skills', []))
#     results = []

#     for event in event:
#         event_categories = set(event.get('skills', []))
#         common_targets = target_skills.intersection(event_categories)

#         match_pct = (len(common_targets) / len(target_skills) * 100) if target_skills else 0

#         results.append({
#             "name": event.get("name"),
#             "no_of_events_evented":event.get("no_of_events_evented"),
#             "jobTitle": event.get("jobTitle", ""),
#             "company": event.get("company", ""),
#             "targetSkillMatchPercentage": round(match_pct, 2),
#             "matchedTargetSkills": list(common_targets)
#         })

#     return jsonify(
#         sorted(results, key=lambda x: x["targetSkillMatchPercentage"], reverse=True)
#     )

# --------------------------------------------------
# 3️⃣ REAL TIME ENGAGEMENT ENGINE
# --------------------------------------------------

@app.route('/engagement-score', methods=['POST'])
def engagement_score():

    data = request.json

    polls = data.get("polls",0)
    chat = data.get("chatMsg",0)
    reactions = data.get("reactions",0)
    tab_focus = data.get("tabFocus",0)

    score = (polls*0.4) + (chat*0.3) + (reactions*0.2) + (tab_focus*0.1)

    alert = "LOW_ENGAGEMENT" if score < 40 else "GOOD"

    return jsonify({
        "engagementScore": round(score,2),
        "status": alert
    })

# --------------------------------------------------
# 4️⃣ AI TEAM MATCHMAKER
# --------------------------------------------------

@app.route('/team-match', methods=['POST'])
def team_match():

    users = request.json.get("users", [])

    teams = []

    for i in range(len(users)):
        for j in range(i+1,len(users)):

            s1 = set(users[i]["skills"])
            s2 = set(users[j]["skills"])

            similarity = len(s1.intersection(s2)) / len(s1.union(s2))

            teams.append({
                "member1": users[i]["name"],
                "member2": users[j]["name"],
                "skillSimilarity": round(similarity,2)
            })

    teams = sorted(teams, key=lambda x: x["skillSimilarity"])

    return jsonify(teams[:3])

# --------------------------------------------------
# 5️⃣ NO SHOW PREDICTOR
# --------------------------------------------------

@app.route('/predict-attendance', methods=['POST'])
def predict_attendance():

    users = request.json.get("users",[])

    predicted = 0

    results = []

    for u in users:

        probability = 50

        if u.get("scheduleConflict"):
            probability = 20

        if u.get("notificationsClicked",0) >= 3:
            probability = 90

        predicted += probability/100

        results.append({
            "name":u["name"],
            "attendanceProbability":probability
        })

    return jsonify({
        "users":results,
        "predictedFinalAttendance":round(predicted)
    })

# --------------------------------------------------
# 6️⃣ QR CHECKIN CROWD ANALYTICS
# --------------------------------------------------

# checkins = []

# @app.route('/checkin', methods=['POST'])
# def checkin():

#     data = request.json

#     zone = data.get("zone")

#     checkins.append(zone)

#     zone_counts = {}

#     for z in checkins:
#         zone_counts[z] = zone_counts.get(z,0)+1

#     return jsonify({
#         "zones": zone_counts
#     })

# @app.route('/checkin', methods=['POST'])
# def checkin():

@app.route('/checkin', methods=['POST'])
def checkin():
    data = request.json
    event_id = data.get('event_id')
    name = data.get('name')

    # Use the cursor to query
    db.execute("SELECT id FROM attendees WHERE name = %s", (name,))
    attendee = db.fetchone()

    if not attendee:
        return jsonify({"message": "Attendee not found"}), 404

    # Check if already checked in
    db.execute(
        "SELECT * FROM event_attendee WHERE event_id=%s AND att_id=%s",
        (event_id, attendee['id'])
    )
    existing = db.fetchone()

    if existing:
        return jsonify({"message": "Attendance already marked"})

    # Mark attendance
    db.execute(
        "INSERT INTO event_attendee (event_id, att_id) VALUES (%s, %s)",
        (event_id, attendee['id'])
    )
    conn.commit()   # ✅ commit on the connection, not the cursor

    return jsonify({"message": f"Attendance marked for {name}"})

    data = request.json
    event_id = data.get('event_id')
    name = data.get('name')

    # Query database to find attendee
    attendee = db.session.execute(
        "SELECT id FROM attendees WHERE name = :name", {"name": name}
    ).fetchone()

    if not attendee:
        return jsonify({"message": "Attendee not found"}), 404

    # Check if already checked in
    existing = db.session.execute(
        "SELECT * FROM event_attendee WHERE event_id=:event_id AND att_id=:att_id",
        {"event_id": event_id, "att_id": attendee.id}
    ).fetchone()

    if existing:
        return jsonify({"message": "Attendance already marked"})

    # Mark attendance
    db.session.execute(
        "INSERT INTO event_attendee (event_id, att_id) VALUES (:event_id, :att_id)",
        {"event_id": event_id, "att_id": attendee.id}
    )
    db.session.commit()

    return jsonify({"message": f"Attendance marked for {name}"})

# --------------------------------------------------
# RUN ML SERVICE
# --------------------------------------------------
if __name__ == '__main__':
    app.run(port=5001, debug=True)
