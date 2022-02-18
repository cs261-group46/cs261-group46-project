
def to_api_return_data(*args):
    def single(arg):
        if isinstance(arg, str):
            return arg
        elif isinstance(arg, int):
            return str(arg)
        elif "to_json" in arg.__slots__:
            return arg.to_json()
        elif "get_api_return_data" in arg.__slots__:
            return arg.get_api_return_data()
    if len(args) == 0:
        return None
    elif len(args) == 1:
        return single(args[0])
    else:
        r_list = []
        for arg in args:
            r_list.append(single(arg))
        return r_list

