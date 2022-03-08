# mentee = Mentee(user_id=user.id, about=data.get("about")).commit()
#
#     selected_topics = Topic.query.filter(Topic.id.in_([skill.get("skill") for skill in data.get("skills")])).all()
#     selected_topics_ordered = [next(s for s in selected_topics if s.id == skill.get("skill")) for skill in
#                              sorted(data.get("skills"), key=(lambda i: i.get("priority")))]
#     count = 1
#     for topic in selected_topics_ordered:
#         mentee_topic = MenteeTopic(priority=count)
#         mentee_topic.topic = topic
#         mentee_topic.mentee = mentee
#         db.session.add(mentee_topic)
#         count += 1
#
#     db.session.commit()
from cerberus import Validator

storeValidationRules = {
    'user_id': {
        'required': True,
        'type': 'integer',
        'min': 1
    },
    'about': {
        'type': 'string',
        'required': True,
        'minlength': 1,
        'maxlength': 1000
    },
    'interests': {
        'type': 'list',
        'minlength': 1,
        'maxlength': 10,
        'required': True,
        'schema': {
            'type': "dict",
            'schema': {
                "interest": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                },
                "priority": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                }
            }
        }
    }

}

updateValidationRules = {
    'interests': {
        'type': 'list',
        'minlength': 1,
        'maxlength': 10,
        'schema': {
            'type': "dict",
            'schema': {
                "interest": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                },
                "priority": {
                    "type": "integer",
                    "min": 1,
                    "required": True
                }
            }
        }
    },
    'plansofaction': {
        'type': 'list',
        'minlength': 0,
        'maxlength': 200,
        'schema': {
            'type': "dict",
            'schema': {
                "title": {
                    "type": "string",
                    "minlength": 1,
                    'maxlength': 500,
                    "required": True
                },
                "status": {
                    "regex": "^(active|completed)$",
                    "type": "string",
                    "required": True
                }
            }
        }
    },
    'mentor': {
        'required': False,
        'type': 'integer'
    }
}
#PlanOfAction(title=plan.get("title"), status=plan.get("status"), mentee_id=mentee.id)

storeValidator = Validator(storeValidationRules)
updateValidator = Validator(updateValidationRules)
