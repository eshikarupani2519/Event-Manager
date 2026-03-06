from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
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
# RUN ML SERVICE
# --------------------------------------------------
if __name__ == '__main__':
    app.run(port=5001, debug=True)
