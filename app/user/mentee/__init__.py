import app.user.mentee.GetBy as GetBy
import app.user as Users



class Mentee:
    def __init__(self):
        self.databaseID: int
        self.userID: int
        self.user: Users.User
        self.subjectID: int

    def get_api_return_data(self, start_dict=None):
        r_dict = {}
        if not (start_dict is None or not isinstance(start_dict, dict)):
            for key, value in start_dict.items():
                r_dict[key]=value
        r_dict["id"] = self.databaseID
        r_dict["subjectID"] = self.subjectID
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