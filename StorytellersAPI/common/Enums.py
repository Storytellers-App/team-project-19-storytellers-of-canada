from enum import Enum


# User type enum
class UserType(Enum):
    MEMBER = "MEMBER"
    ADMIN = "ADMIN"


# Story type enum
class StoryType(Enum):
    USER = "userstory"
    SAVED = 'storysave'
