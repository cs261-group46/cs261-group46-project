from app.models import User


class Mentee:
    def __init__(self):
        self.databaseID: int = None
        self.userID: int = None
        self.user: User
        self.topicID: int = None

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key]=value
        r_dict["id"] = self.databaseID
        r_dict["topicID"] = self.topicID
        return r_dict

    def isDummy(self):
        return False

    def isLoaded(self):
        return not self.isDummy()


class DummyMentee(Mentee):
    dummyMentee = None

    def __new__(cls, *args, **kwargs):
        if DummyMentee.dummyMentee is None:
            DummyMentee.dummyMentee = super().__new__(cls)
        return DummyMentee.dummyMentee

    def isDummy(self):
        return True


import app.models.mentee.GetBy as GetBy