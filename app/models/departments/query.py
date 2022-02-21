from app.models.utils import fake_alchemy
from app.models.utils.fake_alchemy import Model, Column, ColumnType, Serial, Text, VarChar


class Departments(Model):
    __tablename__ = "departments"

    id = Column(Serial, primary_key=True)
    name = Column(VarChar(128), unique=True)




query = Departments()