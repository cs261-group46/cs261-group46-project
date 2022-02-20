def is_valid_input(*args) -> bool:
    def validate(a):
        if a is None:
            return False
        if hasattr(a, "__iter__"):
            if "'" in a or '"' in a:
                return False
        return True

    if len(args) == 1:
        if isinstance(args[0], str):
            return validate(args[0])
        else:
            for sa in args:
                if not validate(sa):
                    return False
            return True
    else:
        for arg in args:
            if not is_valid_input(arg):
                return False
        return True